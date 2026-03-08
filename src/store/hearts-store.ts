import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './auth-store';

function getLocalDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface HeartsStore {
  dailyHearts: number;
  bonusHearts: number;
  lastResetDate: string;
  welcomeGiftClaimed: boolean;

  getMaxDailyHearts: () => number;
  canSpend: (amount: number) => boolean;
  spendHearts: (amount: number) => boolean;
  resetIfNewDay: () => void;
  addBonusHearts: (amount: number) => void;
  getTotalAvailable: () => number;
  claimWelcomeGift: () => void;
  reset: () => void;
}

export const useHeartsStore = create<HeartsStore>()(
  persist(
    (set, get) => ({
      dailyHearts: 5,
      bonusHearts: 0,
      lastResetDate: getLocalDateString(),
      welcomeGiftClaimed: false,

      getMaxDailyHearts: () => {
        const tier = useAuthStore.getState().subscriptionTier;
        if (tier === 'pro_plus') return 100;
        if (tier === 'pro') return 50;
        return 5;
      },

      canSpend: (amount) => {
        // Auto-reset if new day
        get().resetIfNewDay();

        const { dailyHearts, bonusHearts } = get();
        return dailyHearts + bonusHearts >= amount;
      },

      spendHearts: (amount) => {
        // Auto-reset if new day
        get().resetIfNewDay();

        const { dailyHearts, bonusHearts } = get();
        const total = dailyHearts + bonusHearts;
        if (total < amount) return false;

        let remaining = amount;

        // Deduct daily hearts first
        const dailyDeduct = Math.min(dailyHearts, remaining);
        remaining -= dailyDeduct;

        // Then deduct from bonus
        const bonusDeduct = remaining;

        set({
          dailyHearts: dailyHearts - dailyDeduct,
          bonusHearts: bonusHearts - bonusDeduct,
        });

        return true;
      },

      resetIfNewDay: () => {
        const today = getLocalDateString();
        const { lastResetDate } = get();
        if (lastResetDate !== today) {
          const maxDaily = get().getMaxDailyHearts();
          set({
            dailyHearts: maxDaily,
            lastResetDate: today,
          });
        }
      },

      addBonusHearts: (amount) => {
        set((state) => ({ bonusHearts: state.bonusHearts + amount }));
      },

      claimWelcomeGift: () => {
        const { welcomeGiftClaimed } = get();
        if (!welcomeGiftClaimed) {
          set((state) => ({
            bonusHearts: state.bonusHearts + 10,
            welcomeGiftClaimed: true,
          }));
        }
      },

      reset: () => set({
        dailyHearts: 5,
        bonusHearts: 0,
        lastResetDate: getLocalDateString(),
        welcomeGiftClaimed: false,
      }),

      getTotalAvailable: () => {
        get().resetIfNewDay();
        const { dailyHearts, bonusHearts } = get();
        return dailyHearts + bonusHearts;
      },
    }),
    {
      name: 'hearts-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dailyHearts: state.dailyHearts,
        bonusHearts: state.bonusHearts,
        lastResetDate: state.lastResetDate,
        welcomeGiftClaimed: state.welcomeGiftClaimed,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          // After rehydration, immediately reset daily hearts if it's a new day
          // This prevents showing stale 0 from yesterday before useEffect runs
          if (state) {
            state.resetIfNewDay();
          }
        };
      },
    }
  )
);
