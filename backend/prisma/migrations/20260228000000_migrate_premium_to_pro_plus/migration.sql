-- Migrate existing PREMIUM users to PRO_PLUS (they had full access including voice)
UPDATE "User" SET "subscriptionStatus" = 'PRO_PLUS' WHERE "subscriptionStatus" = 'PREMIUM';
