import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CharismoIcon } from '@/src/presentation/components/ui/charismo-icon';
import '@/src/i18n/config';

import { useColorScheme } from '@/components/useColorScheme';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import i18n from '@/src/i18n/config';
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
SplashScreen.setOptions({ duration: 250, fade: true });

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

/**
 * Seamless animated splash screen.
 *
 * Key insight: the animated overlay starts IDENTICAL to the native splash
 * (solid #E8435A + white icon at full opacity/scale) so the handoff is invisible.
 * Then it subtly enhances (gradient, glow, text) and exits cleanly.
 */
function AnimatedSplash({ onFinish, onReady, appReady }: { onFinish: () => void; onReady: () => void; appReady: boolean }) {
  // Start matching native splash exactly: icon visible at same size, solid red background
  const gradientProgress = useSharedValue(0);   // 0 = solid red, 1 = gradient visible
  const glowOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const iconScale = useSharedValue(1);           // Start at 1 — matches native splash exactly (no size change)
  const overlayOpacity = useSharedValue(1);
  const exitStarted = useRef(false);

  // Phase 1-3: entrance animations (run immediately)
  useEffect(() => {
    // Signal ready immediately — native splash fades fast (250ms) into this identical view
    onReady();

    // Phase 1 (100–500ms): Morph solid red → gradient. Subtle enhancement.
    gradientProgress.value = withDelay(100, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));

    // Phase 2 (300–800ms): Subtle glow ring appears behind icon
    glowOpacity.value = withDelay(300, withTiming(0.8, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // Phase 3 (400–900ms): Brand text slides up
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    textTranslateY.value = withDelay(400, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, []);

  // Phase 4: exit — only starts once appReady (stores hydrated, routing settled)
  useEffect(() => {
    if (!appReady || exitStarted.current) return;
    exitStarted.current = true;

    // Small delay to let the destination screen render beneath before we fade out
    const exitDelay = 200;
    iconScale.value = withDelay(exitDelay, withTiming(1.06, { duration: 300, easing: Easing.out(Easing.quad) }));
    glowOpacity.value = withDelay(exitDelay, withTiming(0, { duration: 350 }));
    textOpacity.value = withDelay(exitDelay, withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }));
    textTranslateY.value = withDelay(exitDelay, withTiming(-3, { duration: 300, easing: Easing.in(Easing.cubic) }));
    overlayOpacity.value = withDelay(exitDelay + 200, withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onFinish)();
    }));
  }, [appReady]);

  const iconStyle = useAnimatedStyle(() => ({
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

  // Gradient overlays a solid red base. gradientProgress controls gradient opacity.
  const gradientOverlayStyle = useAnimatedStyle(() => ({
    opacity: gradientProgress.value,
  }));

  return (
    <Animated.View style={[splashStyles.overlay, overlayStyle]} pointerEvents="none">
      {/* Solid red base — identical to native splash */}
      <View style={splashStyles.solidBase}>
        {/* Gradient fades in on top */}
        <Animated.View style={[StyleSheet.absoluteFill, gradientOverlayStyle]}>
          <LinearGradient
            colors={['#E8435A', '#FF7854']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={splashStyles.centerContent}>
          <View style={splashStyles.iconWrapper}>
            <Animated.View style={[splashStyles.glowRing, glowStyle]} />
            <Animated.View style={[splashStyles.iconContainer, iconStyle]}>
              <CharismoIcon size={200} color="#fff" />
            </Animated.View>
          </View>
          <Animated.Text style={[splashStyles.brandText, textStyle]}>
            Charismo
          </Animated.Text>
        </View>
      </View>
    </Animated.View>
  );
}

const splashStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  solidBase: {
    flex: 1,
    backgroundColor: '#E8435A', // Exactly matches native splash
  },
  centerContent: {
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginTop: 18,
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [storesHydrated, setStoresHydrated] = useState(false);

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

  // Wait for stores to hydrate so routing is settled before splash exits
  useEffect(() => {
    let cancelled = false;
    const check = () => {
      if (!cancelled &&
        useUserProfileStore.persist.hasHydrated() &&
        useProgressStore.persist.hasHydrated() &&
        useSettingsStore.persist.hasHydrated()
      ) {
        // Small delay to let OnboardingGate redirect if needed
        setTimeout(() => {
          if (!cancelled) setStoresHydrated(true);
        }, 100);
      }
    };
    check();
    const unsub1 = useUserProfileStore.persist.onFinishHydration(check);
    const unsub2 = useProgressStore.persist.onFinishHydration(check);
    const unsub3 = useSettingsStore.persist.onFinishHydration(check);
    return () => { cancelled = true; unsub1(); unsub2(); unsub3(); };
  }, []);

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
          appReady={storesHydrated}
        />
      )}
    </View>
  );
}

/** Syncs i18n language with the persisted settings store locale on startup */
function I18nSync() {
  const locale = useSettingsStore((s) => s.locale);

  useEffect(() => {
    // After settings store rehydrates, sync i18n to the user's saved language
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return null;
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
        <I18nSync />
        <OnboardingGate />
        <AchievementListener />
        <ProgressSync />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
