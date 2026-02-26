export interface PresetHabit {
  id: string;
  emoji: string;
  title: { en: string; de: string };
  chapterId: number;
}

export type HabitTimeSlot = 'morning' | 'afternoon' | 'evening' | null;

export interface Habit {
  id: string;
  title: { en: string; de: string };
  emoji: string;
  chapterId: number | null;
  presetId: string | null;
  isCustom: boolean;
  createdAt: string;
  isArchived: boolean;
  scheduledTime?: HabitTimeSlot;
  scheduledDays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat. Default: all days
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
}
