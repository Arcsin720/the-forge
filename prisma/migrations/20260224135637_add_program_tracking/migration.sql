-- CreateTable
CREATE TABLE "ProgramTracking" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "energyLevel" SMALLINT NOT NULL,
    "soreness" SMALLINT NOT NULL,
    "motivation" SMALLINT NOT NULL,
    "adherenceRate" SMALLINT NOT NULL,
    "nutritionQuality" SMALLINT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramTracking_programId_week_key" ON "ProgramTracking"("programId", "week");

-- AddForeignKey
ALTER TABLE "ProgramTracking" ADD CONSTRAINT "ProgramTracking_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
