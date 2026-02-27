import { Router, Response } from 'express';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { chapterLessons } from '../content/chapter-lessons';
import { chaptersMeta } from '../content/chapters-meta';
import { env } from '../config/env';

const router = Router();
router.use(authMiddleware);

const anthropic = new Anthropic({
  apiKey: env.anthropicApiKey,
});

const quizRequestSchema = z.object({
  chapterId: z.number().int().min(1).max(25),
  locale: z.enum(['en', 'de']),
  gender: z.enum(['male', 'female']).nullable().optional(),
});

router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const { chapterId, locale, gender } = quizRequestSchema.parse(req.body);

    const chapter = chapterLessons.find((c) => c.chapterId === chapterId);
    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    const meta = chaptersMeta.find((c) => c.id === chapterId);
    const title = meta?.title ?? `Chapter ${chapterId}`;

    const isFemale = gender === 'female';
    const lessons = isFemale && chapter.femaleVariant ? chapter.femaleVariant.lessons : chapter.lessons;
    const exercises = isFemale && chapter.femaleVariant ? chapter.femaleVariant.exercises : chapter.exercises;
    const takeaway = isFemale && chapter.femaleVariant ? chapter.femaleVariant.keyTakeaway : chapter.keyTakeaway;

    const chapterContent = [
      `Chapter: "${title}"`,
      '',
      'Lessons:',
      ...lessons.map((l, i) => `${i + 1}. ${l.title}\n${l.content}`),
      '',
      'Exercises:',
      ...exercises.map((ex, i) => `${i + 1}. ${ex.title} — ${ex.description}`),
      '',
      `Key Takeaway: ${takeaway}`,
    ].join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: `You generate quiz questions for a dating/social skills education app. Based on the chapter content below, create 5 multiple-choice questions that test comprehension of key concepts. Questions should be practical and test understanding, not memorization. Wrong options must be plausible.\n\n${chapterContent}`,
      messages: [{ role: 'user', content: `Generate a 5-question quiz in ${locale === 'de' ? 'German' : 'English'}.` }],
      tools: [{
        name: 'generate_quiz',
        description: 'Generate structured quiz questions',
        input_schema: {
          type: 'object' as const,
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
                  correctIndex: { type: 'integer', minimum: 0, maximum: 3 },
                  explanation: { type: 'string' },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
              minItems: 5,
              maxItems: 5,
            },
          },
          required: ['questions'],
        },
      }],
      tool_choice: { type: 'tool', name: 'generate_quiz' },
    });

    const toolBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      res.status(500).json({ error: 'Failed to generate quiz' });
      return;
    }

    const { questions } = toolBlock.input as { questions: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }> };

    res.json({ questions });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Quiz generation error:', err);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

export default router;
