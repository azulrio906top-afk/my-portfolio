-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reason" TEXT,
    "comment" TEXT,
    "question" TEXT,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChatFeedback" ("answer", "comment", "createdAt", "id", "messageId", "question", "reason", "updatedAt", "value") SELECT "answer", "comment", "createdAt", "id", "messageId", "question", "reason", "updatedAt", "value" FROM "ChatFeedback";
DROP TABLE "ChatFeedback";
ALTER TABLE "new_ChatFeedback" RENAME TO "ChatFeedback";
CREATE UNIQUE INDEX "ChatFeedback_messageId_key" ON "ChatFeedback"("messageId");
CREATE INDEX "ChatFeedback_value_idx" ON "ChatFeedback"("value");
CREATE INDEX "ChatFeedback_createdAt_idx" ON "ChatFeedback"("createdAt");
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT,
    "location" TEXT,
    "summary" TEXT NOT NULL,
    "availability" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Profile" ("availability", "bio", "createdAt", "email", "headline", "id", "location", "name", "summary", "title", "updatedAt") SELECT "availability", "bio", "createdAt", "email", "headline", "id", "location", "name", "summary", "title", "updatedAt" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AdminUser_role_idx" ON "AdminUser"("role");

-- CreateIndex
CREATE INDEX "Experience_current_idx" ON "Experience"("current");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Skill_category_idx" ON "Skill"("category");

-- CreateIndex
CREATE INDEX "Skill_order_idx" ON "Skill"("order");
