-- DropIndex
DROP INDEX "bans_banId_key";

-- AlterTable
ALTER TABLE "bans" ADD CONSTRAINT "bans_pkey" PRIMARY KEY ("banId");
