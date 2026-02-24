import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  subscriptionStatus: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isPremium: boolean;
  setUser: (user: AuthUser) => void;
  setSubscriptionStatus: (status: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isPremium: false,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: true,
          isPremium: user.subscriptionStatus === 'PREMIUM',
        }),

      setSubscriptionStatus: (status) =>
        set((state) => ({
          isPremium: status === 'PREMIUM',
          user: state.user ? { ...state.user, subscriptionStatus: status } : null,
        })),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          isPremium: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
