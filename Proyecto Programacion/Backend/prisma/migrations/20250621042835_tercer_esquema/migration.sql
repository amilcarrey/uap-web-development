/*
  Warnings:

  - You are about to drop the `BoardPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BoardPermission";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permission_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
