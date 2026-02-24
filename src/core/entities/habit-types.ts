export interface PresetHabit {
  id: string;
  emoji: string;
  title: { en: string; de: string };
  chapterId: number;
}

export interface Habit {
  id: string;
  title: { en: string; de: string };
  emoji: string;
  chapterId: number | null;
  presetId: string | null;
  isCustom: boolean;
  createdAt: string;
  isArchived: boolean;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
}
