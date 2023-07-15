/*
  Warnings:

  - Made the column `authorId` on table `TuningSheet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carId` on table `TuningSheet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TuningSheet" ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "carId" SET NOT NULL,
ALTER COLUMN "frontRearDis" SET DEFAULT '0 : 100';
