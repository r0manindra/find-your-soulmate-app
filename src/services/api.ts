import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://find-your-soulmate-app-production.up.railway.app/api';

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
export async function sendCoachMessage(message: string, characterId: string = 'charismo') {
  return request<{
    response: string;
    messagesUsed: number;
    messagesLimit: number | null;
  }>('/coach/message', {
    method: 'POST',
    body: JSON.stringify({ message, characterId }),
  });
}

export async function getCoachHistory() {
  return request<{
    messages: { id: string; role: string; content: string; createdAt: string }[];
  }>('/coach/history');
}

// Subscription
export async function getSubscriptionStatus() {
  return request<{
    status: string;
    isPremium: boolean;
    freeChapters: number;
    freeCoachMessagesPerDay: number;
  }>('/subscription/status');
}
