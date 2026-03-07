import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SubscriptionTier = 'free' | 'pro' | 'pro_plus';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  subscriptionStatus: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isPremium: boolean; // backward compat: true for Pro or Pro+
  isPro: boolean;
  isProPlus: boolean;
  subscriptionTier: SubscriptionTier;
  hasPdfAccess: boolean;
  hasChapterUnlock: boolean;
  setUser: (user: AuthUser) => void;
  setSubscriptionStatus: (status: string) => void;
  setPdfAccess: (has: boolean) => void;
  setChapterUnlock: (has: boolean) => void;
  logout: () => void;
}

function deriveTier(status: string): SubscriptionTier {
  if (status === 'PRO_PLUS' || status === 'PREMIUM') return 'pro_plus';
  if (status === 'PRO') return 'pro';
  return 'free';
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isPremium: false,
      isPro: false,
      isProPlus: false,
      subscriptionTier: 'free' as SubscriptionTier,
      hasPdfAccess: false,
      hasChapterUnlock: false,

      setUser: (user) => {
        const tier = deriveTier(user.subscriptionStatus);
        set((state) => ({
          user,
          isLoggedIn: true,
          isPremium: tier === 'pro' || tier === 'pro_plus',
          isPro: tier === 'pro' || tier === 'pro_plus',
          isProPlus: tier === 'pro_plus',
          subscriptionTier: tier,
          // Annual PRO+ includes PDF access
          hasPdfAccess: tier === 'pro_plus' || state.hasPdfAccess,
        }));
      },

      setSubscriptionStatus: (status) => {
        const tier = deriveTier(status);
        set((state) => ({
          isPremium: tier === 'pro' || tier === 'pro_plus',
          isPro: tier === 'pro' || tier === 'pro_plus',
          isProPlus: tier === 'pro_plus',
          subscriptionTier: tier,
          user: state.user ? { ...state.user, subscriptionStatus: status } : null,
          // Annual PRO+ includes PDF access
          hasPdfAccess: tier === 'pro_plus' || state.hasPdfAccess,
        }));
      },

      setPdfAccess: (has) => set({ hasPdfAccess: has }),
      setChapterUnlock: (has) => set({ hasChapterUnlock: has }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          isPremium: false,
          isPro: false,
          isProPlus: false,
          subscriptionTier: 'free',
          hasPdfAccess: false,
          hasChapterUnlock: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
