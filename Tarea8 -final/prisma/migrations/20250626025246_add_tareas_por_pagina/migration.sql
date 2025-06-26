-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "allTasksUppercase" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "autoRefreshInterval" INTEGER NOT NULL DEFAULT 10,
    "tareasPorPagina" INTEGER NOT NULL DEFAULT 5,
    CONSTRAINT "UserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserConfig" ("allTasksUppercase", "autoRefreshInterval", "id", "theme", "userId") SELECT "allTasksUppercase", "autoRefreshInterval", "id", "theme", "userId" FROM "UserConfig";
DROP TABLE "UserConfig";
ALTER TABLE "new_UserConfig" RENAME TO "UserConfig";
CREATE UNIQUE INDEX "UserConfig_userId_key" ON "UserConfig"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
