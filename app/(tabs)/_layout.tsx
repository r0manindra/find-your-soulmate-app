import React, { useCallback, useEffect } from 'react';
import { Platform, StyleSheet, View, Pressable, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/components/useColorScheme';
import { GLASS, BORDER_RADIUS, SHADOWS, withOpacity, supportsLiquidGlass } from '@/src/theme/glass';
import { useUIStore } from '@/src/store/ui-store';
import { CharismoIcon } from '@/src/presentation/components/ui/charismo-icon';
import '@/src/i18n/config';

const hasLiquidGlass = supportsLiquidGlass();

// Conditionally load NativeTabs for iOS 26+
let NativeTabs: any = null;
let NativeLabel: any = null;
let NativeIcon: any = null;
if (hasLiquidGlass) {
  try {
    const mod = require('expo-router/unstable-native-tabs');
    NativeTabs = mod.NativeTabs;
    NativeLabel = mod.Label;
    NativeIcon = mod.Icon;
  } catch {}
}

// ---------------------------------------------------------------------------
// Tab configuration
// ---------------------------------------------------------------------------

type TabConfig = {
  name: string;
  ionicon: keyof typeof Ionicons.glyphMap;
  ioniconFocused: keyof typeof Ionicons.glyphMap;
  sfSymbol?: string;
  sfSymbolFocused?: string;
  useCharismoIcon?: boolean;
};

const TAB_CONFIG: TabConfig[] = [
  { name: 'index', ionicon: 'home-outline', ioniconFocused: 'home', sfSymbol: 'house', sfSymbolFocused: 'house.fill' },
  { name: 'guide', ionicon: 'book-outline', ioniconFocused: 'book', sfSymbol: 'book', sfSymbolFocused: 'book.fill' },
  { name: 'habits', ionicon: 'checkmark-circle-outline', ioniconFocused: 'checkmark-circle', sfSymbol: 'checkmark.circle', sfSymbolFocused: 'checkmark.circle.fill' },
  { name: 'coach', ionicon: 'chatbubbles-outline', ioniconFocused: 'chatbubbles', sfSymbol: 'bubble.left.and.bubble.right', sfSymbolFocused: 'bubble.left.and.bubble.right.fill', useCharismoIcon: true },
  { name: 'profile', ionicon: 'person-outline', ioniconFocused: 'person', sfSymbol: 'person', sfSymbolFocused: 'person.fill' },
];

// ---------------------------------------------------------------------------
// Path A: iOS 26+ — Native liquid glass tab bar
// ---------------------------------------------------------------------------

function NativeLiquidGlassLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const foreground = isDark ? '#F5F5F5' : '#171717';
  const muted = isDark ? '#737373' : '#A3A3A3';

  return (
    <NativeTabs
      tintColor={foreground}
      iconColor={{ default: muted, selected: foreground }}
      labelVisibilityMode="unlabeled"
      backgroundColor={null}
      screenOptions={{ headerShown: false }}
    >
      {TAB_CONFIG.map((tab) => (
        <NativeTabs.Trigger
          key={tab.name}
          name={tab.name}
          href={tab.name === 'index' ? '/' : `/${tab.name}`}
        >
          <NativeLabel hidden />
          <NativeIcon
            sf={{
              default: tab.sfSymbol as any,
              selected: tab.sfSymbolFocused as any,
            }}
          />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}

// ---------------------------------------------------------------------------
// Path B: Older iOS / Android — Floating glass pill tab bar
// ---------------------------------------------------------------------------

const BUBBLE_SPRING = { damping: 8, stiffness: 320, mass: 0.6 };
const SETTLE_SPRING = { damping: 14, stiffness: 300 };
const TAB_ITEM_SIZE = 48;
const ACTIVE_INDICATOR_SIZE = 40;

function BubbleTabButton({
  config,
  label,
  focused,
  onPress,
  isDark,
}: {
  config: TabConfig;
  label: string;
  focused: boolean;
  onPress: () => void;
  isDark: boolean;
}) {
  const bubble = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(bubble.value, [0, 1], [1, 1.15]) },
      { translateY: interpolate(bubble.value, [0, 1], [0, -2]) },
    ],
  }));

  const handlePress = useCallback(() => {
    bubble.value = withSequence(
      withSpring(1, BUBBLE_SPRING),
      withSpring(0, SETTLE_SPRING),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const activeColor = isDark ? '#B794F6' : '#8B5CF6';
  const inactiveColor = isDark ? '#737373' : '#A3A3A3';
  const color = focused ? activeColor : inactiveColor;

  return (
    <Pressable onPress={handlePress} style={s.tab}>
      {focused && (
        <View style={[s.activeIndicator, { backgroundColor: config.useCharismoIcon ? withOpacity('#E8435A', 0.15) : withOpacity(activeColor, 0.15) }]} />
      )}
      <Animated.View style={animatedStyle}>
        {config.useCharismoIcon ? (
          <CharismoIcon size={25} color={focused ? '#E8435A' : inactiveColor} />
        ) : (
          <Ionicons
            name={focused ? config.ioniconFocused : config.ionicon}
            size={23}
            color={color}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

function FloatingGlassTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const chatInputFocused = useUIStore((s) => s.chatInputFocused);

  const tabBarProgress = useSharedValue(1);

  useEffect(() => {
    tabBarProgress.value = withTiming(chatInputFocused ? 0 : 1, { duration: 250 });
  }, [chatInputFocused]);

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabBarProgress.value,
    transform: [{ translateY: interpolate(tabBarProgress.value, [0, 1], [80, 0]) }],
  }));

  const visibleRoutes = state.routes.filter((route: any) =>
    TAB_CONFIG.some((tab) => tab.name === route.name)
  );

  return (
    <Animated.View
      style={[s.wrapper, { paddingBottom: insets.bottom + 12 }, tabBarAnimatedStyle]}
      pointerEvents={chatInputFocused ? 'none' : 'box-none'}
    >
      <View
        style={[
          s.pillContainer,
          isIOS && !isDark && SHADOWS.medium,
        ]}
      >
        {/* Blur background (iOS only) */}
        {isIOS && (
          <BlurView
            intensity={GLASS.blur.heavy}
            tint={isDark ? 'dark' : 'systemChromeMaterialLight'}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Inner container with tabs */}
        <View
          style={[
            s.pillInner,
            {
              backgroundColor: isIOS
                ? (isDark ? 'rgba(20,20,20,0.7)' : 'rgba(255,255,255,0.6)')
                : (isDark ? '#1C1C1E' : '#FFFFFF'),
              borderColor: isDark
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.08)',
            },
          ]}
        >
          {visibleRoutes.map((route: any) => {
            const realIndex = state.routes.indexOf(route);
            const { options } = descriptors[route.key];
            const focused = state.index === realIndex;
            const configIndex = TAB_CONFIG.findIndex((tab) => tab.name === route.name);
            const config = TAB_CONFIG[configIndex];
            const label = options.title ?? route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <BubbleTabButton
                key={route.key}
                config={config}
                label={label}
                focused={focused}
                onPress={onPress}
                isDark={isDark}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

function FloatingTabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <FloatingGlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(`tabs.${tab.name === 'index' ? 'home' : tab.name}`),
          }}
        />
      ))}
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Export: choose path based on platform
// ---------------------------------------------------------------------------

export default function TabLayout() {
  if (hasLiquidGlass && NativeTabs) {
    return <NativeLiquidGlassLayout />;
  }
  return <FloatingTabLayout />;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  // Floating pill wrapper (Path B)
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pillContainer: {
    borderRadius: BORDER_RADIUS.pill,
    overflow: 'hidden',
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: GLASS.border.width,
    borderRadius: BORDER_RADIUS.pill,
    gap: 16,
  },

  // Tab item
  tab: {
    width: TAB_ITEM_SIZE,
    height: TAB_ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: ACTIVE_INDICATOR_SIZE,
    height: ACTIVE_INDICATOR_SIZE,
    borderRadius: ACTIVE_INDICATOR_SIZE / 2,
  },
});
