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
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
