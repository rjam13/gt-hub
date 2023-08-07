-- CreateEnum
CREATE TYPE "LobbyTags" AS ENUM ('streetTires', 'streetSoft', 'streetMedium', 'streetHard', 'comfortTires', 'comfortSoft', 'comfortMedium', 'comfortHard', 'raceTires', 'raceSoft', 'raceMedium', 'raceHard', 'oneSpec', 'multiClass', 'rain', 'dry', 'customWeather', 'endurance', 'sprint', 'serious', 'relaxed');

-- CreateEnum
CREATE TYPE "carCategory" AS ENUM ('gr1', 'gr2', 'gr3', 'gr4', 'grB', 'grX');

-- CreateTable
CREATE TABLE "Track" (
    "name" TEXT NOT NULL,
    "image" TEXT,
    "location" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "TrackLayout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "trackName" TEXT NOT NULL,

    CONSTRAINT "TrackLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lobby" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TIMESTAMP(3) NOT NULL,
    "lobbySettingsId" TEXT NOT NULL,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LobbySettings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" "LobbyTags"[] DEFAULT ARRAY[]::"LobbyTags"[],
    "userId" TEXT NOT NULL,
    "ppRating" SMALLINT NOT NULL,
    "grRating" "carCategory"[] DEFAULT ARRAY[]::"carCategory"[],
    "maxPower" INTEGER,
    "minimumWeight" INTEGER,

    CONSTRAINT "LobbySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInLobbies" (
    "userId" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isHost" BOOLEAN NOT NULL,

    CONSTRAINT "UsersInLobbies_pkey" PRIMARY KEY ("userId","lobbyId")
);

-- CreateTable
CREATE TABLE "CarsInLobbies" (
    "carId" TEXT NOT NULL,
    "LobbySettingsId" TEXT NOT NULL,
    "tuningSheetId" TEXT NOT NULL,

    CONSTRAINT "CarsInLobbies_pkey" PRIMARY KEY ("carId","LobbySettingsId")
);

-- CreateTable
CREATE TABLE "_LobbySettingsToTrackLayout" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LobbySettingsToTrackLayout_AB_unique" ON "_LobbySettingsToTrackLayout"("A", "B");

-- CreateIndex
CREATE INDEX "_LobbySettingsToTrackLayout_B_index" ON "_LobbySettingsToTrackLayout"("B");

-- AddForeignKey
ALTER TABLE "TrackLayout" ADD CONSTRAINT "TrackLayout_trackName_fkey" FOREIGN KEY ("trackName") REFERENCES "Track"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_lobbySettingsId_fkey" FOREIGN KEY ("lobbySettingsId") REFERENCES "LobbySettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbySettings" ADD CONSTRAINT "LobbySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInLobbies" ADD CONSTRAINT "UsersInLobbies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInLobbies" ADD CONSTRAINT "UsersInLobbies_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarsInLobbies" ADD CONSTRAINT "CarsInLobbies_carId_fkey" FOREIGN KEY ("carId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarsInLobbies" ADD CONSTRAINT "CarsInLobbies_LobbySettingsId_fkey" FOREIGN KEY ("LobbySettingsId") REFERENCES "LobbySettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarsInLobbies" ADD CONSTRAINT "CarsInLobbies_tuningSheetId_fkey" FOREIGN KEY ("tuningSheetId") REFERENCES "TuningSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LobbySettingsToTrackLayout" ADD CONSTRAINT "_LobbySettingsToTrackLayout_A_fkey" FOREIGN KEY ("A") REFERENCES "LobbySettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LobbySettingsToTrackLayout" ADD CONSTRAINT "_LobbySettingsToTrackLayout_B_fkey" FOREIGN KEY ("B") REFERENCES "TrackLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
