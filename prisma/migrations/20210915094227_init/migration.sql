-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "startTime" SET DEFAULT E'',
ALTER COLUMN "startTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "due" SET DATA TYPE TEXT;
