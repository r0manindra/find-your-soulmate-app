import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import type { ProgressState } from '@/src/core/entities/types';

const storage = createMMKV({ id: 'progress' });

const mmkvStorage = {
  getItem: (name: string) => {
    return storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

interface ProgressStore extends ProgressState {
  completeChapter: (id: number) => void;
  uncompleteChapter: (id: number) => void;
  completeBook: (id: number) => void;
  uncompleteBook: (id: number) => void;
  incrementChatCount: () => void;
  updateStreak: () => void;
  graduate: () => void;
  reset: () => void;
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

      reset: () => set(initialState),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
