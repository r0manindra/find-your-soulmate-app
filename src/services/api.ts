import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://find-your-soulmate-app-production.up.railway.app/api';

const TOKEN_KEY = 'auth_token';

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status, data);
  }

  return data as T;
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Auth
export async function register(email: string, password: string, name?: string) {
  const data = await request<{
    token: string;
    user: { id: string; email: string; name: string | null; subscriptionStatus: string };
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  await setToken(data.token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await request<{
    token: string;
    user: { id: string; email: string; name: string | null; subscriptionStatus: string };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setToken(data.token);
  return data;
}

export async function loginWithGoogle(idToken: string) {
  const data = await request<{
    token: string;
    user: { id: string; email: string; name: string | null; subscriptionStatus: string };
  }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
  await setToken(data.token);
  return data;
}

export async function loginWithApple(
  identityToken: string,
  fullName?: string,
  email?: string
) {
  const data = await request<{
    token: string;
    user: { id: string; email: string; name: string | null; subscriptionStatus: string };
  }>('/auth/apple', {
    method: 'POST',
    body: JSON.stringify({ identityToken, fullName, email }),
  });
  await setToken(data.token);
  return data;
}

export async function getMe() {
  return request<{
    user: {
      id: string;
      email: string;
      name: string | null;
      subscriptionStatus: string;
      completedChapters: number[];
      completedBooks: number[];
      chatMessageCount: number;
      streak: number;
      graduated: boolean;
    };
  }>('/auth/me');
}

// Progress
export async function syncProgress(progress: {
  completedChapters: number[];
  completedBooks: number[];
  chatMessageCount: number;
  streak: number;
  lastActiveDate: string;
  graduated: boolean;
}) {
  return request<{ progress: typeof progress }>('/progress/sync', {
    method: 'POST',
    body: JSON.stringify(progress),
  });
}

// Coach
export interface JourneyContext {
  profile: {
    gender: 'male' | 'female' | null;
    ageGroup: string | null;
    skillLevel: string | null;
    socialEnergy: string | null;
    basicsLevel: string | null;
    goal: string | null;
  };
  progress: {
    completedChapters: number[];
    currentChapterId: number | null;
    streak: number;
    graduated: boolean;
  };
  habits: {
    active: { name: string; currentStreak: number }[];
    todayCompleted: number;
    todayTotal: number;
    weeklyCompletionRate: number;
  };
  locale: 'en' | 'de';
}

export async function sendCoachMessage(
  message: string,
  characterId: string = 'charismo',
  context?: JourneyContext,
  exerciseMode?: string
) {
  return request<{
    response: string;
    messagesUsed: number;
    messagesLimit: number | null;
  }>('/coach/message', {
    method: 'POST',
    body: JSON.stringify({
      message,
      characterId,
      ...(context ? { context } : {}),
      ...(exerciseMode ? { exerciseMode } : {}),
    }),
  });
}

export async function getCoachHistory() {
  return request<{
    messages: { id: string; role: string; content: string; createdAt: string }[];
  }>('/coach/history');
}

// Voice Analysis
export interface VoiceAnalysis {
  wordCount: number;
  wordsPerMinute: number;
  paceRating: 'too_slow' | 'good' | 'too_fast';
  fillerWords: { word: string; count: number }[];
  totalFillerCount: number;
  overallScore: number;
  tips: string[];
}

export async function analyzeVoice(audioUri: string, locale: string): Promise<{
  transcript: string;
  duration: number;
  analysis: VoiceAnalysis;
}> {
  const token = await getToken();
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);
  formData.append('locale', locale);

  const res = await fetch(`${API_BASE}/voice/analyze`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(data.error || 'Voice analysis failed', res.status, data);
  }
  return data;
}

// Voice Coach (Realtime)
export async function createVoiceSession(params: {
  characterId: string;
  locale: string;
  chapterContext?: string;
}) {
  return request<{
    clientSecret: string;
    expiresAt: number;
    sessionId: string;
    voiceSessionsUsed: number;
    voiceSessionsLimit: number;
  }>('/voice/session', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// Subscription
export async function getSubscriptionStatus() {
  return request<{
    status: string;
    tier: 'free' | 'pro' | 'pro_plus';
    isPremium: boolean;
    isPro: boolean;
    isProPlus: boolean;
    freeChapters: number;
    freeCoachMessagesPerDay: number;
    voiceSessionsPerDay: number;
  }>('/subscription/status');
}

export async function devUnlock(key: string, tier?: 'pro' | 'pro_plus') {
  return request<{ success: boolean; subscriptionStatus: string }>('/auth/dev-unlock', {
    method: 'POST',
    body: JSON.stringify({ key, ...(tier ? { tier } : {}) }),
  });
}
