import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  freeCoachMessagesPerDay: 5,
  freeChaptersCount: 4, // Phase 1 is free
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  appleBundleId: process.env.APPLE_BUNDLE_ID || 'com.flirtiq.app',
};
