import React from 'react';
import { Pressable, Text, StyleSheet, Platform, View, type PressableProps } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  icon?: React.ReactNode;
}

export function GlassButton({ title, icon, style, ...props }: GlassButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, styles.container, isDark && styles.containerDark, style as any]}
      {...props}
    >
      <BlurView
        intensity={60}
        tint={isDark ? 'dark' : 'light'}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.overlay, isDark ? styles.overlayDark : styles.overlayLight]} />
      <View style={styles.content}>
        {icon}
        <Text style={[styles.text, isDark && styles.textDark]}>{title}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDark: {
    borderColor: 'rgba(255,255,255,0.15)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayLight: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  overlayDark: {
    backgroundColor: 'rgba(28,28,30,0.6)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    letterSpacing: -0.2,
  },
  textDark: {
    color: '#F5F5F5',
  },
});
