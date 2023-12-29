-- CreateEnum
CREATE TYPE "Try" AS ENUM ('LOGIN', 'CODE');

-- CreateTable
CREATE TABLE "CountTry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "where" "Try" NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "UserAgent" TEXT NOT NULL,

    CONSTRAINT "CountTry_pkey" PRIMARY KEY ("id")
);
