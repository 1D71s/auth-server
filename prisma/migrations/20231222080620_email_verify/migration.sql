/*
  Warnings:

  - You are about to drop the column `description` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "description",
ADD COLUMN     "emailVerify" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EmailConfirm" (
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirm_code_key" ON "EmailConfirm"("code");

-- AddForeignKey
ALTER TABLE "EmailConfirm" ADD CONSTRAINT "EmailConfirm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
