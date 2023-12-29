/*
  Warnings:

  - You are about to drop the `CountTry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailConfirm` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AttemptType" AS ENUM ('LOGIN', 'CODE');

-- DropForeignKey
ALTER TABLE "EmailConfirm" DROP CONSTRAINT "EmailConfirm_userId_fkey";

-- DropTable
DROP TABLE "CountTry";

-- DropTable
DROP TABLE "EmailConfirm";

-- DropEnum
DROP TYPE "Try";

-- CreateTable
CREATE TABLE "email_confirm" (
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "where" "AttemptType" NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "UserAgent" TEXT NOT NULL,

    CONSTRAINT "attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_confirm_code_key" ON "email_confirm"("code");

-- AddForeignKey
ALTER TABLE "email_confirm" ADD CONSTRAINT "email_confirm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
