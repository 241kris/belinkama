// app/actions/getLogements.ts
"use server";

import {prisma} from "@/lib/prisma";

import type { Prisma } from "@prisma/client"; 

export type LogementWithRelations = Prisma.LogementGetPayload<{
  include: {
    images: true;
    user: {
      select: {
        firstName: true;
        lastName: true;
        phone: true;
      };
    };
  };
}>;

export async function getLogements(): Promise<{
  message: string;
  data: LogementWithRelations[];
}> {
  try {
    const logements = await prisma.logement.findMany({
      where: { status:  'ACTIF' },
      include: {
        images: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (logements.length === 0) {
      return { message: "Aucun logement trouvé", data: [] };
    }

    return { message: "Logements récupérés avec succès", data: logements };
  } catch (error) {
    console.error("Erreur lors de la récupération des logements :", error);
    return { message: "Erreur interne du serveur", data: [] };
  }
}
