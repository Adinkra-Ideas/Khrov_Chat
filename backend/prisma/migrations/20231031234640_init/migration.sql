/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
