-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "tireChoices" AS ENUM ('comfortHard', 'comfortMedium', 'comfortSoft', 'sportsHard', 'sportsMedium', 'sportsSoft', 'racingHard', 'racingMedium', 'racingSoft', 'racingIntermediate', 'racingHeavyWet', 'dirt');

-- CreateEnum
CREATE TYPE "suspensionChoices" AS ENUM ('normal', 'sports', 'heightAdjustable', 'fullyCustom');

-- CreateEnum
CREATE TYPE "differentialChoices" AS ENUM ('normal', 'oneWay', 'twoWay', 'fullyCustom');

-- AlterTable
ALTER TABLE "Manufacturer" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "CarModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuningSheet" (
    "id" TEXT NOT NULL,
    "authorId" TEXT,
    "title" VARCHAR(250) NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "UploadStatus" NOT NULL DEFAULT 'draft',
    "carId" TEXT,
    "performancePoints" DECIMAL(5,2) NOT NULL,
    "tiresFront" "tireChoices" NOT NULL DEFAULT 'comfortHard',
    "tiresRear" "tireChoices" NOT NULL DEFAULT 'comfortHard',
    "suspension" "suspensionChoices" NOT NULL DEFAULT 'normal',
    "heightFront" INTEGER NOT NULL,
    "heightRear" INTEGER NOT NULL,
    "rollBarFront" INTEGER NOT NULL,
    "rollBarRear" INTEGER NOT NULL,
    "compressionFront" INTEGER NOT NULL,
    "compressionRear" INTEGER NOT NULL,
    "expansionFront" INTEGER NOT NULL,
    "expansionRear" INTEGER NOT NULL,
    "naturalFreqFront" DECIMAL(4,2) NOT NULL,
    "naturalFreqRear" DECIMAL(4,2) NOT NULL,
    "camberFront" DECIMAL(3,1) NOT NULL,
    "camberRear" DECIMAL(3,1) NOT NULL,
    "toeFront" DECIMAL(3,2) NOT NULL,
    "toeRear" DECIMAL(3,2) NOT NULL,
    "differential" "differentialChoices" NOT NULL DEFAULT 'normal',
    "initTorqueFront" INTEGER NOT NULL,
    "initTorqueRear" INTEGER NOT NULL,
    "accelSensFront" INTEGER NOT NULL,
    "accelSensRear" INTEGER NOT NULL,
    "brakingSensFront" INTEGER NOT NULL,
    "brakingSensRear" INTEGER NOT NULL,
    "tvcDifferential" BOOLEAN NOT NULL,
    "frontRearDis" VARCHAR(10) NOT NULL,

    CONSTRAINT "TuningSheet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_id_fkey" FOREIGN KEY ("id") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningSheet" ADD CONSTRAINT "TuningSheet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningSheet" ADD CONSTRAINT "TuningSheet_carId_fkey" FOREIGN KEY ("carId") REFERENCES "CarModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
