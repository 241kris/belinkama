"use server";

import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import cloudinary from "@/lib/cloudinary";

export async function toggleLogementStatus(logementId: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Non autorisé");

  const payload = verifyJwt(token);
  if (!payload) throw new Error("Token invalide");

  const logement = await prisma.logement.findUnique({ where: { id: logementId } });
  if (!logement) throw new Error("Logement non trouvé");
  if (logement.userId !== payload.userId) throw new Error("Action interdite");
  if (logement.status === "BLOQUE") throw new Error("Logement bloqué");

  return await prisma.logement.update({
    where: { id: logementId },
    data: { status: logement.status === "ACTIF" ? "DESACTIVE" : "ACTIF" },
  });
}

  

export async function deleteLogement(logementId: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Non autorisé");

  const payload = verifyJwt(token);
  if (!payload) throw new Error("Token invalide");

  const logement = await prisma.logement.findUnique({
    where: { id: logementId },
    include: { images: true },
  });

  if (!logement) throw new Error("Logement non trouvé");
  if (logement.userId !== payload.userId) throw new Error("Action interdite");

  // Supprimer les images sur Cloudinary
  for (const img of logement.images) {
    try {
      await cloudinary.uploader.destroy(img.publicId);
    } catch (err) {
      console.error("Erreur suppression image Cloudinary :", err);
    }
  }

  // Supprimer le logement
  await prisma.logement.delete({ where: { id: logementId } });
}
