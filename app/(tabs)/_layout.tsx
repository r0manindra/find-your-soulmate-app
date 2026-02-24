import React from 'react';
import { Platform, StyleSheet, View, Pressable, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/components/useColorScheme';
import '@/src/i18n/config';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabConfig = {
  name: string;
  ionicon: keyof typeof Ionicons.glyphMap;
  ioniconFocused: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIG: TabConfig[] = [
  { name: 'index', ionicon: 'home-outline', ioniconFocused: 'home' },
  { name: 'guide', ionicon: 'book-outline', ioniconFocused: 'book' },
  { name: 'coach', ionicon: 'chatbubbles-outline', ioniconFocused: 'chatbubbles' },
  { name: 'books', ionicon: 'library-outline', ioniconFocused: 'library' },
  { name: 'profile', ionicon: 'person-outline', ioniconFocused: 'person' },
];

function AnimatedTabIcon({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 12, stiffness: 300 });
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    }
  }, [focused]);

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
}

function AndroidGlassTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[androidStyles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={[androidStyles.container, isDark && androidStyles.containerDark]}>
        <BlurView
          intensity={70}
          tint={isDark ? 'dark' : 'light'}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <View style={[androidStyles.overlay, isDark ? androidStyles.overlayDark : androidStyles.overlayLight]} />
        <View style={androidStyles.tabs}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const focused = state.index === index;
            const config = TAB_CONFIG[index];
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
              <Pressable
                key={route.key}
                onPress={onPress}
                style={androidStyles.tab}
              >
                <AnimatedTabIcon
                  name={focused ? config.ioniconFocused : config.ionicon}
                  focused={focused}
                  color={focused ? '#E8435A' : isDark ? '#737373' : '#A3A3A3'}
                />
                <Text
                  style={[
                    androidStyles.tabLabel,
                    { color: focused ? '#E8435A' : isDark ? '#737373' : '#A3A3A3' },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isAndroid = Platform.OS === 'android';

  return (
    <Tabs
      tabBar={isAndroid ? (props) => <AndroidGlassTabBar {...props} /> : undefined}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E8435A',
        tabBarInactiveTintColor: isDark ? '#737373' : '#A3A3A3',
        ...(isAndroid
          ? {}
          : {
              tabBarStyle: {
                position: 'absolute' as const,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                backgroundColor: 'transparent',
                elevation: 0,
              },
              tabBarBackground: () => (
                <BlurView
                  intensity={80}
                  tint={isDark ? 'dark' : 'light'}
                  style={StyleSheet.absoluteFill}
                />
              ),
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600' as const,
                letterSpacing: -0.2,
              },
            }),
      }}
    >
      {TAB_CONFIG.map((tab, idx) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(`tabs.${tab.name === 'index' ? 'home' : tab.name}`),
            tabBarIcon: ({ focused, color }) => (
              <AnimatedTabIcon
                name={focused ? tab.ioniconFocused : tab.ionicon}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const androidStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  container: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
  },
  containerDark: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayLight: {
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  overlayDark: {
    backgroundColor: 'rgba(28,28,30,0.75)',
  },
  tabs: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
