import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { prisma } from './config/prisma';
import authRoutes from './routes/auth';
import progressRoutes from './routes/progress';
import coachRoutes from './routes/coach';
import subscriptionRoutes from './routes/subscription';
import pdfRoutes from './routes/pdf';
import heartsRoutes from './routes/hearts';
const app = express();

// Trust proxy (Railway runs behind a reverse proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — restrict to app origins
app.use(cors({
  origin: env.nodeEnv === 'production'
    ? ['https://charismo.app', 'charismo://', 'exp://']
    : true,
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Stricter rate limiting for AI endpoints (cost protection)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down' },
});
app.use('/api/coach/message', aiLimiter);
app.use('/api/quiz/generate', aiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/hearts', heartsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
