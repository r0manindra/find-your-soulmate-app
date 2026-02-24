import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// --- Google Token Verification ---

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  iss: string;
  aud: string;
  exp: number;
}

export async function verifyGoogleToken(
  idToken: string,
  clientId: string
): Promise<{ sub: string; email: string; emailVerified: boolean; name?: string }> {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  if (!res.ok) {
    throw new Error('Invalid Google token');
  }

  const payload = (await res.json()) as GoogleTokenPayload;

  if (payload.aud !== clientId) {
    throw new Error('Google token audience mismatch');
  }

  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (!validIssuers.includes(payload.iss)) {
    throw new Error('Google token issuer mismatch');
  }

  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Google token expired');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: !!payload.email_verified,
    name: payload.name,
  };
}

// --- Apple Token Verification ---

interface AppleJWK {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

let appleKeysCache: { keys: AppleJWK[]; fetchedAt: number } | null = null;
const APPLE_KEYS_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getApplePublicKeys(): Promise<AppleJWK[]> {
  if (appleKeysCache && Date.now() - appleKeysCache.fetchedAt < APPLE_KEYS_TTL) {
    return appleKeysCache.keys;
  }

  const res = await fetch('https://appleid.apple.com/auth/keys');
  if (!res.ok) {
    throw new Error('Failed to fetch Apple public keys');
  }

  const { keys } = (await res.json()) as { keys: AppleJWK[] };
  appleKeysCache = { keys, fetchedAt: Date.now() };
  return keys;
}

export async function verifyAppleToken(
  identityToken: string,
  bundleId: string
): Promise<{ sub: string; email?: string }> {
  // Decode header to find kid
  const headerB64 = identityToken.split('.')[0];
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());

  const keys = await getApplePublicKeys();
  const matchingKey = keys.find((k) => k.kid === header.kid);
  if (!matchingKey) {
    throw new Error('Apple token key not found');
  }

  // Convert JWK to PEM
  const publicKey = crypto.createPublicKey({
    key: {
      kty: matchingKey.kty,
      n: matchingKey.n,
      e: matchingKey.e,
    },
    format: 'jwk',
  });

  // Verify JWT
  const payload = jwt.verify(identityToken, publicKey, {
    algorithms: [matchingKey.alg as jwt.Algorithm],
    issuer: 'https://appleid.apple.com',
    audience: bundleId,
  }) as { sub: string; email?: string };

  return {
    sub: payload.sub,
    email: payload.email,
  };
}
