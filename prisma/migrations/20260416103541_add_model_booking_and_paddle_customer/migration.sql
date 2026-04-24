-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'FAILED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paddleTransactionId" TEXT,
    "amountPaid" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaddleCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paddleCustomerId" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaddleCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reservationId_key" ON "Booking"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paddleTransactionId_key" ON "Booking"("paddleTransactionId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddleCustomer_userId_key" ON "PaddleCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddleCustomer_paddleCustomerId_key" ON "PaddleCustomer"("paddleCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddleCustomer_email_key" ON "PaddleCustomer"("email");

-- CreateIndex
CREATE INDEX "Listing_locationValue_idx" ON "Listing"("locationValue");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaddleCustomer" ADD CONSTRAINT "PaddleCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
