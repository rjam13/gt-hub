/*
  Warnings:

  - The primary key for the `CarsInLobbies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carId` on the `CarsInLobbies` table. All the data in the column will be lost.
  - Added the required column `carModelId` to the `CarsInLobbies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarsInLobbies" DROP CONSTRAINT "CarsInLobbies_carId_fkey";

-- AlterTable
ALTER TABLE "CarsInLobbies" DROP CONSTRAINT "CarsInLobbies_pkey",
DROP COLUMN "carId",
ADD COLUMN     "carModelId" TEXT NOT NULL,
ADD CONSTRAINT "CarsInLobbies_pkey" PRIMARY KEY ("carModelId", "LobbySettingsId");

-- AddForeignKey
ALTER TABLE "CarsInLobbies" ADD CONSTRAINT "CarsInLobbies_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
