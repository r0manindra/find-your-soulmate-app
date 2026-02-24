import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';
import { verifyGoogleToken, verifyAppleToken } from '../services/oauth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const googleSchema = z.object({
  idToken: z.string().min(1),
});

const appleSchema = z.object({
  identityToken: z.string().min(1),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
});

function userResponse(user: { id: string; email: string; name: string | null; subscriptionStatus: string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    subscriptionStatus: user.subscriptionStatus,
  };
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const token = generateToken(user.id);

    res.status(201).json({ token, user: userResponse(user) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // OAuth-only users don't have a passwordHash
    if (!user.passwordHash) {
      res.status(401).json({
        error: 'This account uses social login. Please sign in with Google or Apple.',
      });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);

    res.json({ token, user: userResponse(user) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { idToken } = googleSchema.parse(req.body);

    const google = await verifyGoogleToken(idToken, env.googleClientId);

    if (!google.emailVerified) {
      res.status(401).json({ error: 'Google email not verified' });
      return;
    }

    // Find existing user by email
    let user = await prisma.user.findUnique({ where: { email: google.email } });

    if (user) {
      // Link Google identity if not already linked
      if (!user.authProviderId || user.authProvider !== 'GOOGLE') {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { authProvider: 'GOOGLE', authProviderId: google.sub },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: google.email,
          name: google.name || null,
          authProvider: 'GOOGLE',
          authProviderId: google.sub,
        },
      });
    }

    const token = generateToken(user.id);
    res.json({ token, user: userResponse(user) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// POST /api/auth/apple
router.post('/apple', async (req: Request, res: Response) => {
  try {
    const { identityToken, fullName, email: requestEmail } = appleSchema.parse(req.body);

    const apple = await verifyAppleToken(identityToken, env.appleBundleId);

    // First look up by Apple sub (stable across sign-ins)
    let user = await prisma.user.findFirst({
      where: { authProvider: 'APPLE', authProviderId: apple.sub },
    });

    if (!user) {
      // Try by email (from token or request body — Apple only sends email on first sign-in)
      const email = apple.email || requestEmail;
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          // Link Apple identity
          user = await prisma.user.update({
            where: { id: user.id },
            data: { authProvider: 'APPLE', authProviderId: apple.sub },
          });
        }
      }
    }

    if (!user) {
      // Create new user
      const email = apple.email || requestEmail;
      if (!email) {
        res.status(400).json({ error: 'Email is required for new accounts' });
        return;
      }

      user = await prisma.user.create({
        data: {
          email,
          name: fullName || null,
          authProvider: 'APPLE',
          authProviderId: apple.sub,
        },
      });
    }

    const token = generateToken(user.id);
    res.json({ token, user: userResponse(user) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    console.error('Apple auth error:', err);
    res.status(401).json({ error: 'Apple authentication failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
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

    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
