# Charismo Architecture Blueprint

> A complete guide to replicate this app's architecture, styling philosophy, glassmorphism design system, native iOS 26+ Liquid Glass navigation, state management, and more — for any new iOS / React Native app.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Project Structure](#2-project-structure)
3. [Navigation & Liquid Glass Tab Bar](#3-navigation--liquid-glass-tab-bar)
4. [Glass Design System (Theme)](#4-glass-design-system-theme)
5. [Color Palette & Gradients](#5-color-palette--gradients)
6. [Glass Card Component (Cross-Platform)](#6-glass-card-component-cross-platform)
7. [State Management with Zustand](#7-state-management-with-zustand)
8. [Animations & Haptics](#8-animations--haptics)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [Authentication (OAuth + Email)](#10-authentication-oauth--email)
11. [In-App Purchases (RevenueCat)](#11-in-app-purchases-revenuecat)
12. [Backend API Pattern](#12-backend-api-pattern)
13. [AI Integration (Chat + Voice)](#13-ai-integration-chat--voice)
14. [Content Architecture](#14-content-architecture)
15. [File Naming Conventions](#15-file-naming-conventions)
16. [Performance Patterns](#16-performance-patterns)
17. [Key Dependencies (package.json)](#17-key-dependencies-packagejson)

---

## 1. Tech Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo (Managed) | 54 |
| Routing | Expo Router (file-based) | 6 |
| UI | React Native | 0.81+ |
| React | React | 19 |
| State | Zustand + AsyncStorage persist | 5 |
| Animations | React Native Reanimated | 4 |
| Blur/Glass | expo-blur + @callstack/liquid-glass | 15 / 0.7 |
| Gradients | expo-linear-gradient | 15 |
| i18n | i18next + react-i18next | 25 / 16 |
| Auth | Expo Apple Auth + Auth Session (Google) | — |
| Purchases | react-native-purchases (RevenueCat) | 9 |
| Voice | react-native-webrtc | 124 |
| Backend | Express.js on Railway | — |
| Database | Prisma ORM | — |

---

## 2. Project Structure

```
my-app/
├── app/                              # Expo Router — file-based routing
│   ├── _layout.tsx                   # Root layout (fonts, providers, global sync)
│   ├── (tabs)/                       # Tab-based navigation group
│   │   ├── _layout.tsx               # Tab bar config (liquid glass + fallback)
│   │   ├── index.tsx                 # Home / Dashboard
│   │   ├── coach.tsx                 # AI Chat screen
│   │   ├── guide.tsx                 # Learning journey
│   │   ├── habits.tsx                # Habit tracker
│   │   └── profile.tsx               # User profile & settings
│   ├── onboarding/                   # Onboarding flow screens
│   ├── auth/                         # Login / Register screens
│   ├── chapter/[id].tsx              # Dynamic route example
│   ├── paywall.tsx                   # Premium subscription screen
│   └── modal.tsx                     # Generic modal
│
├── src/
│   ├── theme/                        # Design system
│   │   ├── glass.ts                  # Glass tokens (blur, opacity, radius, shadows)
│   │   └── colors.ts                 # Brand palette & gradients
│   │
│   ├── store/                        # Zustand stores (persisted)
│   │   ├── auth-store.ts
│   │   ├── progress-store.ts
│   │   ├── settings-store.ts
│   │   ├── chat-history-store.ts
│   │   ├── habit-store.ts
│   │   ├── user-profile-store.ts
│   │   ├── phrasebook-store.ts
│   │   └── ui-store.ts              # Non-persisted transient state
│   │
│   ├── services/                     # API & native integrations
│   │   ├── api.ts                    # All backend HTTP calls
│   │   ├── purchases.ts             # RevenueCat setup
│   │   └── calendar.ts              # Calendar integration
│   │
│   ├── core/                         # Business logic & types
│   │   ├── entities/
│   │   │   └── types.ts
│   │   └── personalization.ts        # Recommendation algorithms
│   │
│   ├── data/content/                 # Static content (chapters, coaches, etc.)
│   │   ├── chapters.ts
│   │   ├── coach-characters.ts
│   │   └── ...
│   │
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable: GlassCard, BrandButton, ProgressRing
│   │   │   ├── coach/                # Feature-specific components
│   │   │   ├── voice/
│   │   │   ├── habits/
│   │   │   ├── quiz/
│   │   │   ├── celebration/          # Achievement modals, confetti
│   │   │   └── onboarding/
│   │   └── hooks/                    # Presentation hooks
│   │
│   ├── hooks/                        # App-level hooks
│   │   ├── useOAuth.ts
│   │   └── use-voice-session.ts
│   │
│   ├── i18n/
│   │   ├── config.ts                 # i18next init
│   │   └── locales/
│   │       ├── en.json
│   │       └── de.json
│   │
│   └── config/
│       └── oauth.ts                  # Environment-based config
│
├── backend/                          # Express API (deployable separately)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── config/
│   └── prisma/                       # Database schema
│
├── assets/
│   ├── fonts/
│   └── images/
│
├── components/                       # Shared root-level hooks
│   ├── useColorScheme.ts
│   └── useClientOnlyValue.ts
│
└── package.json
```

**Key principle:** Separation into `theme/`, `store/`, `services/`, `core/`, `data/`, and `presentation/` keeps concerns isolated and reusable.

---

## 3. Navigation & Liquid Glass Tab Bar

This is the crown jewel. The app uses a **dual-path adaptive tab bar** that renders the native iOS 26 Liquid Glass tab bar when available, and falls back to a custom floating glass pill on older platforms.

### Tab Layout File (`app/(tabs)/_layout.tsx`)

```tsx
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { NativeTabs } from '@callstack/liquid-glass';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Platform detection
const supportsLiquidGlass = Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 26;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const chatInputFocused = useUIStore(s => s.chatInputFocused);

  // Animated tab bar visibility (hides when chat input is focused)
  const tabBarTranslateY = useSharedValue(0);
  const tabBarOpacity = useSharedValue(1);

  useEffect(() => {
    tabBarTranslateY.value = withTiming(chatInputFocused ? 80 : 0, { duration: 250 });
    tabBarOpacity.value = withTiming(chatInputFocused ? 0 : 1, { duration: 250 });
  }, [chatInputFocused]);

  // ── iOS 26+ Native Liquid Glass Path ──
  if (supportsLiquidGlass) {
    return (
      <NativeTabs
        sidebarAdaptable
        tabBarActiveTintColor={isDark ? '#B794F6' : '#8B5CF6'}
      >
        <NativeTabs.Screen
          name="index"
          options={{ title: 'Home', tabBarIcon: { sfSymbol: 'house.fill' } }}
        />
        <NativeTabs.Screen
          name="guide"
          options={{ title: 'Guide', tabBarIcon: { sfSymbol: 'book.fill' } }}
        />
        <NativeTabs.Screen
          name="habits"
          options={{ title: 'Habits', tabBarIcon: { sfSymbol: 'checkmark.circle.fill' } }}
        />
        <NativeTabs.Screen
          name="coach"
          options={{ title: 'Coach', tabBarIcon: { sfSymbol: 'flame.fill' } }}
        />
        <NativeTabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarIcon: { sfSymbol: 'person.fill' } }}
        />
      </NativeTabs>
    );
  }

  // ── Fallback: Custom Floating Glass Pill Tab Bar ──
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingGlassTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="guide" options={{ title: 'Guide' }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits' }} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### Custom Floating Glass Tab Bar

```tsx
function FloatingGlassTabBar({ state, descriptors, navigation }) {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,            // Pill shape
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        },
        animatedTabBarStyle,           // translateY + opacity animation
      ]}
    >
      {/* Glass background */}
      <BlurView
        intensity={isDark ? 40 : 60}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Semi-transparent overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? 'rgba(30, 30, 35, 0.7)'
              : 'rgba(255, 255, 255, 0.85)',
            borderWidth: 0.5,
            borderColor: isDark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.08)',
            borderRadius: 32,
          },
        ]}
      />

      {/* Tab buttons */}
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return (
          <TabButton
            key={route.key}
            isFocused={isFocused}
            icon={ICONS[route.name]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }}
          />
        );
      })}
    </Animated.View>
  );
}
```

### Tab Button with Bubble Animation

```tsx
function TabButton({ isFocused, icon, onPress }) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(1.15, { damping: 8, stiffness: 320 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 300 });
    }, 150);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={{ alignItems: 'center', flex: 1 }}>
      <Animated.View style={animatedStyle}>
        {/* Active indicator background */}
        {isFocused && (
          <View style={{
            position: 'absolute',
            width: 40, height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
          }} />
        )}
        <Ionicons
          name={isFocused ? icon.filled : icon.outline}
          size={24}
          color={isFocused ? '#8B5CF6' : '#737373'}
        />
      </Animated.View>
    </Pressable>
  );
}
```

### Required Dependencies

```bash
npx expo install @callstack/liquid-glass expo-blur expo-haptics react-native-reanimated react-native-safe-area-context
```

---

## 4. Glass Design System (Theme)

The entire app follows a glassmorphism-first design philosophy defined in a single token file.

### `src/theme/glass.ts`

```typescript
import { Platform, StyleSheet } from 'react-native';

