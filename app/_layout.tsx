import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback, useRef } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/src/i18n/config';

import { useColorScheme } from '@/components/useColorScheme';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { achievements } from '@/src/data/content/achievements';
import { AchievementModal } from '@/src/presentation/components/celebration/achievement-modal';
import * as api from '@/src/services/api';
import { initPurchases, checkSubscriptionStatus } from '@/src/services/purchases';
import type { Achievement } from '@/src/core/entities/types';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function AchievementListener() {
  const store = useProgressStore();
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const previouslyUnlocked = useRef<Set<string>>(new Set());

  // Initialize previously unlocked on first render
  useEffect(() => {
    const state = useProgressStore.getState();
    achievements.forEach((a) => {
      if (a.condition(state)) {
        previouslyUnlocked.current.add(a.id);
      }
    });
  }, []);

  // Check for newly unlocked achievements on state changes
  useEffect(() => {
    const state = {
      completedChapters: store.completedChapters,
      completedBooks: store.completedBooks,
      chatMessageCount: store.chatMessageCount,
      streak: store.streak,
      lastActiveDate: store.lastActiveDate,
      graduated: store.graduated,
      quizScores: store.quizScores,
    };

    const newlyUnlocked: Achievement[] = [];
    achievements.forEach((a) => {
      if (a.condition(state) && !previouslyUnlocked.current.has(a.id)) {
        newlyUnlocked.push(a);
        previouslyUnlocked.current.add(a.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      // Queue them up
      newlyUnlocked.forEach((a) => store.enqueueAchievement(a.id));
    }
  }, [
    store.completedChapters,
    store.completedBooks,
    store.chatMessageCount,
    store.streak,
    store.graduated,
  ]);

  // Show queued achievements one at a time
  useEffect(() => {
    if (store.achievementQueue.length > 0 && !modalVisible) {
      const nextId = store.achievementQueue[0];
      const achievement = achievements.find((a) => a.id === nextId);
      if (achievement) {
        setCurrentAchievement(achievement);
        setModalVisible(true);
      } else {
        store.dequeueAchievement();
      }
    }
  }, [store.achievementQueue, modalVisible]);

  const handleDismiss = useCallback(() => {
    setModalVisible(false);
    setCurrentAchievement(null);
    store.dequeueAchievement();
  }, [store]);

  return (
    <AchievementModal
      achievement={currentAchievement}
      visible={modalVisible}
      onDismiss={handleDismiss}
    />
  );
}

/** Syncs local progress to backend when user is logged in */
function ProgressSync() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Wait for store hydration before subscribing
    if (!useProgressStore.persist.hasHydrated()) {
      const unsub = useProgressStore.persist.onFinishHydration(() => {
        unsub();
      });
    }

    // Debounced sync: wait 2s after last change, compare to avoid unnecessary syncs
    let lastSyncedJson = '';
    const unsubscribe = useProgressStore.subscribe((state) => {
      const payload = {
        completedChapters: state.completedChapters,
        completedBooks: state.completedBooks,
        chatMessageCount: state.chatMessageCount,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        graduated: state.graduated,
      };
      const json = JSON.stringify(payload);
      if (json === lastSyncedJson) return;

      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        lastSyncedJson = json;
        api.syncProgress(payload).catch(() => { /* silent fail for offline */ });
      }, 2000);
    });

    return () => {
      unsubscribe();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [isLoggedIn]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Initialize RevenueCat
      const user = useAuthStore.getState().user;
      initPurchases(user?.id).then(() => {
        checkSubscriptionStatus();
      }).catch(() => { /* RevenueCat not configured yet */ });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

/** Redirects to onboarding if user hasn't completed it */
function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const hasCompletedOnboarding = useUserProfileStore((s) => s.hasCompletedOnboarding);
  const completedChapters = useProgressStore((s) => s.completedChapters);
  const [hydrated, setHydrated] = useState(false);

  // Wait for zustand hydration
  useEffect(() => {
    const unsub = useUserProfileStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated
    if (useUserProfileStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const inOnboarding = segments[0] === 'onboarding';

    // Skip onboarding for existing users who already have progress
    if (!hasCompletedOnboarding && completedChapters.length > 0) {
      useUserProfileStore.getState().skipOnboarding();
      return;
    }

    // Redirect to onboarding if not completed and not already there
    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [hydrated, hasCompletedOnboarding, segments, completedChapters.length, router]);

  return null;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="chapter/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="books" options={{ headerShown: false }} />
          <Stack.Screen name="phrasebook" options={{ headerShown: false }} />
          <Stack.Screen name="privacy" options={{ headerShown: false }} />
          <Stack.Screen name="terms" options={{ headerShown: false }} />
          <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
        <OnboardingGate />
        <AchievementListener />
        <ProgressSync />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
