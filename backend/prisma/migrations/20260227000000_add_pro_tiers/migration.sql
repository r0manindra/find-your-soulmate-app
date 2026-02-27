-- Add PRO and PRO_PLUS values to SubscriptionStatus enum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PRO';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PRO_PLUS';

-- Migrate existing PREMIUM users to PRO_PLUS (they had full access including voice)
UPDATE "User" SET "subscriptionStatus" = 'PRO_PLUS' WHERE "subscriptionStatus" = 'PREMIUM';

-- Add voice session tracking fields
ALTER TABLE "User" ADD COLUMN "dailyVoiceSessions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastVoiceResetDate" TEXT NOT NULL DEFAULT '';