// ── Platform Detection ──
export function supportsLiquidGlass(): boolean {
  return Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26;
}

// ── Glass Tokens ──
export const GLASS = {
  blur: {
    none: 0,
    light: 10,
    medium: 20,
    heavy: 40,
  },
  opacity: {
    subtle: 0.4,
    light: 0.6,
    medium: 0.7,
    heavy: 0.85,
  },
  border: {
    width: 0.5,
    opacity: 0.2,
  },
};

export const BORDER_RADIUS = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
  circle: 9999,
};

export const SHADOWS = StyleSheet.create({
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  }),
});

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ── Color Utility ──
export function withOpacity(color: string, opacity: number): string {
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');

  // Handle hex
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity})`;
  }

  return color;
}
```

### How Glass Renders Per Platform

| Platform | Technique |
|----------|-----------|
| **iOS 26+** | `@callstack/liquid-glass` `LiquidGlassView` — native system-level glass |
| **iOS < 26** | `expo-blur` `BlurView` + semi-transparent overlay View |
| **Android** | `expo-blur` `BlurView` (limited) + semi-transparent overlay |
| **Web** | CSS `backdropFilter: blur(20px)` + `WebkitBackdropFilter` |

---

## 5. Color Palette & Gradients

### `src/theme/colors.ts`

