import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

const syncSchema = z.object({
  completedChapters: z.array(z.number()),
  completedBooks: z.array(z.number()),
  chatMessageCount: z.number(),
  streak: z.number(),
  lastActiveDate: z.string(),
  graduated: z.boolean(),
});

// POST /api/progress/sync — sync progress from mobile
router.post('/sync', async (req: AuthRequest, res: Response) => {
  try {
    const data = syncSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: {
        completedChapters: true,
        completedBooks: true,
        chatMessageCount: true,
        streak: true,
        lastActiveDate: true,
        graduated: true,
      },
    });

    res.json({ progress: user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress — get current progress
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        completedChapters: true,
        completedBooks: true,
        chatMessageCount: true,
        streak: true,
        lastActiveDate: true,
        graduated: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ progress: user });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
