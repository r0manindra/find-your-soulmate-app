import { Router, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { getCharacterPrompt } from '../services/characters';

const router = Router();
router.use(authMiddleware);

// Multer config — store in temp dir
const upload = multer({
  dest: path.join(process.cwd(), 'tmp'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const openai = new OpenAI({ apiKey: env.openaiApiKey });
const anthropic = new Anthropic({ apiKey: env.anthropicApiKey });

interface VoiceAnalysis {
  wordCount: number;
  wordsPerMinute: number;
  paceRating: 'too_slow' | 'good' | 'too_fast';
  fillerWords: { word: string; count: number }[];
  totalFillerCount: number;
  overallScore: number;
  tips: string[];
}

// POST /api/voice/analyze
router.post('/analyze', upload.single('audio'), async (req: AuthRequest, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No audio file provided' });
    return;
  }

  const locale = (req.body.locale as string) || 'en';

  try {
    // Step 1: Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: 'whisper-1',
      response_format: 'verbose_json',
      language: locale === 'de' ? 'de' : 'en',
    });

    const transcript = transcription.text;
    const duration = (transcription as any).duration ?? 30; // seconds

    // Step 2: Analyze with Claude Haiku
    const analysisPrompt = locale === 'de'
      ? `Analysiere dieses gesprochene Transkript. Dauer: ${duration} Sekunden.

Transkript: "${transcript}"

Bewerte: Tempo (Wörter pro Minute), Füllwörter (äh, ähm, also, halt, sozusagen, quasi, irgendwie), Gesamteindruck (1-10), und gib 2-3 konkrete Tipps zur Verbesserung.`
      : `Analyze this spoken transcript. Duration: ${duration} seconds.

Transcript: "${transcript}"

Evaluate: pace (words per minute), filler words (um, uh, like, you know, basically, so, right), overall impression (1-10), and give 2-3 specific improvement tips.`;

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: analysisPrompt }],
      tools: [{
        name: 'voice_analysis',
        description: 'Returns structured voice analysis results',
        input_schema: {
          type: 'object' as const,
          properties: {
            wordCount: { type: 'number', description: 'Total word count in the transcript' },
            wordsPerMinute: { type: 'number', description: 'Speaking pace in words per minute' },
            paceRating: { type: 'string', enum: ['too_slow', 'good', 'too_fast'], description: 'Pace rating' },
            fillerWords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  word: { type: 'string' },
                  count: { type: 'number' },
                },
                required: ['word', 'count'],
              },
              description: 'Filler words found with counts',
            },
            totalFillerCount: { type: 'number', description: 'Total number of filler words' },
            overallScore: { type: 'number', description: 'Overall voice score 1-10' },
            tips: {
              type: 'array',
              items: { type: 'string' },
              description: '2-3 specific improvement tips',
            },
          },
          required: ['wordCount', 'wordsPerMinute', 'paceRating', 'fillerWords', 'totalFillerCount', 'overallScore', 'tips'],
        },
      }],
      tool_choice: { type: 'tool', name: 'voice_analysis' },
    });

    // Extract tool use result
    const toolBlock = msg.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      res.status(500).json({ error: 'Analysis failed' });
      return;
    }

    const analysis = toolBlock.input as VoiceAnalysis;

    res.json({
      transcript,
      duration,
      analysis,
    });
  } catch (err: any) {
    console.error('Voice analysis error:', err);
    res.status(500).json({ error: err.message || 'Voice analysis failed' });
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(file.path); } catch {}
  }
});

// POST /api/voice/session — Mint ephemeral token for OpenAI Realtime API
router.post('/session', async (req: AuthRequest, res: Response) => {
  try {
    // Premium gate
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || user.subscriptionStatus !== 'PREMIUM') {
      res.status(403).json({ error: 'Premium subscription required for voice coaching' });
      return;
    }

    const { characterId = 'charismo', locale = 'en', chapterContext } = req.body;

    // Build system prompt for realtime session
    const characterPrompt = getCharacterPrompt(characterId);
    const voiceRules = locale === 'de'
      ? `\n\nDu führst ein Echtzeit-Sprachgespräch. Regeln:
- Antworte auf Deutsch.
- Halte Antworten kurz (1-3 Sätze), natürlich und gesprächig.
- Begrüße den Nutzer freundlich zu Beginn.
- Mach natürliche Pausen. Unterbrich den Nutzer nicht.
- Sei ermutigend aber direkt, wie ein guter Freund.
- Wenn der Nutzer üben möchte, spiele Szenarien durch.`
      : `\n\nYou are in a real-time voice conversation. Rules:
- Respond in English.
- Keep responses short (1-3 sentences), natural and conversational.
- Greet the user warmly at the start.
- Use natural pauses. Don't interrupt the user.
- Be encouraging but direct, like a good friend.
- If the user wants to practice, role-play scenarios with them.`;

    const contextNote = chapterContext
      ? `\n\nThe user is currently studying: "${chapterContext}". Reference this topic when relevant.`
      : '';

    const systemPrompt = characterPrompt + voiceRules + contextNote;

    // Mint ephemeral token from OpenAI Realtime API
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-realtime-preview',
        voice: 'coral',
        instructions: systemPrompt,
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: { type: 'server_vad' },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('OpenAI Realtime session error:', errData);
      res.status(502).json({ error: 'Failed to create voice session' });
      return;
    }

    const sessionData = await response.json();

    res.json({
      clientSecret: sessionData.client_secret?.value,
      expiresAt: sessionData.client_secret?.expires_at,
      sessionId: sessionData.id,
    });
  } catch (err: any) {
    console.error('Voice session error:', err);
    res.status(500).json({ error: err.message || 'Voice session creation failed' });
  }
});

export default router;
