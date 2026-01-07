-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_userId_key" ON "BankAccount"("userId");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
