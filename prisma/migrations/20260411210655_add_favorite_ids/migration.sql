-- AlterTable
ALTER TABLE "user" ADD COLUMN     "favoriteIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
