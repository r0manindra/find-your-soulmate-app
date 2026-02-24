import React from 'react';
import { View, StyleSheet, Platform, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useColorScheme } from '@/components/useColorScheme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  /** 'clear' = more transparent, 'regular' = frosted. Only applies on iOS 26+ */
  glassEffectStyle?: 'clear' | 'regular';
}

const useLiquidGlass = isLiquidGlassAvailable();

export function GlassCard({
  children,
  style,
  intensity = 50,
  glassEffectStyle = 'regular',
  ...props
}: GlassCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (useLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        style={[styles.container, isDark && styles.containerDark, style]}
        {...props}
      >
        <View style={styles.content}>{children}</View>
      </GlassView>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark, style]} {...props}>
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View style={[
        styles.overlay,
        isDark ? styles.overlayDark : styles.overlayLight,
      ]} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: useLiquidGlass ? 0 : StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  containerDark: {
    borderColor: 'rgba(255,255,255,0.12)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayLight: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  overlayDark: {
    backgroundColor: 'rgba(28,28,30,0.72)',
  },
  content: {
    padding: 16,
  },
});
