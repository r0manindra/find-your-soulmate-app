import { create } from 'zustand';

interface UIStore {
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  chatInputFocused: false,
  setChatInputFocused: (focused) => set({ chatInputFocused: focused }),
}));
