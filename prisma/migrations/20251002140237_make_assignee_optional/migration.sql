-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_assigneeId_fkey";

-- AlterTable
ALTER TABLE "public"."Issue" ALTER COLUMN "assigneeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
