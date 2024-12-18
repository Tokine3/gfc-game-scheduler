/*
  Warnings:

  - The primary key for the `ServerUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ServerUser` table. All the data in the column will be lost.
  - Added the required column `title` to the `PersonalSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonalSchedule" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServerUser" DROP CONSTRAINT "ServerUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ServerUser_pkey" PRIMARY KEY ("userId", "serverId");
