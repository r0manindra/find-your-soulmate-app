import React from 'react';
import { Pressable, Text, StyleSheet, View, Platform, type PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { GLASS, supportsLiquidGlass } from '@/src/theme/glass';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

let LiquidGlassView: any = null;
const hasLiquidGlass = supportsLiquidGlass();
if (hasLiquidGlass) {
  try {
    LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
  } catch {}
}

interface BrandButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'glass';
  icon?: React.ReactNode;
}

export function BrandButton({ title, variant = 'primary', icon, style, ...props }: BrandButtonProps) {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style]}
        {...props}
      >
        <LinearGradient
          colors={['#E8435A', '#FF7854']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  // Glass variant - uses liquid glass on iOS 26+
  if (variant === 'glass' && hasLiquidGlass && LiquidGlassView) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style]}
        {...props}
      >
        <LiquidGlassView
          effect="regular"
          colorScheme={isDark ? 'dark' : 'light'}
          style={styles.glassButton}
        >
          <View style={styles.glassContent}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.glassText, isDark && styles.glassTextDark]}>{title}</Text>
          </View>
        </LiquidGlassView>
      </AnimatedPressable>
    );
  }

  // Glass variant fallback for non-iOS 26
  if (variant === 'glass') {
    const isIOS = Platform.OS === 'ios';
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, styles.glassButtonFallback, style]}
        {...props}
      >
        {isIOS && (
          <BlurView
            intensity={GLASS.blur.medium}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.6)',
            },
          ]}
        />
        <View style={styles.glassContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.glassText, isDark && styles.glassTextDark]}>{title}</Text>
        </View>
      </AnimatedPressable>
    );
  }

  // Secondary variant
  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, styles.secondary, isDark && styles.secondaryDark, style]}
      {...props}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.secondaryText, isDark && styles.secondaryTextDark]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  secondary: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
    gap: 8,
  },
  secondaryDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  secondaryText: {
    color: '#171717',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  secondaryTextDark: {
    color: '#F5F5F5',
  },
  iconContainer: {
    marginRight: 4,
  },
  // Glass button styles
  glassButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  glassButtonFallback: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: GLASS.border.width,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  glassContent: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  glassText: {
    color: '#171717',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  glassTextDark: {
    color: '#F5F5F5',
  },
});
