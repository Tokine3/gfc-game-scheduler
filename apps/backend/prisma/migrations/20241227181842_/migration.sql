/*
  Warnings:

  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[serverUserId,publicScheduleId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_serverUserId_publicScheduleId_key" ON "Participant"("serverUserId", "publicScheduleId");
