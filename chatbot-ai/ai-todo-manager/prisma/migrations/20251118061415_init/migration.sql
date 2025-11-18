-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL DEFAULT 'other',
    "dueDate" DATETIME,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT
);

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_category_idx" ON "Task"("category");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");
