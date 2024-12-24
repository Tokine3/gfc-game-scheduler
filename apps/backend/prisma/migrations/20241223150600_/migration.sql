/*
  Warnings:

  - The primary key for the `ServerUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,serverId]` on the table `ServerUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverUserId` to the `PersonalSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverUserId` to the `PublicSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PersonalSchedule" DROP CONSTRAINT "PersonalSchedule_userId_fkey";

-- AlterTable
ALTER TABLE "PersonalSchedule" ADD COLUMN     "serverUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PublicSchedule" ADD COLUMN     "serverUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ServerUser" DROP CONSTRAINT "ServerUser_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ServerUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ServerUser_userId_serverId_key" ON "ServerUser"("userId", "serverId");

-- AddForeignKey
ALTER TABLE "PublicSchedule" ADD CONSTRAINT "PublicSchedule_serverUserId_fkey" FOREIGN KEY ("serverUserId") REFERENCES "ServerUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalSchedule" ADD CONSTRAINT "PersonalSchedule_serverUserId_fkey" FOREIGN KEY ("serverUserId") REFERENCES "ServerUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
