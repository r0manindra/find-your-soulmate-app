import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, withRepeat, withSequence, runOnJS, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CharismoIcon } from '@/src/presentation/components/ui/charismo-icon';
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
SplashScreen.setOptions({ duration: 600, fade: true });

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

    // Pull latest progress from backend on login to keep local state in sync
    api.getMe().then(({ user }) => {
      useProgressStore.getState().restoreFromBackend({
        completedChapters: user.completedChapters,
        completedBooks: user.completedBooks,
        chatMessageCount: user.chatMessageCount,
        streak: user.streak,
        graduated: user.graduated,
      });
    }).catch(() => {});

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
        api.syncProgress(payload).catch((err: any) => {
          // Auto-logout on expired token (API already clears token)
          if (err?.status === 401) {
            useAuthStore.getState().logout();
          }
        });
      }, 2000);
    });

    return () => {
      unsubscribe();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [isLoggedIn]);

  return null;
}

function AnimatedSplash({ onFinish, onReady }: { onFinish: () => void; onReady: () => void }) {
  const iconScale = useSharedValue(0.7);
  const iconOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(8);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    // Signal that overlay is mounted — safe to hide native splash
    onReady();

    // Phase 1: Icon appears (0–700ms) — smooth ease-out, no bounce
    iconOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    iconScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });

    // Phase 2: Subtle glow pulse behind icon (600ms–3400ms)
    glowOpacity.value = withDelay(600, withTiming(1, { duration: 500 }, () => {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }));

    // Phase 3: Brand text slides up + fades in (600–1200ms)
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    textTranslateY.value = withDelay(600, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));

    // Phase 4: Hold for 3.5s total, then elegant exit
    iconScale.value = withDelay(3400, withTiming(1.08, { duration: 500, easing: Easing.out(Easing.quad) }));
    iconOpacity.value = withDelay(3600, withTiming(0, { duration: 450, easing: Easing.in(Easing.cubic) }));
    glowOpacity.value = withDelay(3400, withTiming(0, { duration: 400 }));
    textOpacity.value = withDelay(3400, withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }));
    textTranslateY.value = withDelay(3400, withTiming(-4, { duration: 400, easing: Easing.in(Easing.cubic) }));
    overlayOpacity.value = withDelay(3800, withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onFinish)();
    }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View style={[splashStyles.overlay, overlayStyle]} pointerEvents="none">
      <LinearGradient
        colors={['#E8435A', '#FF7854']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={splashStyles.gradient}
      >
        <View style={splashStyles.iconWrapper}>
          {/* Subtle glow ring behind icon */}
          <Animated.View style={[splashStyles.glowRing, glowStyle]} />
          <Animated.View style={[splashStyles.iconContainer, iconStyle]}>
            <CharismoIcon size={100} color="#fff" />
          </Animated.View>
        </View>
        <Animated.Text style={[splashStyles.brandText, textStyle]}>
          Charismo
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const splashStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginTop: 20,
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Initialize RevenueCat while splash is still showing
      const user = useAuthStore.getState().user;
      initPurchases(user?.id).then(() => {
        checkSubscriptionStatus();
      }).catch(() => { /* RevenueCat not configured yet */ });
    }
  }, [loaded]);

  // Don't hide native splash until animated overlay is mounted
  const handleSplashReady = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <RootLayoutNav />
      {showSplash && (
        <AnimatedSplash
          onReady={handleSplashReady}
          onFinish={() => setShowSplash(false)}
        />
      )}
    </View>
  );
}

/** Redirects to onboarding if user hasn't completed it */
function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const hasCompletedOnboarding = useUserProfileStore((s) => s.hasCompletedOnboarding);
  const completedChapters = useProgressStore((s) => s.completedChapters);
  const [hydrated, setHydrated] = useState(false);

  // Wait for both stores to hydrate before routing
  useEffect(() => {
    let cancelled = false;
    const checkHydrated = () => {
      if (!cancelled &&
        useUserProfileStore.persist.hasHydrated() &&
        useProgressStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    };

    checkHydrated();
    const unsub1 = useUserProfileStore.persist.onFinishHydration(checkHydrated);
    const unsub2 = useProgressStore.persist.onFinishHydration(checkHydrated);
    return () => { cancelled = true; unsub1(); unsub2(); };
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
