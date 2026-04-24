-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "errorMessage" TEXT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
