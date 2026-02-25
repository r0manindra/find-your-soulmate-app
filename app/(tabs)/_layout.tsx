import React, { useCallback } from 'react';
import { Platform, StyleSheet, View, Pressable, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/components/useColorScheme';
import '@/src/i18n/config';

const useLiquidGlass = isLiquidGlassAvailable();

type TabConfig = {
  name: string;
  ionicon: keyof typeof Ionicons.glyphMap;
  ioniconFocused: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIG: TabConfig[] = [
  { name: 'index', ionicon: 'home-outline', ioniconFocused: 'home' },
  { name: 'guide', ionicon: 'book-outline', ioniconFocused: 'book' },
  { name: 'habits', ionicon: 'checkmark-circle-outline', ioniconFocused: 'checkmark-circle' },
  { name: 'coach', ionicon: 'chatbubbles-outline', ioniconFocused: 'chatbubbles' },
  { name: 'profile', ionicon: 'person-outline', ioniconFocused: 'person' },
];

/** Bubble spring config — low damping for overshoot bounce */
const BUBBLE_SPRING = { damping: 8, stiffness: 320, mass: 0.6 };
const SETTLE_SPRING = { damping: 14, stiffness: 300 };

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
      { scale: interpolate(bubble.value, [0, 1], [1, 1.25]) },
      { translateY: interpolate(bubble.value, [0, 1], [0, -4]) },
    ],
  }));

  const handlePress = useCallback(() => {
    // Bubble pop: overshoot to 1 then settle back to 0
    bubble.value = withSequence(
      withSpring(1, BUBBLE_SPRING),
      withSpring(0, SETTLE_SPRING),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const color = focused ? '#E8435A' : isDark ? '#737373' : '#A3A3A3';

  return (
    <Pressable onPress={handlePress} style={s.tab}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={focused ? config.ioniconFocused : config.ionicon}
          size={23}
          color={color}
        />
      </Animated.View>
      <Text style={[s.tabLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function FloatingGlassTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Only render tabs that are in TAB_CONFIG (filter out hidden screens like books)
  const visibleRoutes = state.routes.filter((route: any) =>
    TAB_CONFIG.some((tab) => tab.name === route.name)
  );

  return (
    <View style={[s.wrapper, { paddingBottom: Math.max(insets.bottom, 0) }]}>
      <View style={[s.bar, isDark && s.barDark]}>
        {/* Glass / blur background */}
        {useLiquidGlass ? (
          <GlassView glassEffectStyle="regular" style={StyleSheet.absoluteFill} />
        ) : (
          <>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
              style={StyleSheet.absoluteFill}
            />
            <View style={[s.overlay, isDark ? s.overlayDark : s.overlayLight]} />
          </>
        )}

        {/* Top separator */}
        <View style={[s.separator, isDark && s.separatorDark]} />

        {/* Tab buttons */}
        <View style={s.tabs}>
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
    </View>
  );
}

export default function TabLayout() {
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
      {/* Books screen still exists but hidden from tab bar */}
      <Tabs.Screen
        name="books"
        options={{ href: null, title: t('tabs.books') }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    overflow: 'hidden',
  },
  barDark: {},
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  separatorDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayLight: {
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  overlayDark: {
    backgroundColor: 'rgba(28,28,30,0.82)',
  },
  tabs: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
