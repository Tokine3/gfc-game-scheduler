-- AlterTable
ALTER TABLE "PersonalSchedule" ADD COLUMN     "isPersonal" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PublicSchedule" ADD COLUMN     "isPersonal" BOOLEAN NOT NULL DEFAULT false;
