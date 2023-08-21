-- DropForeignKey
ALTER TABLE "CarsInLobbies" DROP CONSTRAINT "CarsInLobbies_tuningSheetId_fkey";

-- AlterTable
ALTER TABLE "CarsInLobbies" ALTER COLUMN "tuningSheetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CarsInLobbies" ADD CONSTRAINT "CarsInLobbies_tuningSheetId_fkey" FOREIGN KEY ("tuningSheetId") REFERENCES "TuningSheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
