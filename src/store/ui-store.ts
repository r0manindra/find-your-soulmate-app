import { create } from 'zustand';
import type { ExerciseModeId } from '@/src/data/content/exercise-modes';

interface UIStore {
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;
  activeExerciseMode: ExerciseModeId | null;
  setExerciseMode: (mode: ExerciseModeId | null) => void;
  resetExercise: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  chatInputFocused: false,
  setChatInputFocused: (focused) => set({ chatInputFocused: focused }),
  activeExerciseMode: null,
  setExerciseMode: (mode) => set({ activeExerciseMode: mode }),
  resetExercise: () => set({ activeExerciseMode: null }),
}));
