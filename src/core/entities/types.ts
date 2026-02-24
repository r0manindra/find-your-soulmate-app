export interface Chapter {
  id: number;
  slug: string;
  icon: string;
  ionicon: string;
  phase: number;
  title: { en: string; de: string };
  subtitle: { en: string; de: string };
  summary: { en: string; de: string };
}

export interface Phase {
  id: number;
  title: { en: string; de: string };
  chapters: number[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: { en: string; de: string };
  emoji: string;
  amazonUrl: string;
  ionicon: string;
}

export interface Achievement {
  id: string;
  title: { en: string; de: string };
  description: { en: string; de: string };
  icon: string;
  condition: (state: ProgressState) => boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ProgressState {
  completedChapters: number[];
  completedBooks: number[];
  chatMessageCount: number;
  streak: number;
  lastActiveDate: string;
  graduated: boolean;
}
