/*
  Warnings:

  - You are about to drop the column `createdBy` on the `PublicSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `PublicSchedule` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `PersonalSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `PersonalSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `PublicSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `PublicSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonalSchedule" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublicSchedule" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PublicSchedule" ADD CONSTRAINT "PublicSchedule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicSchedule" ADD CONSTRAINT "PublicSchedule_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalSchedule" ADD CONSTRAINT "PersonalSchedule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalSchedule" ADD CONSTRAINT "PersonalSchedule_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