```typescript
export const COLORS = {
  primary: '#E8435A',         // Coral red — brand primary
  primaryDark: '#D63851',
  secondary: '#FF7854',       // Coral orange

  accent: {
    gold: '#F5C563',
    violet: '#8B5CF6',        // Default coach / active accent
  },

  // Neutral scale (light → dark)
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    850: '#1E1E23',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Gradients (for LinearGradient)
  gradients: {
    brand: ['#E8435A', '#FF7854'],           // Primary CTA
    brandReverse: ['#FF7854', '#E8435A'],
    premium: ['#8B5CF6', '#6D28D9'],         // Premium / pro
    dark: ['#1E1E23', '#171717'],
  },
};
```

### Usage Pattern (Dark/Light)

```tsx
const isDark = useColorScheme() === 'dark';

const bg = isDark ? COLORS.neutral[900] : COLORS.neutral[50];
const text = isDark ? COLORS.neutral[100] : COLORS.neutral[900];
const card = isDark ? 'rgba(30,30,35,0.7)' : 'rgba(255,255,255,0.85)';
const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
```

---

## 6. Glass Card Component (Cross-Platform)

The reusable glass card auto-detects the platform and renders the best available glass effect.

### `src/presentation/components/ui/glass-card.tsx`

```tsx
import { View, StyleSheet, Platform, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { GLASS, BORDER_RADIUS, SHADOWS, supportsLiquidGlass, withOpacity } from '@/theme/glass';

// Conditionally import liquid glass (iOS 26+ only)
let LiquidGlassView: any = null;
if (supportsLiquidGlass()) {
  LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
}

interface GlassCardProps extends ViewProps {
  intensity?: 'light' | 'medium' | 'heavy';
  borderRadius?: number;
  padding?: number;
  children: React.ReactNode;
}

export function GlassCard({
  intensity = 'medium',
  borderRadius = BORDER_RADIUS.lg,
  padding = 16,
  children,
  style,
  ...props
}: GlassCardProps) {
  const isDark = useColorScheme() === 'dark';

  const blurAmount = GLASS.blur[intensity];
  const bgOpacity = GLASS.opacity[intensity];

  // ── iOS 26+ Native Liquid Glass ──
  if (LiquidGlassView) {
    return (
      <LiquidGlassView
        style={[{ borderRadius, padding, overflow: 'hidden' }, SHADOWS.card, style]}
        {...props}
      >
        {children}
      </LiquidGlassView>
    );
  }

  // ── Web: CSS backdrop-filter ──
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          {
            borderRadius,
            padding,
            overflow: 'hidden',
            // @ts-ignore — web-only CSS properties
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            backgroundColor: isDark
              ? `rgba(30, 30, 35, ${bgOpacity})`
              : `rgba(255, 255, 255, ${bgOpacity})`,
            borderWidth: GLASS.border.width,
            borderColor: withOpacity(isDark ? '#fff' : '#000', GLASS.border.opacity),
          },
          SHADOWS.card,
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  // ── Native Fallback (BlurView) ──
  return (
    <View
      style={[
        { borderRadius, overflow: 'hidden' },
        SHADOWS.card,
        style,
      ]}
      {...props}
    >
      {/* Blur layer */}
      <BlurView
        intensity={blurAmount}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Semi-transparent overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? `rgba(30, 30, 35, ${bgOpacity})`
              : `rgba(255, 255, 255, ${bgOpacity})`,
            borderWidth: GLASS.border.width,
            borderColor: withOpacity(isDark ? '#fff' : '#000', GLASS.border.opacity),
            borderRadius,
          },
        ]}
      />

      {/* Content */}
      <View style={{ padding }}>{children}</View>
    </View>
  );
}
```

