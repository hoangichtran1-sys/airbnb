/*
  Warnings:

  - The values [CANCELLED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCELLED] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');
ALTER TABLE "public"."Reservation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Reservation" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "public"."ReservationStatus_old";
ALTER TABLE "Reservation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
