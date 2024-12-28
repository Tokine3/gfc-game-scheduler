/*
  Warnings:

  - The values [UNDECIDED] on the enum `Reaction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Reaction_new" AS ENUM ('OK', 'PENDING', 'NG');
ALTER TABLE "Participant" ALTER COLUMN "reaction" TYPE "Reaction_new" USING ("reaction"::text::"Reaction_new");
ALTER TYPE "Reaction" RENAME TO "Reaction_old";
ALTER TYPE "Reaction_new" RENAME TO "Reaction";
DROP TYPE "Reaction_old";
COMMIT;