---

## 7. State Management with Zustand

Every store follows the same pattern: **Zustand + AsyncStorage persistence + partialize**.

### Store Template

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyStore {
  // State
  items: string[];
  count: number;

  // Actions
  addItem: (item: string) => void;
  reset: () => void;
}

export const useMyStore = create<MyStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
          count: state.count + 1,
        })),

      reset: () => set({ items: [], count: 0 }),
    }),
    {
      name: 'my-store',                              // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({                      // Only persist these fields
        items: state.items,
        count: state.count,
      }),
    }
  )
);
```

### Store Inventory

| Store | Key | Persisted | Purpose |
|-------|-----|-----------|---------|
| `auth-store` | `auth-storage` | Yes | User, token, subscription tier |
| `progress-store` | `progress-storage` | Yes | Completed chapters, streak, quiz scores |
| `user-profile-store` | `user-profile-storage` | Yes | Onboarding answers (gender, age, goals) |
| `chat-history-store` | `chat-history-storage` | Yes | Conversations per coach (max 50) |
| `habit-store` | `habit-storage` | Yes | Habits + completions |
| `settings-store` | `settings-storage` | Yes | Locale, theme, selected coach |
| `phrasebook-store` | `phrasebook-storage` | Yes | Saved phrase IDs |
| `ui-store` | — | **No** | Chat focus, active exercise mode |

### Subscription Tier Derivation (Auth Store)

```typescript
get tier() {
  const status = user?.subscriptionStatus;
  if (status === 'PRO_PLUS' || status === 'PREMIUM') return 'pro_plus';
  if (status === 'PRO') return 'pro';
  return 'free';
},
get isPremium() { return tier !== 'free'; },
```

---

## 8. Animations & Haptics

### Animation Library: Reanimated 4

All animations use `react-native-reanimated` shared values and animated styles for 60fps native-thread performance.

### Common Animation Patterns

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

// ── 1. Bubble Press (buttons, tab icons) ──
const scale = useSharedValue(1);
const onPress = () => {
  scale.value = withSpring(1.15, { damping: 8, stiffness: 320 });
  setTimeout(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 300 });
  }, 150);
};

// ── 2. Slide In/Out (tab bar collapse) ──
const translateY = useSharedValue(0);
translateY.value = withTiming(visible ? 0 : 80, { duration: 250 });

// ── 3. Pulse Rings (voice coaching indicator) ──
const ring1 = useSharedValue(1);
ring1.value = withRepeat(
  withTiming(1.4, { duration: 1500, easing: Easing.out(Easing.ease) }),
  -1,  // infinite
  true // reverse
);
// Stagger ring2 at 300ms delay, ring3 at 600ms

// ── 4. Entering Animations (page content) ──
<Animated.View entering={FadeInDown.duration(400).delay(200)}>
  <Text>Welcome</Text>
</Animated.View>
```

