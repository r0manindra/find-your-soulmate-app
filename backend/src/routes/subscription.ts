import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();
router.use(authMiddleware);

// GET /api/subscription/status
router.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { subscriptionStatus: true, revenuecatId: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const status = user.subscriptionStatus;
    const isPro = status === 'PRO' || status === 'PRO_PLUS' || status === 'PREMIUM';
    const isProPlus = status === 'PRO_PLUS' || status === 'PREMIUM';

    // Map to tier string for frontend
    const tier = isProPlus ? 'pro_plus' : isPro ? 'pro' : 'free';

    res.json({
      status: user.subscriptionStatus,
      tier,
      isPremium: isPro, // backward compat
      isPro,
      isProPlus,
      freeChapters: env.freeChaptersCount,
      freeCoachMessagesPerDay: env.freeCoachMessagesPerDay,
      voiceSessionsPerDay: env.proVoiceSessionsPerDay,
    });
  } catch (err) {
    console.error('Subscription status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const webhookSchema = z.object({
  revenuecatId: z.string(),
  status: z.enum(['PREMIUM', 'PRO', 'PRO_PLUS', 'EXPIRED', 'FREE']),
});

// POST /api/subscription/webhook — RevenueCat webhook
router.post('/webhook', async (req: AuthRequest, res: Response) => {
  try {
    const { revenuecatId, status } = webhookSchema.parse(req.body);

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        subscriptionStatus: status,
        revenuecatId,
      },
    });

    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
