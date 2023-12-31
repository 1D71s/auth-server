/*
  Warnings:

  - Added the required column `count` to the `attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attempt" ADD COLUMN     "count" INTEGER NOT NULL;
