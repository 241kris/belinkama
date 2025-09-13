 "use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { Logement } from "@/types/logements";
 

export async function getMyLogements(): Promise<Logement[]> {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Vous devez être connecté");

  const payload = verifyJwt(token);
  if (!payload) throw new Error("Token invalide");

  const userId = payload.userId;

  const logements = await prisma.logement.findMany({
    where: { userId },
    include: { images: true, user: true }, // 👈 on inclut `user`
    orderBy: { createdAt: "desc" },
  });

  // on mappe pour correspondre exactement à ton type TS
  return logements.map((l) => ({
    slug: l.slug,
    id: l.id,
    titre: l.titre,
    status: l.status,
    type: l.type,
    prix: l.prix,
    charge: l.charge,
    visible: true, // par défaut si tu n’as pas de champ `visible` en BDD
    lieu: l.lieu,
    images: l.images.map((img) => ({
      id: img.id,
      secureUrl: img.secureUrl,
      logementId: img.logementId,
    })),
    douche: l.douche,
    cuisine: l.cuisine,
    chambre: l.chambre,
    toilette: l.toilette,
    description: l.description,
    particularité: l.particularité as string[],
    createdAt: l.createdAt.toISOString(),
    user: {
      secondphone: l.user.secondphone || "",
      firstName: l.user.firstName,
      lastName: l.user.lastName,
      phone: l.user.phone,
    },
  }));
}
