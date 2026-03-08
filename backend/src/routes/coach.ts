import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { getCoachResponse } from '../services/coach';
import { getCharacterPrompt } from '../services/characters';
import { buildContextAwarePrompt, type UserJourneyContext } from '../services/coach-context';
import { isPremiumExerciseMode, type ExerciseModeId } from '../services/exercise-modes';
import { env } from '../config/env';

const router = Router();
router.use(authMiddleware);

import { VALID_CHARACTER_IDS } from '../services/characters';

const contextSchema = z.object({
  profile: z.object({
    gender: z.enum(['male', 'female', 'diverse']).nullable(),
    ageGroup: z.string().nullable(),
    skillLevel: z.string().nullable(),
    socialEnergy: z.string().nullable(),
    basicsLevel: z.string().nullable(),
    goal: z.string().nullable(),
  }),
  progress: z.object({
    completedChapters: z.array(z.number()),
    currentChapterId: z.number().nullable(),
    streak: z.number(),
    graduated: z.boolean(),
  }),
  habits: z.object({
    active: z.array(z.object({ name: z.string(), currentStreak: z.number() })),
    todayCompleted: z.number(),
    todayTotal: z.number(),
    weeklyCompletionRate: z.number(),
  }),
  locale: z.enum(['en', 'de']),
}).optional();

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
  characterId: z.string().optional().default('charismo'),
  context: contextSchema,
  exerciseMode: z.enum([
    'opening_line_lab',
    'conversation_ping_pong',
    'rejection_gym',
    'date_simulator',
    'flirty_banter',
    'reply_helper',
    'flirting_battle',
  ]).optional(),
  conversationId: z.string().optional(),
});

// POST /api/coach/message
router.post('/message', async (req: AuthRequest, res: Response) => {
  try {
    const { message, characterId, context, exerciseMode, conversationId } = messageSchema.parse(req.body);

    // Premium characters require Pro or Pro+ subscription
    const FREE_CHARACTERS = ['charismo', 'bestfriend', 'battle_girl_nextdoor', 'battle_boy_nextdoor'];
    const isSubscribed = (status: string) => status === 'PRO' || status === 'PRO_PLUS' || status === 'PREMIUM';

    if (!FREE_CHARACTERS.includes(characterId)) {
      const userForSub = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { subscriptionStatus: true },
      });
      if (!userForSub || !isSubscribed(userForSub.subscriptionStatus)) {
        res.status(403).json({ error: 'Pro subscription required for this character', upgrade: true });
        return;
      }
    }

    // Premium exercise modes require Pro or Pro+ subscription
    if (exerciseMode && isPremiumExerciseMode(exerciseMode as ExerciseModeId)) {
      const userForSub = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { subscriptionStatus: true },
      });
      if (!userForSub || !isSubscribed(userForSub.subscriptionStatus)) {
        res.status(403).json({ error: 'Pro subscription required for this exercise mode', upgrade: true });
        return;
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        subscriptionStatus: true,
        dailyCoachMessages: true,
        lastCoachResetDate: true,
        dailyHeartsUsed: true,
        lastHeartsResetDate: true,
        bonusHearts: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Hearts-based rate limiting — check availability first, deduct AFTER successful AI response
    const today = new Date().toISOString().split('T')[0];
    const heartCost = env.heartCostMessage;

    const maxDaily = user.subscriptionStatus === 'PRO_PLUS' || user.subscriptionStatus === 'PREMIUM'
      ? env.proPlusHeartsPerDay
      : user.subscriptionStatus === 'PRO'
        ? env.proHeartsPerDay
        : env.freeHeartsPerDay;
    let dailyUsed = user.dailyHeartsUsed;

    if (user.lastHeartsResetDate !== today) {
      dailyUsed = 0;
    }

    const dailyRemaining = Math.max(0, maxDaily - dailyUsed);
    const totalAvailable = dailyRemaining + user.bonusHearts;

    if (totalAvailable < heartCost) {
      res.status(429).json({
        error: 'Not enough hearts',
        heartsRemaining: totalAvailable,
        resetAt: 'midnight',
        upgrade: true,
      });
      return;
    }

    // Legacy: keep dailyCoachMessages counter in sync
    let dailyCount = user.dailyCoachMessages;
    if (user.lastCoachResetDate !== today) {
      dailyCount = 0;
    }

    // Get conversation history (last 20 messages for context), scoped by conversationId
    const history = await prisma.chatMessage.findMany({
      where: {
        userId: req.userId,
        ...(conversationId ? { conversationId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { role: true, content: true },
    });
    history.reverse();

    // Build system prompt — enriched with context if available, otherwise plain character prompt
    const systemPrompt = context
      ? buildContextAwarePrompt(characterId, context as UserJourneyContext, exerciseMode as ExerciseModeId | undefined)
      : getCharacterPrompt(characterId);

    // Get AI response — hearts are NOT deducted yet, only after success
    const aiResponse = await getCoachResponse(
      history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      message,
      systemPrompt
    );

    // Deduct hearts + save messages in one transaction (only on success)
    const dailyDeduct = Math.min(dailyRemaining, heartCost);
    const bonusDeduct = heartCost - dailyDeduct;

    await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          userId: req.userId!, role: 'user', content: message,
          conversationId: conversationId ?? null,
          characterId,
        },
      }),
      prisma.chatMessage.create({
        data: {
          userId: req.userId!, role: 'assistant', content: aiResponse,
          conversationId: conversationId ?? null,
          characterId,
        },
      }),
      prisma.user.update({
        where: { id: req.userId },
        data: {
          dailyHeartsUsed: dailyUsed + dailyDeduct,
          lastHeartsResetDate: today,
          bonusHearts: Math.max(0, user.bonusHearts - bonusDeduct),
          dailyCoachMessages: dailyCount + 1,
          chatMessageCount: { increment: 1 },
        },
      }),
    ]);

    // Calculate remaining hearts for response (reuse maxDaily from above)
    const heartsUsed = user.lastHeartsResetDate === today ? user.dailyHeartsUsed + heartCost : heartCost;
    const heartsRemaining = Math.max(0, maxDaily - heartsUsed) + Math.max(0, user.bonusHearts - bonusDeduct);

    res.json({
      response: aiResponse,
      messagesUsed: dailyCount + 1,
      messagesLimit: isSubscribed(user.subscriptionStatus) ? null : env.freeCoachMessagesPerDay,
      heartsRemaining,
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
