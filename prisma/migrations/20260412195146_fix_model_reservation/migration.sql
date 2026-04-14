-- DropIndex
DROP INDEX "Reservation_userId_listingId_key";

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Reservation_listingId_endDate_idx" ON "Reservation"("listingId", "endDate");
