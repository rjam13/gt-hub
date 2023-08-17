/*
  Warnings:

  - The `tags` column on the `LobbySettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "lobbyTags" AS ENUM ('streetTires', 'streetSoft', 'streetMedium', 'streetHard', 'comfortTires', 'comfortSoft', 'comfortMedium', 'comfortHard', 'raceTires', 'raceSoft', 'raceMedium', 'raceHard', 'oneSpec', 'multiClass', 'rain', 'dry', 'customWeather', 'endurance', 'sprint', 'serious', 'relaxed');

-- AlterTable
ALTER TABLE "LobbySettings" DROP COLUMN "tags",
ADD COLUMN     "tags" "lobbyTags"[] DEFAULT ARRAY[]::"lobbyTags"[];

-- DropEnum
DROP TYPE "LobbyTags";