### Haptic Feedback

```tsx
import * as Haptics from 'expo-haptics';

// On tab press, button tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// On success (achievement unlock, quiz pass)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// On error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## 9. Internationalization (i18n)

### Setup (`src/i18n/config.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import de from './locales/de.json';

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: deviceLocale === 'de' ? 'de' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

### Locale File Structure (`en.json`)

```json
{
  "tabs": {
    "home": "Home",
    "guide": "Guide",
    "coach": "Coach",
    "habits": "Habits",
    "profile": "Profile"
  },
  "coach": {
    "placeholder": "Ask {{name}} anything...",
    "sendButton": "Send"
  },
  "onboarding": {
    "welcome": "Welcome to Charismo",
    "step1Title": "What's your gender?"
  }
}
```

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('coach.placeholder', { name: 'Charismo' })}</Text>;
}
```

### Bilingual Content Data

All static content uses `{ en: string, de: string }` objects:

```typescript
const chapter = {
  id: 1,
  title: { en: 'Know Yourself', de: 'Erkenne dich selbst' },
  subtitle: { en: 'Self-awareness basics', de: 'Grundlagen der Selbstwahrnehmung' },
};

// Access with current locale
const locale = useSettingsStore(s => s.locale);
<Text>{chapter.title[locale]}</Text>
```

---

## 10. Authentication (OAuth + Email)

### OAuth Hook (`src/hooks/useOAuth.ts`)

```typescript
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

export function useOAuth() {
  const [googleReq, googleRes, googlePrompt] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  const signInWithGoogle = async () => {
    const result = await googlePrompt();
    if (result?.type === 'success') {
      const idToken = result.params.id_token;
      const { token, user } = await api.loginWithGoogle(idToken);
      useAuthStore.getState().setUser(user);
      // Navigate to (tabs)
    }
  };

  const signInWithApple = async () => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const { token, user } = await api.loginWithApple(
      credential.identityToken!,
      credential.fullName,
      credential.email,
    );
    useAuthStore.getState().setUser(user);
  };

  return { signInWithGoogle, signInWithApple, googleReady: !!googleReq };
}
```

---

## 11. In-App Purchases (RevenueCat)

### Setup (`src/services/purchases.ts`)

```typescript
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  ios: 'appl_YOUR_KEY_HERE',
  android: 'goog_YOUR_KEY_HERE',
};

export async function initPurchases(userId?: string) {
  const key = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  Purchases.configure({ apiKey: key, appUserID: userId });
}

export const ENTITLEMENTS = {
  PRO: 'pro',
  PRO_PLUS: 'pro_plus',
  LEGACY: 'premium',
};

export async function checkEntitlements() {
  const info = await Purchases.getCustomerInfo();
  const entitlements = info.entitlements.active;

  if (entitlements[ENTITLEMENTS.PRO_PLUS]) return 'pro_plus';
  if (entitlements[ENTITLEMENTS.PRO]) return 'pro';
  if (entitlements[ENTITLEMENTS.LEGACY]) return 'pro';
  return 'free';
}
```

### Initialization (Root Layout)

```tsx
// app/_layout.tsx
useEffect(() => {
  const user = useAuthStore.getState().user;
  initPurchases(user?.id);
}, []);
```

---

## 12. Backend API Pattern

### API Service (`src/services/api.ts`)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://your-app.up.railway.app/api';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('auth_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ── Auth ──
export const api = {
  register: (email: string, password: string, name?: string) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  // ── Progress Sync (debounced) ──
  syncProgress: (payload: ProgressPayload) =>
    request('/progress/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // ── AI Coach ──
  sendCoachMessage: (message: string, characterId: string, context?: any) =>
    request<{ response: string; messagesUsed: number; messagesLimit: number }>(
      '/coach/message',
      { method: 'POST', body: JSON.stringify({ message, characterId, context }) }
    ),
};
```

