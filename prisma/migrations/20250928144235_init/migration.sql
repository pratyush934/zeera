/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."SprintStatus" AS ENUM ('PLANNED', 'COMPLETED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "public"."IssueStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "public"."IssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."Profile";

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sprint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."SprintStatus" NOT NULL DEFAULT 'PLANNED',
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Issue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."IssueStatus" NOT NULL,
    "order" INTEGER NOT NULL,
    "priority" "public"."IssuePriority" NOT NULL,
    "reporterId" TEXT,
    "assigneeId" TEXT NOT NULL,
    "projectId" TEXT,
    "sprintId" TEXT,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issue_status_order_key" ON "public"."Issue"("status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "public"."User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "public"."Sprint" ADD CONSTRAINT "Sprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "public"."Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
