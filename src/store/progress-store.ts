import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProgressState } from '@/src/core/entities/types';

interface ProgressStore extends ProgressState {
  achievementQueue: string[];
  completeChapter: (id: number) => void;
  uncompleteChapter: (id: number) => void;
  completeBook: (id: number) => void;
  uncompleteBook: (id: number) => void;
  incrementChatCount: () => void;
  updateStreak: () => void;
  graduate: () => void;
  reset: () => void;
  enqueueAchievement: (id: string) => void;
  dequeueAchievement: () => void;
  clearAchievementQueue: () => void;
}

const initialState: ProgressState = {
  completedChapters: [],
  completedBooks: [],
  chatMessageCount: 0,
  streak: 0,
  lastActiveDate: '',
  graduated: false,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      achievementQueue: [],

      completeChapter: (id) =>
        set((state) => ({
          completedChapters: state.completedChapters.includes(id)
            ? state.completedChapters
            : [...state.completedChapters, id],
        })),

      uncompleteChapter: (id) =>
        set((state) => ({
          completedChapters: state.completedChapters.filter((c) => c !== id),
        })),

      completeBook: (id) =>
        set((state) => ({
          completedBooks: state.completedBooks.includes(id)
            ? state.completedBooks
            : [...state.completedBooks, id],
        })),

      uncompleteBook: (id) =>
        set((state) => ({
          completedBooks: state.completedBooks.filter((b) => b !== id),
        })),

      incrementChatCount: () =>
        set((state) => ({
          chatMessageCount: state.chatMessageCount + 1,
        })),

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, streak } = get();

        if (lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isConsecutive = lastActiveDate === yesterday;

        set({
          streak: isConsecutive ? streak + 1 : 1,
          lastActiveDate: today,
        });
      },

      graduate: () => set({ graduated: true }),

      reset: () => set({ ...initialState, achievementQueue: [] }),

      enqueueAchievement: (id) =>
        set((state) => ({
          achievementQueue: state.achievementQueue.includes(id)
            ? state.achievementQueue
            : [...state.achievementQueue, id],
        })),

      dequeueAchievement: () =>
        set((state) => ({
          achievementQueue: state.achievementQueue.slice(1),
        })),

      clearAchievementQueue: () => set({ achievementQueue: [] }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedChapters: state.completedChapters,
        completedBooks: state.completedBooks,
        chatMessageCount: state.chatMessageCount,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        graduated: state.graduated,
      }),
    }
  )
);
