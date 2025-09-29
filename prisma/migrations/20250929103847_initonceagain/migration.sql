/*
  Warnings:

  - A unique constraint covering the columns `[organisationId,key]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Issue" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_organisationId_key_key" ON "public"."Project"("organisationId", "key");
