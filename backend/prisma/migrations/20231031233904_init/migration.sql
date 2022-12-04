/*
  Warnings:

  - You are about to drop the column `activated2FA` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currentStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `losses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ratio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorAuthenticationSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `refreshToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayersOnMatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAvatar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserBlocked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFriend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlayersOnMatch" DROP CONSTRAINT "PlayersOnMatch_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayersOnMatch" DROP CONSTRAINT "PlayersOnMatch_playerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "_UserBlocked" DROP CONSTRAINT "_UserBlocked_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBlocked" DROP CONSTRAINT "_UserBlocked_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserFriend" DROP CONSTRAINT "_UserFriend_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFriend" DROP CONSTRAINT "_UserFriend_B_fkey";

-- DropIndex
DROP INDEX "User_displayName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activated2FA",
DROP COLUMN "avatarId",
DROP COLUMN "currentStatus",
DROP COLUMN "displayName",
DROP COLUMN "losses",
DROP COLUMN "ratio",
DROP COLUMN "twoFactorAuthenticationSecret",
DROP COLUMN "wins",
ADD COLUMN     "refreshTokenExp" TIMESTAMP(3),
ALTER COLUMN "refreshToken" SET DATA TYPE VARCHAR(512);

-- DropTable
DROP TABLE "Match";

-- DropTable
DROP TABLE "PlayersOnMatch";

-- DropTable
DROP TABLE "UserAvatar";

-- DropTable
DROP TABLE "_UserBlocked";

-- DropTable
DROP TABLE "_UserFriend";
