/*
  Warnings:

  - A unique constraint covering the columns `[userId,boardId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_userId_boardId_key" ON "Permission"("userId", "boardId");
