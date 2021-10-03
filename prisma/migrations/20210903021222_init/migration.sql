-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNSET');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('COURSE', 'ACTIVITY', 'TRIP', 'OTHER');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CHOOSE', 'SHORT_TEXT', 'LONG_TEXT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'WAIT', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT E'UNSET',
    "role" "Role" NOT NULL,
    "roleName" TEXT NOT NULL DEFAULT E'',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "type" "ScheduleType" NOT NULL DEFAULT E'COURSE',
    "custom_type" TEXT,
    "description" TEXT NOT NULL DEFAULT E'',
    "fileLinks" TEXT NOT NULL DEFAULT E'',
    "visibleTo" "Role"[],
    "courseId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visibleTo" "Role"[],
    "fileLinks" TEXT NOT NULL DEFAULT E'',
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionnaireQuestion" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "choose_options" TEXT[],
    "question" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wechatQQ" TEXT NOT NULL DEFAULT E'',
    "phoneNum" TEXT NOT NULL DEFAULT E'',
    "email" TEXT NOT NULL DEFAULT E'',
    "status" "Status" NOT NULL DEFAULT E'WAIT',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinRequestAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT,
    "answer" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "personal" BOOLEAN NOT NULL DEFAULT true,
    "publisherId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "answerUserId" TEXT,
    "content" TEXT NOT NULL DEFAULT E'',
    "answer" TEXT NOT NULL DEFAULT E'',
    "public" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScheduleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User.password_unique" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_courseId_unique" ON "Schedule"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "_ScheduleToUser_AB_unique" ON "_ScheduleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ScheduleToUser_B_index" ON "_ScheduleToUser"("B");

-- AddForeignKey
ALTER TABLE "Schedule" ADD FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequestAnswer" ADD FOREIGN KEY ("questionId") REFERENCES "QuestionnaireQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD FOREIGN KEY ("publisherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD FOREIGN KEY ("publisherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD FOREIGN KEY ("answerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToUser" ADD FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
