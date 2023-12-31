-- CreateTable
CREATE TABLE "reset_token" (
    "token" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_token_key" ON "reset_token"("token");
