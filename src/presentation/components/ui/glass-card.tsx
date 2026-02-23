import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 50, ...props }: GlassCardProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, style]} {...props}>
      <BlurView
        intensity={intensity}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={[
        styles.overlay,
        colorScheme === 'dark' ? styles.overlayDark : styles.overlayLight,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayLight: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  overlayDark: {
    backgroundColor: 'rgba(28,28,30,0.68)',
  },
  content: {
    padding: 16,
  },
});
