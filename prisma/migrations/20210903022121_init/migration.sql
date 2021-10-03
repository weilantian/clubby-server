-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleId" TEXT,
    "courseId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttendanceRecordToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AttendanceRecordToUser_AB_unique" ON "_AttendanceRecordToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AttendanceRecordToUser_B_index" ON "_AttendanceRecordToUser"("B");

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendanceRecordToUser" ADD FOREIGN KEY ("A") REFERENCES "AttendanceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendanceRecordToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
