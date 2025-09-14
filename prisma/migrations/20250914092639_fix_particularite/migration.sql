/*
  Warnings:

  - You are about to drop the column `particularité` on the `Logement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Logement" DROP COLUMN "particularité",
ADD COLUMN     "particularite" JSONB;