### Debounced Progress Sync (Root Layout)

```tsx
// app/_layout.tsx
useEffect(() => {
  const timeout = setTimeout(() => {
    const progress = useProgressStore.getState();
    const user = useAuthStore.getState().user;
    if (user) {
      api.syncProgress({
        completedChapters: progress.completedChapters,
        completedBooks: progress.completedBooks,
        chatMessageCount: progress.chatMessageCount,
        streak: progress.streak,
        lastActiveDate: progress.lastActiveDate,
        graduated: progress.graduated,
      }).catch(() => {}); // Silent fail for offline
    }
  }, 2000); // 2s debounce
  return () => clearTimeout(timeout);
}, [progressDeps]);
```

---

## 13. AI Integration (Chat + Voice)

### Coach Chat Architecture

```
User Input
    |
    v
sendCoachMessage(message, characterId, context)
    |
    |-- context includes:
    |   ├── profile: { gender, ageGroup, skillLevel, socialEnergy, goal }
    |   ├── progress: { completedChapters, streak, graduated }
    |   ├── habits: { activeHabits, todayCompleted, weeklyRate }
    |   └── locale: 'en' | 'de'
    |
    v
Backend (Express) → OpenAI API → Response
    |
    v
Display in chat UI + save to chat-history-store
```

### Voice Coaching (WebRTC)

```
1. createVoiceSession(characterId, locale) → { clientSecret }
2. RTCPeerConnection with OpenAI Realtime API
3. getUserMedia({ audio: true }) → local mic stream
4. DataChannel for events (AI speaking state, session end)
5. Auto-end after 10 minutes
```

### Coach Characters Data Structure

```typescript
interface CoachCharacter {
  id: string;
  name: string;
  vibe: { en: string; de: string };
  description: { en: string; de: string };
  gender: 'male' | 'female';
  isPremium: boolean;
  color: string;                    // Accent color for UI theming
  greeting: { en: string; de: string };
}
```

---

## 14. Content Architecture

### Chapter Structure

```typescript
interface Chapter {
  id: number;
  slug: string;
  icon: string;              // Emoji
  ionicon: string;           // Ionicon name
  phase: number;             // 0-5
  title: { en: string; de: string };
  subtitle: { en: string; de: string };
  summary: { en: string; de: string };
}

// Phases
const PHASES = [
  { id: 0, title: 'The Basics', chapters: [21-25] },
  { id: 1, title: 'Know Yourself', chapters: [1-4] },
  { id: 2, title: 'Make Your Move', chapters: [5-8] },
  { id: 3, title: 'The Connection', chapters: [9-12] },
  { id: 4, title: 'Going Deeper', chapters: [13-16] },
  { id: 5, title: 'The Commitment', chapters: [17-20] },
];
```

### Gamification: Achievements

```typescript
interface Achievement {
  id: string;
  title: { en: string; de: string };
  description: { en: string; de: string };
  icon: string;
  condition: (progress: ProgressState) => boolean;
}

// Example
{
  id: 'first_message',
  title: { en: 'First Steps', de: 'Erste Schritte' },
  condition: (p) => p.chatMessageCount >= 1,
}
```

Achievement modal is queued and displayed one-at-a-time to prevent overlap.

---

## 15. File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Directories** | kebab-case | `data/content/`, `presentation/components/` |
| **Screen files** | lowercase `.tsx` | `app/(tabs)/coach.tsx` |
| **Component files** | kebab-case `.tsx` | `glass-card.tsx`, `brand-button.tsx` |
| **Component exports** | PascalCase | `export function GlassCard()` |
| **Store files** | kebab-case + `-store` | `auth-store.ts`, `progress-store.ts` |
| **Hook files** | `use-` prefix, kebab or camel | `useOAuth.ts`, `use-voice-session.ts` |
| **Service files** | kebab-case | `api.ts`, `purchases.ts` |
| **Type interfaces** | PascalCase + suffix | `AuthStore`, `ProgressState`, `ChapterProps` |
| **Constants** | UPPER_SNAKE_CASE | `GLASS`, `COLORS`, `BORDER_RADIUS` |

