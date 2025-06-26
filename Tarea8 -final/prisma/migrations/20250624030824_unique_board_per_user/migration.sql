/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Board_name_ownerId_key" ON "Board"("name", "ownerId");
