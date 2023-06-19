-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_id_fkey";

-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "manufacturerId" TEXT;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
