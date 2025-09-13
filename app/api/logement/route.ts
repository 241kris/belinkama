import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

import { cookies } from "next/headers";
import { logementSchema, allowedMimeTypes } from "@/app/schemas/logement";

import slugify from "slugify";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: "ddqqypjy0",
  api_key: "931367124519629",
  api_secret: "KoigvAs7T0bZBhkrVswvoFIhGgw",
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    const userId = payload.userId;

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    if (files.length > 6) return NextResponse.json({ error: "Maximum 6 images" }, { status: 400 });

    // Préparation logement
    const particularites = formData.getAll("particularité") as string[];
    const logementData = {
      titre: formData.get("titre") as string,
      type: formData.get("type") as string,
      prix: Number(formData.get("prix")),
      charge: formData.get("charge") === "true",
      slug: slugify(formData.get("titre") as string, { lower: true, strict: true }),
      lieu: formData.get("lieu") as string,
      douche: formData.get("douche") ? Number(formData.get("douche")) : null,
      cuisine: formData.get("cuisine") ? Number(formData.get("cuisine")) : null,
      chambre: formData.get("chambre") ? Number(formData.get("chambre")) : null,
      toilette: formData.get("toilette") === "true",
      description: formData.get("description") as string,
      particularité: particularites,
    
      userId,
    };

    logementSchema.parse({ ...logementData });

    // Création du logement
    const logement = await prisma.logement.create({data: logementData });

    // Upload des images + création en BDD
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: "Format image invalide" }, { status: 400 });
      }


      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `logements/${userId}` },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      // Stockage image en BDD
      await prisma.image.create({
        data: {
          logementId: logement.id,
          secureUrl: result.secure_url,
          publicId: result.public_id,
        },
      });
    }

    return NextResponse.json({ logement }, { status: 201 });
  } catch (err: unknown) {
    console.error("Erreur API logement:", err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // Cas ZodError (issues)
    if (err && typeof err === "object" && "issues" in err) {
      const e = err as { issues: Array<{ path?: string[]; message: string }> };
      return NextResponse.json({ error: e.issues.map(i => i.message).join(", ") }, { status: 400 });
    }

    return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
  }
}




 