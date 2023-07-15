-- DropForeignKey
ALTER TABLE "TuningSheet" DROP CONSTRAINT "TuningSheet_carId_fkey";

-- AddForeignKey
ALTER TABLE "TuningSheet" ADD CONSTRAINT "TuningSheet_carId_fkey" FOREIGN KEY ("carId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
