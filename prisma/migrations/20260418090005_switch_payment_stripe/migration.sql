/*
  Warnings:

  - You are about to drop the column `paddleTransactionId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `PaddleCustomer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PaddleCustomer" DROP CONSTRAINT "PaddleCustomer_userId_fkey";

-- DropIndex
DROP INDEX "Booking_paddleTransactionId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paddleTransactionId",
ADD COLUMN     "transactionId" TEXT;

-- DropTable
DROP TABLE "PaddleCustomer";

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_stripeCustomerId_key" ON "StripeCustomer"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_transactionId_key" ON "Booking"("transactionId");

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
