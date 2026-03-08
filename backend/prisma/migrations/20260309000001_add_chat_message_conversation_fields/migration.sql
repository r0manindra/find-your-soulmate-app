-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN "conversationId" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "characterId" TEXT;

-- CreateIndex
CREATE INDEX "ChatMessage_userId_conversationId_createdAt_idx" ON "ChatMessage"("userId", "conversationId", "createdAt");
