import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();
router.use(authMiddleware);

function getMaxDailyHearts(status: string): number {
  if (status === 'PRO_PLUS' || status === 'PREMIUM') return Infinity;
  if (status === 'PRO') return env.proHeartsPerDay;
  return env.freeHeartsPerDay;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// GET /api/hearts/status
router.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        subscriptionStatus: true,
        dailyHeartsUsed: true,
        lastHeartsResetDate: true,
        bonusHearts: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const today = getTodayString();
    let dailyUsed = user.dailyHeartsUsed;

    // Reset if new day
    if (user.lastHeartsResetDate !== today) {
      dailyUsed = 0;
      await prisma.user.update({
        where: { id: req.userId },
        data: { dailyHeartsUsed: 0, lastHeartsResetDate: today },
      });
    }

    const maxDaily = getMaxDailyHearts(user.subscriptionStatus);
    const dailyRemaining = maxDaily === Infinity ? Infinity : Math.max(0, maxDaily - dailyUsed);

    res.json({
      dailyRemaining: dailyRemaining === Infinity ? null : dailyRemaining,
      maxDaily: maxDaily === Infinity ? null : maxDaily,
      bonus: user.bonusHearts,
      lastReset: today,
      unlimited: maxDaily === Infinity,
    });
  } catch (err) {
    console.error('Hearts status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const spendSchema = z.object({
  amount: z.number().min(1).max(10),
  action: z.enum(['message', 'chapter', 'exercise']),
});

// POST /api/hearts/spend
router.post('/spend', async (req: AuthRequest, res: Response) => {
  try {
    const { amount, action } = spendSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        subscriptionStatus: true,
        dailyHeartsUsed: true,
        lastHeartsResetDate: true,
        bonusHearts: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // PRO+ users have unlimited hearts
    const maxDaily = getMaxDailyHearts(user.subscriptionStatus);
    if (maxDaily === Infinity) {
      res.json({
        success: true,
        dailyRemaining: null,
        bonus: user.bonusHearts,
        unlimited: true,
      });
      return;
    }

    const today = getTodayString();
    let dailyUsed = user.dailyHeartsUsed;

    if (user.lastHeartsResetDate !== today) {
      dailyUsed = 0;
    }

    const dailyRemaining = Math.max(0, maxDaily - dailyUsed);
    const totalAvailable = dailyRemaining + user.bonusHearts;

    if (totalAvailable < amount) {
      res.status(429).json({
        error: 'Not enough hearts',
        dailyRemaining,
        bonus: user.bonusHearts,
        resetAt: 'midnight',
      });
      return;
    }

    // Deduct daily first, then bonus
    let remaining = amount;
    const dailyDeduct = Math.min(dailyRemaining, remaining);
    remaining -= dailyDeduct;
    const bonusDeduct = remaining;

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        dailyHeartsUsed: dailyUsed + dailyDeduct,
        lastHeartsResetDate: today,
        bonusHearts: user.bonusHearts - bonusDeduct,
      },
    });

    res.json({
      success: true,
      dailyRemaining: Math.max(0, maxDaily - dailyUsed - dailyDeduct),
      bonus: user.bonusHearts - bonusDeduct,
      unlimited: false,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Hearts spend error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
