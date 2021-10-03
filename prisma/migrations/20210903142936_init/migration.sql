-- CreateTable
CREATE TABLE "ClubInfo" (
    "id" TEXT NOT NULL DEFAULT E'default',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "designedMemberCount" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_doneBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_doneBy_AB_unique" ON "_doneBy"("A", "B");

-- CreateIndex
CREATE INDEX "_doneBy_B_index" ON "_doneBy"("B");

-- AddForeignKey
ALTER TABLE "_doneBy" ADD FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_doneBy" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
