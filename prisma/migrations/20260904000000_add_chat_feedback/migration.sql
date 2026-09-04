CREATE TABLE "ChatFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reason" TEXT,
    "comment" TEXT,
    "question" TEXT,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "ChatFeedback_messageId_key" ON "ChatFeedback"("messageId");
CREATE INDEX "ChatFeedback_value_idx" ON "ChatFeedback"("value");
CREATE INDEX "ChatFeedback_createdAt_idx" ON "ChatFeedback"("createdAt");
