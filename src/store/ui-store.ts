import { create } from 'zustand';
import type { ExerciseModeId } from '@/src/data/content/exercise-modes';

interface UIStore {
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;
  activeExerciseMode: ExerciseModeId | null;
  setExerciseMode: (mode: ExerciseModeId | null) => void;
  resetExercise: () => void;
  // Battle mode state
  activeBattleCharacterId: string | null;
  battleMessageCount: number;
  setBattleCharacter: (id: string | null) => void;
  incrementBattleMessageCount: () => void;
  resetBattle: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  chatInputFocused: false,
  setChatInputFocused: (focused) => set({ chatInputFocused: focused }),
  activeExerciseMode: null,
  setExerciseMode: (mode) => set({ activeExerciseMode: mode }),
  resetExercise: () => set({ activeExerciseMode: null }),
  // Battle mode state
  activeBattleCharacterId: null,
  battleMessageCount: 0,
  setBattleCharacter: (id) => set({ activeBattleCharacterId: id }),
  incrementBattleMessageCount: () => set((s) => ({ battleMessageCount: s.battleMessageCount + 1 })),
  resetBattle: () => set({ activeBattleCharacterId: null, battleMessageCount: 0, activeExerciseMode: null }),
}));
