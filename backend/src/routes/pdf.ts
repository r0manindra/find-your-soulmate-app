import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateGuideBuffer } from '../services/pdf';
import { chapterLessons } from '../content/chapter-lessons';
import { chaptersMeta, phasesMeta } from '../content/chapters-meta';

const router = Router();
router.use(authMiddleware);

// Build the full chapter data by merging metadata with lesson content
const fullChapters = chaptersMeta.map((meta) => {
  const lesson = chapterLessons.find((l) => l.chapterId === meta.id);
  return {
    chapterId: meta.id,
    title: meta.title,
    subtitle: meta.subtitle,
    lessons: lesson?.lessons || [],
    exercises: lesson?.exercises || [],
    keyTakeaway: lesson?.keyTakeaway || '',
  };
});

// GET /api/pdf/guide — download the premium guide PDF
router.get('/guide', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { subscriptionStatus: true, hasPdfAccess: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const hasAccess = user.subscriptionStatus === 'PRO_PLUS' || user.subscriptionStatus === 'PREMIUM' || user.hasPdfAccess === true;
    if (!hasAccess) {
      res.status(403).json({
        error: 'PDF access required (PRO+ subscription or one-time purchase)',
        upgrade: true,
      });
      return;
    }

    const pdfBuffer = await generateGuideBuffer(fullChapters);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="find-your-soulmate-guide.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
