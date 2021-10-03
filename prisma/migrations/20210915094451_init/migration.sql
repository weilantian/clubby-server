/*
  Warnings:

  - You are about to drop the column `visibleTo` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `visibleTo` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "visibleTo";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "visibleTo";
