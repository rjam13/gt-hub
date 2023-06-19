/*
  Warnings:

  - The `tiresFront` column on the `TuningSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tiresRear` column on the `TuningSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `suspension` column on the `TuningSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `differential` column on the `TuningSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tvcDifferential` column on the `TuningSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "tire" AS ENUM ('comfortHard', 'comfortMedium', 'comfortSoft', 'sportsHard', 'sportsMedium', 'sportsSoft', 'racingHard', 'racingMedium', 'racingSoft', 'racingIntermediate', 'racingHeavyWet', 'dirt');

-- CreateEnum
CREATE TYPE "suspension" AS ENUM ('normal', 'sports', 'heightAdjustable', 'fullyCustom');

-- CreateEnum
CREATE TYPE "differential" AS ENUM ('normal', 'oneWay', 'twoWay', 'fullyCustom');

-- CreateEnum
CREATE TYPE "ecu" AS ENUM ('normal', 'sports', 'fullControl');

-- CreateEnum
CREATE TYPE "transmission" AS ENUM ('normal', 'lowCloseRatio', 'highCloseRatio', 'fullyCustomManual', 'fullyCustomAuto');

-- CreateEnum
CREATE TYPE "nitrous" AS ENUM ('none', 'normal', 'nitrous');

-- CreateEnum
CREATE TYPE "centerDiff" AS ENUM ('none', 'normal', 'torqueVectoring');

-- CreateEnum
CREATE TYPE "turbo" AS ENUM ('none', 'low', 'Medium', 'high', 'ultraHigh');

-- CreateEnum
CREATE TYPE "antiLag" AS ENUM ('off', 'weak', 'strong');

-- CreateEnum
CREATE TYPE "intercooler" AS ENUM ('none', 'normal', 'sport', 'racing');

-- CreateEnum
CREATE TYPE "supercharger" AS ENUM ('none', 'lowEnd', 'highEnd', 'highRPM');

-- CreateEnum
CREATE TYPE "airCleaner" AS ENUM ('none', 'normal', 'sports', 'racing');

-- CreateEnum
CREATE TYPE "muffler" AS ENUM ('normal', 'sports', 'semiRacing', 'racing');

-- CreateEnum
CREATE TYPE "manifold" AS ENUM ('none', 'normal', 'racing');

-- CreateEnum
CREATE TYPE "brakes" AS ENUM ('normal', 'sport', 'racingSlotted', 'racingDrilled', 'carbon');

-- CreateEnum
CREATE TYPE "brakePads" AS ENUM ('normal', 'sport', 'racing');

-- CreateEnum
CREATE TYPE "clutch" AS ENUM ('normal', 'sports', 'semiRacing', 'racing');

-- CreateEnum
CREATE TYPE "propShaft" AS ENUM ('none', 'normal', 'carbon');

-- AlterTable
ALTER TABLE "TuningSheet" ADD COLUMN     "HighCompPistons" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "RacingCrankShaft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "TitaniumRodsPist" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "airCleaner" "airCleaner" NOT NULL DEFAULT 'normal',
ADD COLUMN     "antiLag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "antiLagSetting" "antiLag" NOT NULL DEFAULT 'off',
ADD COLUMN     "ballast" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ballastPos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bodyRigidity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "boreUp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "brakeBalance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "brakeFRBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "brakePads" "brakePads" NOT NULL DEFAULT 'normal',
ADD COLUMN     "brakes" "brakes" NOT NULL DEFAULT 'normal',
ADD COLUMN     "clutch" "clutch" NOT NULL DEFAULT 'normal',
ADD COLUMN     "downforceFront" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "downforceRear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ecu" "ecu" NOT NULL DEFAULT 'normal',
ADD COLUMN     "ecuOutput" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "engineBalanceTune" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fourWheelSteering" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gears" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "handBrake" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "handBrakeTorq" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highLiftCamShafts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "intercooler" "intercooler" NOT NULL DEFAULT 'normal',
ADD COLUMN     "manifold" "manifold" NOT NULL DEFAULT 'normal',
ADD COLUMN     "muffler" "muffler" NOT NULL DEFAULT 'normal',
ADD COLUMN     "nitrous" "nitrous" NOT NULL DEFAULT 'none',
ADD COLUMN     "nitrousOutput" INTEGER DEFAULT 0,
ADD COLUMN     "polishPorts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "powerRes" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "propShaft" "propShaft" NOT NULL DEFAULT 'normal',
ADD COLUMN     "rearSteerAngle" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "steeringKit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "strokeUp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supercharger" "supercharger" NOT NULL DEFAULT 'none',
ADD COLUMN     "topSpeed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transmission" "transmission" NOT NULL DEFAULT 'normal',
ADD COLUMN     "turbo" "turbo" NOT NULL DEFAULT 'none',
ADD COLUMN     "weightReduction" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "tiresFront",
ADD COLUMN     "tiresFront" "tire" NOT NULL DEFAULT 'comfortHard',
DROP COLUMN "tiresRear",
ADD COLUMN     "tiresRear" "tire" NOT NULL DEFAULT 'comfortHard',
DROP COLUMN "suspension",
ADD COLUMN     "suspension" "suspension" NOT NULL DEFAULT 'normal',
DROP COLUMN "differential",
ADD COLUMN     "differential" "differential" NOT NULL DEFAULT 'normal',
DROP COLUMN "tvcDifferential",
ADD COLUMN     "tvcDifferential" "centerDiff" NOT NULL DEFAULT 'none';

-- DropEnum
DROP TYPE "differentialChoices";

-- DropEnum
DROP TYPE "suspensionChoices";

-- DropEnum
DROP TYPE "tireChoices";
