import React from 'react';
import { View, StyleSheet, Platform, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';
import { GLASS, SHADOWS, supportsLiquidGlass } from '@/src/theme/glass';

let LiquidGlassView: any = null;
const hasLiquidGlass = supportsLiquidGlass();
if (hasLiquidGlass) {
  try {
    LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
  } catch {}
}

interface GlassCardProps extends ViewProps {
  intensity?: 'light' | 'medium' | 'heavy';
  borderRadius?: number;
  padding?: number;
  marginTop?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 'medium',
  borderRadius = 20,
  padding = 16,
  marginTop,
  ...props
}: GlassCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const blurIntensity = GLASS.blur[intensity];

  const containerStyle = [
    { borderRadius, overflow: 'hidden' as const, marginTop },
    !hasLiquidGlass && !isDark && SHADOWS.medium,
    style,
  ];

  // iOS 26+ — native liquid glass
  if (hasLiquidGlass && LiquidGlassView) {
    return (
      <LiquidGlassView
        effect="regular"
        colorScheme={isDark ? 'dark' : 'light'}
        style={containerStyle}
        {...props}
      >
        <View style={{ padding }}>{children}</View>
      </LiquidGlassView>
    );
  }

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          containerStyle,
          {
            // @ts-ignore – web CSS property
            backdropFilter: `blur(${blurIntensity}px)`,
            // @ts-ignore – web CSS property
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
            backgroundColor: isDark ? 'rgba(30,30,35,0.85)' : 'rgba(255,255,255,0.85)',
            borderWidth: GLASS.border.width,
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
          },
        ]}
        {...props}
      >
        <View style={{ padding }}>{children}</View>
      </View>
    );
  }

  // Native fallback — expo-blur
  return (
    <View
      style={[
        containerStyle,
        {
          borderWidth: GLASS.border.width,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
        },
      ]}
      {...props}
    >
      <BlurView
        intensity={blurIntensity}
        tint={isDark ? 'dark' : 'light'}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.03)',
          },
        ]}
      />
      <View style={{ padding }}>{children}</View>
    </View>
  );
}
