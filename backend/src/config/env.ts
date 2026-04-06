import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: jwtSecret || 'dev-secret-local-only',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  freeCoachMessagesPerDay: 5,
  freeChaptersCount: 4, // Phase 1 is free
  // Hearts economy
  freeHeartsPerDay: 5,
  proHeartsPerDay: 15,
  heartCostMessage: 1,
  heartCostChapter: 2,
  heartCostExercise: 2,
  proPlusHeartsPerDay: 25,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  appleBundleId: process.env.APPLE_BUNDLE_ID || 'com.flirtiq.app',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
};
