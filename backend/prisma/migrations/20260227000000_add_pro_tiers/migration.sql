-- Add PRO and PRO_PLUS values to SubscriptionStatus enum
ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'PRO';
ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'PRO_PLUS';

-- Add voice session tracking fields
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dailyVoiceSessions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastVoiceResetDate" TEXT NOT NULL DEFAULT '';
