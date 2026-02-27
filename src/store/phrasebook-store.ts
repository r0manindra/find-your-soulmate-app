import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PhrasebookStore {
  savedPhraseIds: string[];
  savephrase: (id: string) => void;
  unsavePhrase: (id: string) => void;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

export const usePhrasebookStore = create<PhrasebookStore>()(
  persist(
    (set, get) => ({
      savedPhraseIds: [],
      savephrase: (id) =>
        set((state) => ({
          savedPhraseIds: state.savedPhraseIds.includes(id)
            ? state.savedPhraseIds
            : [...state.savedPhraseIds, id],
        })),
      unsavePhrase: (id) =>
        set((state) => ({
          savedPhraseIds: state.savedPhraseIds.filter((pid) => pid !== id),
        })),
      isSaved: (id) => get().savedPhraseIds.includes(id),
      toggleSaved: (id) => {
        const { savedPhraseIds } = get();
        if (savedPhraseIds.includes(id)) {
          set({ savedPhraseIds: savedPhraseIds.filter((pid) => pid !== id) });
        } else {
          set({ savedPhraseIds: [...savedPhraseIds, id] });
        }
      },
    }),
    {
      name: 'phrasebook-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
