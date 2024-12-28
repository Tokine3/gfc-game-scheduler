-- DropIndex
DROP INDEX "Participant_serverUserId_publicScheduleId_key";

-- AlterTable
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_pkey" PRIMARY KEY ("id");
