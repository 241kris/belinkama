 "use server";

import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function reportLogement(
  logementId: string,
  type: "OCCUPE" | "FAUSSE_ANNONCE"
) {
  // 1. Lire le cookie JWT
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    throw new Error("Vous devez être connecté");
  }

  // 2. Vérifier le JWT
  const payload = verifyJwt(token);
  if (!payload) {
    throw new Error("Token invalide");
  }

  const userId = payload.userId;

  // 3. Vérifier que le logement existe
  const logement = await prisma.logement.findUnique({ where: { id: logementId } });
  if (!logement) {
    throw new Error("Logement introuvable");
  }

  // 4. Vérifier si l'utilisateur a déjà signalé
  const existing = await prisma.report.findFirst({
    where: { logementId, userId, type },
  });
  if (existing) {
    throw new Error("Vous avez déjà signalé ce logement pour ce motif");
  }

  // 5. Créer le signalement
  await prisma.report.create({
    data: { logementId, userId, type },
  });

  // 6. Compter les signalements
  const counts = await prisma.report.groupBy({
    by: ["type"],
    where: { logementId },
    _count: { type: true },
  });

  const occupeCount = counts.find((c) => c.type === "OCCUPE")?._count.type || 0;
  const fausseAnnonceCount =
    counts.find((c) => c.type === "FAUSSE_ANNONCE")?._count.type || 0;

  let newStatus: "ACTIF" | "DESACTIVE" | "BLOQUE" | undefined;
  if (occupeCount >= 2) {
    newStatus = "DESACTIVE";
  } else if (fausseAnnonceCount > 1) {
    newStatus = "BLOQUE";
  }

  if (newStatus) {
    await prisma.logement.update({
      where: { id: logementId },
      data: { status: newStatus },
    });
  }

  return { success: true, message: "Signalement enregistré avec succès" };
}
