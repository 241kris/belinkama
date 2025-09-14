"use server";

import { prisma } from "@/lib/prisma";
import type { Logement } from "@prisma/client";

// 🔹 Type sans `particularite`
export type MyLogement = Omit<Logement, "particularite"> & {
  images: { id: string; secureUrl: string; logementId: string }[];
  user: { firstName: string; lastName: string; phone: string; secondphone?: string };
};

export async function getMyLogements(userId: string): Promise<MyLogement[]> {
  const logements = await prisma.logement.findMany({
    where: { userId },
    include: {
      images: true,
      user: {
        select: { firstName: true, lastName: true, phone: true, secondphone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return logements.map((l): MyLogement => ({
    id: l.id,
    slug: l.slug,
    titre: l.titre,
    status: l.status,
    type: l.type,
    prix: l.prix,
    charge: l.charge,
    lieu: l.lieu,
    description: l.description,
    toilette: l.toilette,
    chambre: l.chambre,
    douche: l.douche,
    cuisine: l.cuisine,
    createdAt: l.createdAt,
    userId: l.userId,
    images: l.images.map((img) => ({
      id: img.id,
      secureUrl: img.secureUrl,
      logementId: img.logementId,
    })),
    user: {
      firstName: l.user.firstName,
      lastName: l.user.lastName,
      phone: l.user.phone,
      secondphone: l.user.secondphone || "",
    },
  }));
}
