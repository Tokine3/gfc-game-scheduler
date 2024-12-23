/*
  Warnings:

  - You are about to drop the column `createdById` on the `PersonalSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `PersonalSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `PublicSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `recruitCount` on the `PublicSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `PublicSchedule` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `PersonalSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `PersonalSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `PublicSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `PublicSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PersonalSchedule" DROP CONSTRAINT "PersonalSchedule_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PersonalSchedule" DROP CONSTRAINT "PersonalSchedule_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "PublicSchedule" DROP CONSTRAINT "PublicSchedule_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PublicSchedule" DROP CONSTRAINT "PublicSchedule_updatedById_fkey";

-- AlterTable
ALTER TABLE "PersonalSchedule" DROP COLUMN "createdById",
DROP COLUMN "updatedById",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublicSchedule" DROP COLUMN "createdById",
DROP COLUMN "recruitCount",
DROP COLUMN "updatedById",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "quota" INTEGER DEFAULT 0,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServerUser" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;
