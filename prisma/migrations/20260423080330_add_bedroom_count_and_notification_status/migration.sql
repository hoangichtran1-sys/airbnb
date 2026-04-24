/*
  Warnings:

  - Added the required column `bedroomCount` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('READ', 'UNREAD');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "bedroomCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD';
