import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { getCoachResponse } from '../services/coach';
import { env } from '../config/env';

const router = Router();
router.use(authMiddleware);

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
});

// POST /api/coach/message
router.post('/message', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = messageSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        subscriptionStatus: true,
        dailyCoachMessages: true,
        lastCoachResetDate: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Rate limiting for free users
    const today = new Date().toISOString().split('T')[0];
    let dailyCount = user.dailyCoachMessages;

    if (user.lastCoachResetDate !== today) {
      dailyCount = 0;
      await prisma.user.update({
        where: { id: req.userId },
        data: { dailyCoachMessages: 0, lastCoachResetDate: today },
      });
    }

    if (user.subscriptionStatus === 'FREE' && dailyCount >= env.freeCoachMessagesPerDay) {
      res.status(429).json({
        error: 'Daily message limit reached',
        limit: env.freeCoachMessagesPerDay,
        resetAt: 'midnight',
        upgrade: true,
      });
      return;
    }

    // Get conversation history (last 20 messages for context)
    const history = await prisma.chatMessage.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { role: true, content: true },
    });
    history.reverse();

    // Get AI response
    const aiResponse = await getCoachResponse(
      history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      message
    );

    // Save both messages
    await prisma.$transaction([
      prisma.chatMessage.create({
        data: { userId: req.userId!, role: 'user', content: message },
      }),
      prisma.chatMessage.create({
        data: { userId: req.userId!, role: 'assistant', content: aiResponse },
      }),
      prisma.user.update({
        where: { id: req.userId },
        data: {
          dailyCoachMessages: dailyCount + 1,
          chatMessageCount: { increment: 1 },
        },
      }),
    ]);

    res.json({
      response: aiResponse,
      messagesUsed: dailyCount + 1,
      messagesLimit: user.subscriptionStatus === 'FREE' ? env.freeCoachMessagesPerDay : null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Coach error:', err);
    res.status(500).json({ error: 'Failed to get coach response' });
  }
});

// GET /api/coach/history
router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: { id: true, role: true, content: true, createdAt: true },
    });

    res.json({ messages });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