---

## 16. Performance Patterns

### 1. Debounced Backend Sync
Progress syncs to backend only after 2 seconds of inactivity, preventing API spam during rapid interactions.

### 2. Set-Based Lookups
Habit streak calculation converts completion arrays to `Set` for O(1) lookups instead of O(n) `Array.includes()`.

```typescript
getStreak(habitId) {
  const completionSet = new Set(
    completions.filter(c => c.habitId === habitId).map(c => c.date)
  );
  // O(1) per day check
  while (completionSet.has(dateStr)) { streak++; ... }
}
```

### 3. Lazy Loading
- WebRTC module loaded on-demand (avoids Expo Go crashes)
- Liquid Glass imported conditionally (iOS 26+ only)

### 4. Achievement Queue
Achievements are enqueued and dequeued one-at-a-time to prevent modal stacking.

### 5. Zustand Partialize
Only necessary fields are persisted to AsyncStorage — transient UI state is excluded.

### 6. Reanimated Native Thread
All animations run on the native UI thread via `useAnimatedStyle` and shared values — zero JS thread blocking.

---

## 17. Key Dependencies (package.json)

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-router": "~6.0.0",
    "react": "19.1.0",
    "react-native": "0.81.5",

    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "2.1.2",

    "react-native-reanimated": "~4.1.0",
    "react-native-gesture-handler": "~2.25.0",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.11.1",

    "expo-blur": "~15.0.2",
    "@callstack/liquid-glass": "^0.7.0",
    "expo-linear-gradient": "~15.0.1",
    "expo-haptics": "~15.0.1",

    "i18next": "^25.8.0",
    "react-i18next": "^16.0.0",
    "expo-localization": "~16.0.1",

    "expo-apple-authentication": "~7.2.2",
    "expo-auth-session": "~7.0.4",
    "expo-crypto": "~15.0.3",

    "react-native-purchases": "^9.10.0",

    "react-native-webrtc": "^124.0.4",

    "@expo/vector-icons": "^14.1.0",
    "expo-font": "~14.0.1",
    "expo-splash-screen": "~0.30.8",
    "expo-clipboard": "~8.0.1",
    "expo-calendar": "~14.0.5"
  }
}
```

### Expo Config Essentials (`app.json`)

```json
{
  "expo": {
    "name": "YourApp",
    "slug": "your-app",
    "scheme": "your-app",
    "orientation": "portrait",
    "newArchEnabled": true,
    "plugins": [
      "expo-router",
      "expo-localization",
      "expo-apple-authentication",
      "expo-calendar",
      ["react-native-webrtc", {}]
    ],
    "ios": {
      "bundleIdentifier": "com.yourapp.app",
      "supportsTablet": true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Used for voice coaching"
      }
    },
    "android": {
      "package": "com.yourapp.app",
      "edgeToEdgeEnabled": true
    }
  }
}
```

---

## Quick-Start Checklist for a New App

1. `npx create-expo-app my-app --template tabs` (Expo Router tabs template)
2. Install deps: `npx expo install zustand expo-blur @callstack/liquid-glass expo-linear-gradient react-native-reanimated expo-haptics react-native-purchases i18next react-i18next expo-localization`
3. Create `src/theme/glass.ts` and `src/theme/colors.ts` with your tokens
4. Build `GlassCard` component with the 3-path rendering (liquid glass / blur / web)
5. Set up `app/(tabs)/_layout.tsx` with the dual-path tab bar (NativeTabs + FloatingGlassTabBar)
6. Create your Zustand stores in `src/store/` with AsyncStorage persist
7. Set up `src/i18n/config.ts` with your supported locales
8. Wire up OAuth in `src/hooks/useOAuth.ts`
9. Configure RevenueCat in `src/services/purchases.ts`
10. Build your screens, ship it

---

*Generated from the Charismo codebase. Adapt the patterns, swap the content, keep the glass.*
