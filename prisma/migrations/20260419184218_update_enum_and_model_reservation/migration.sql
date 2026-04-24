-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_reservationId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "reservationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
