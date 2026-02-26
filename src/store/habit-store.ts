import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit, HabitCompletion, HabitTimeSlot } from '@/src/core/entities/habit-types';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

interface HabitStore {
  habits: Habit[];
  completions: HabitCompletion[];

  addHabitFromPreset: (presetId: string, emoji: string, title: { en: string; de: string }, chapterId: number) => void;
  addCustomHabit: (emoji: string, titleText: string) => void;
  archiveHabit: (id: string) => void;
  restoreHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date?: string) => void;
  isCompletedToday: (habitId: string) => boolean;
  getStreak: (habitId: string) => { current: number; longest: number };
  getActiveHabits: () => Habit[];
  getWeeklyCompletionRate: () => number;
  isPresetAlreadyAdded: (presetId: string) => boolean;
  getTodayCompletedCount: () => number;
  getTodayTotalCount: () => number;
  setHabitSchedule: (habitId: string, time: HabitTimeSlot, days: number[], specificTime?: string) => void;
  getHabitsForDate: (date: Date) => Habit[];
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],

      addHabitFromPreset: (presetId, emoji, title, chapterId) => {
        const { habits } = get();
        if (habits.some((h) => h.presetId === presetId && !h.isArchived)) return;

        const habit: Habit = {
          id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title,
          emoji,
          chapterId,
          presetId,
          isCustom: false,
          createdAt: new Date().toISOString(),
          isArchived: false,
        };
        set((state) => ({ habits: [...state.habits, habit] }));
      },

      addCustomHabit: (emoji, titleText) => {
        const habit: Habit = {
          id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: { en: titleText, de: titleText },
          emoji,
          chapterId: null,
          presetId: null,
          isCustom: true,
          createdAt: new Date().toISOString(),
          isArchived: false,
        };
        set((state) => ({ habits: [...state.habits, habit] }));
      },

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, isArchived: true } : h)),
        })),

      restoreHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, isArchived: false } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter((c) => c.habitId !== id),
        })),

      toggleCompletion: (habitId, date) => {
        const d = date ?? getToday();
        set((state) => {
          const exists = state.completions.some(
            (c) => c.habitId === habitId && c.date === d
          );
          return {
            completions: exists
              ? state.completions.filter((c) => !(c.habitId === habitId && c.date === d))
              : [...state.completions, { habitId, date: d }],
          };
        });
      },

      isCompletedToday: (habitId) => {
        const today = getToday();
        return get().completions.some((c) => c.habitId === habitId && c.date === today);
      },

      getStreak: (habitId) => {
        const { completions } = get();
        const habitDates = completions
          .filter((c) => c.habitId === habitId)
          .map((c) => c.date);

        if (habitDates.length === 0) return { current: 0, longest: 0 };

        // Use Set for O(1) lookups instead of Array.includes O(n)
        const dateSet = new Set(habitDates);
        const sorted = [...dateSet].sort();

        // Current streak: count consecutive days backward from today or yesterday
        let current = 0;
        const today = getToday();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const startDate = dateSet.has(today) ? today : dateSet.has(yesterday) ? yesterday : null;

        if (startDate) {
          let d = new Date(startDate);
          while (dateSet.has(d.toISOString().split('T')[0])) {
            current++;
            d = new Date(d.getTime() - 86400000);
          }
        }

        // Longest streak: single pass O(n)
        let longest = 1;
        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
          const diff = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000;
          if (diff === 1) {
            streak++;
          } else {
            longest = Math.max(longest, streak);
            streak = 1;
          }
        }
        longest = Math.max(longest, streak);

        return { current, longest };
      },

      getActiveHabits: () => get().habits.filter((h) => !h.isArchived),

      getWeeklyCompletionRate: () => {
        const { habits, completions } = get();
        const active = habits.filter((h) => !h.isArchived);
        if (active.length === 0) return 0;

        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today.getTime() - mondayOffset * 86400000);
        monday.setHours(0, 0, 0, 0);

        const daysElapsed = mondayOffset + 1;
        const totalPossible = active.length * daysElapsed;
        if (totalPossible === 0) return 0;

        // Use Set for O(1) lookups instead of nested .some() O(h) per completion
        const activeIds = new Set(active.map((h) => h.id));
        const mondayStr = monday.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        const weekCompletions = completions.filter(
          (c) => activeIds.has(c.habitId) && c.date >= mondayStr && c.date <= todayStr
        );

        return weekCompletions.length / totalPossible;
      },

      isPresetAlreadyAdded: (presetId) =>
        get().habits.some((h) => h.presetId === presetId && !h.isArchived),

      getTodayCompletedCount: () => {
        const today = getToday();
        const dayOfWeek = new Date().getDay();
        const { habits, completions } = get();
        const todayCompleted = new Set(
          completions.filter((c) => c.date === today).map((c) => c.habitId)
        );
        return habits.filter((h) => {
          if (h.isArchived) return false;
          if (h.scheduledDays && h.scheduledDays.length > 0 && !h.scheduledDays.includes(dayOfWeek)) return false;
          return todayCompleted.has(h.id);
        }).length;
      },

      getTodayTotalCount: () => {
        const dayOfWeek = new Date().getDay();
        return get().habits.filter((h) => {
          if (h.isArchived) return false;
          if (h.scheduledDays && h.scheduledDays.length > 0) {
            return h.scheduledDays.includes(dayOfWeek);
          }
          return true;
        }).length;
      },

      setHabitSchedule: (habitId, time, days, specificTime) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, scheduledTime: time, scheduledDays: days, specificTime: specificTime || undefined } : h
          ),
        })),

      getHabitsForDate: (date) => {
        const dayOfWeek = date.getDay();
        return get().habits.filter((h) => {
          if (h.isArchived) return false;
          if (h.scheduledDays && h.scheduledDays.length > 0) {
            return h.scheduledDays.includes(dayOfWeek);
          }
          return true;
        });
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
      }),
    }
  )
);
