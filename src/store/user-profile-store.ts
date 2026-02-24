import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SocialEnergy = 'deep_introvert' | 'introvert' | 'ambivert' | 'extrovert';
export type AgeGroup = 'age_18_24' | 'age_25_34' | 'age_35_44' | 'age_45_plus';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Goal = 'social_confidence' | 'get_dates' | 'find_partner' | 'social_magnetism' | 'ambitious';
export type BasicsLevel = 'basics_none' | 'basics_some' | 'basics_solid' | 'basics_mastered';

interface UserProfileState {
  socialEnergy: SocialEnergy | null;
  ageGroup: AgeGroup | null;
  basicsLevel: BasicsLevel | null;
  skillLevel: SkillLevel | null;
  goal: Goal | null;
  hasCompletedOnboarding: boolean;
  onboardingCompletedAt: string | null;
}

interface UserProfileActions {
  setSocialEnergy: (value: SocialEnergy) => void;
  setAgeGroup: (value: AgeGroup) => void;
  setBasicsLevel: (value: BasicsLevel) => void;
  setSkillLevel: (value: SkillLevel) => void;
  setGoal: (value: Goal) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  resetProfile: () => void;
}

type UserProfileStore = UserProfileState & UserProfileActions;

const initialState: UserProfileState = {
  socialEnergy: null,
  ageGroup: null,
  basicsLevel: null,
  skillLevel: null,
  goal: null,
  hasCompletedOnboarding: false,
  onboardingCompletedAt: null,
};

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSocialEnergy: (value) => set({ socialEnergy: value }),
      setAgeGroup: (value) => set({ ageGroup: value }),
      setBasicsLevel: (value) => set({ basicsLevel: value }),
      setSkillLevel: (value) => set({ skillLevel: value }),
      setGoal: (value) => set({ goal: value }),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
          onboardingCompletedAt: new Date().toISOString(),
        }),

      skipOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
          onboardingCompletedAt: new Date().toISOString(),
        }),

      resetProfile: () => set(initialState),
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
