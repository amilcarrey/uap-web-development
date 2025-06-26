/*
  Warnings:

  - A unique constraint covering the columns `[boardId,userId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_boardId_userId_key" ON "Permission"("boardId", "userId");
