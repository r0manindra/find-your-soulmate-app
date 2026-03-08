import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsStore {
  locale: 'en' | 'de';
  setLocale: (locale: 'en' | 'de') => void;
  selectedCharacterId: string;
  setCharacterId: (id: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  hasSeenExerciseModeHint: boolean;
  setHasSeenExerciseModeHint: (seen: boolean) => void;
  habitNudgesEnabled: boolean;
  setHabitNudgesEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      selectedCharacterId: 'charismo',
      setCharacterId: (id) => set({ selectedCharacterId: id }),
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
      hasSeenExerciseModeHint: false,
      setHasSeenExerciseModeHint: (seen) => set({ hasSeenExerciseModeHint: seen }),
      habitNudgesEnabled: true,
      setHabitNudgesEnabled: (enabled) => set({ habitNudgesEnabled: enabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
