/*
  Warnings:

  - You are about to drop the column `key` on the `UserSetting` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `UserSetting` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "autoRefreshInterval" INTEGER,
    "viewMode" TEXT,
    CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserSetting" ("autoRefreshInterval", "id", "userId", "viewMode") SELECT "autoRefreshInterval", "id", "userId", "viewMode" FROM "UserSetting";
DROP TABLE "UserSetting";
ALTER TABLE "new_UserSetting" RENAME TO "UserSetting";
CREATE UNIQUE INDEX "UserSetting_userId_key" ON "UserSetting"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
