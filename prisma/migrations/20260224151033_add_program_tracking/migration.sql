/*
  Warnings:

  - You are about to drop the column `date` on the `ProgramTracking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProgramTracking" DROP COLUMN "date",
ALTER COLUMN "energyLevel" SET DATA TYPE INTEGER,
ALTER COLUMN "soreness" SET DATA TYPE INTEGER,
ALTER COLUMN "motivation" SET DATA TYPE INTEGER,
ALTER COLUMN "adherenceRate" SET DATA TYPE INTEGER,
ALTER COLUMN "nutritionQuality" SET DATA TYPE INTEGER;
