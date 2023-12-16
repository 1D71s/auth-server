/*
  Warnings:

  - Added the required column `endBan` to the `bans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bans" ADD COLUMN     "endBan" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startBan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
