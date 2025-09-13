import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Récupération du slug depuis les params
    const { slug } = await params;

    // Recherche du logement avec l'utilisateur et les images liés
    const logement = await prisma.logement.findFirst({
      where: { slug },
      include: {
        user: true,    // ✅ nom correct de la relation dans Prisma
        images: true,  // ✅ nom correct de la relation pour les images
      },
    });

    // Si aucun logement trouvé
    if (!logement) {
      return NextResponse.json(
        { error: "Logement introuvable" },
        { status: 404 }
      );
    }

    // Retour JSON avec les relations incluses
    return NextResponse.json({
      ...logement,
      user: logement.user,
      images: logement.images,
    });
  } catch (err) {
    console.error("Erreur GET logement par slug:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer ce logement" },
      { status: 500 }
    );
  }
}
