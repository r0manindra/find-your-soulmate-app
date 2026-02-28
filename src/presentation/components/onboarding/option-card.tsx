import React from 'react';
import { Text, StyleSheet, Platform, View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { GLASS, supportsLiquidGlass } from '@/src/theme/glass';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const hasLiquidGlass = supportsLiquidGlass();
let LiquidGlassView: any = null;
if (hasLiquidGlass) {
  try {
    LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
  } catch {}
}

interface OptionCardProps {
  emoji: string;
  label: string;
  note?: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ emoji, label, note, selected, onSelect }: OptionCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect();
  };

  if (hasLiquidGlass && LiquidGlassView) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[animatedStyle]}
      >
        <LiquidGlassView
          effect={selected ? 'clear' : 'regular'}
          interactive
          tintColor={selected ? '#E8435A' : undefined}
          colorScheme={isDark ? 'dark' : 'light'}
          style={[
            styles.container,
            selected && styles.containerSelected,
            isDark && !selected && styles.containerDark,
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.emoji}>{emoji}</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.label, isDark && !selected && styles.labelDark, selected && styles.labelSelectedWhite]}>
                {label}
              </Text>
              {note && (
                <Text style={[styles.note, selected && styles.noteSelectedWhite]}>
                  {note}
                </Text>
              )}
            </View>
            {selected && (
              <View style={styles.checkmarkSelected}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </View>
        </LiquidGlassView>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, styles.container, selected && styles.containerSelected, isDark && !selected && styles.containerDark]}
    >
      {!selected && (
        <>
          <BlurView
            intensity={50}
            tint={isDark ? 'dark' : 'light'}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.overlay,
              isDark ? styles.overlayDark : styles.overlayLight,
            ]}
          />
        </>
      )}
      {selected && (
        <View style={[styles.overlay, styles.overlaySelectedSolid]} />
      )}
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.label, isDark && !selected && styles.labelDark, selected && styles.labelSelectedWhite]}>
            {label}
          </Text>
          {note && (
            <Text style={[styles.note, selected && styles.noteSelectedWhite]}>
              {note}
            </Text>
          )}
        </View>
        {selected && (
          <View style={styles.checkmarkSelected}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: hasLiquidGlass ? 0 : 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  containerSelected: {
    borderColor: '#E8435A',
    shadowColor: '#E8435A',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
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
  overlaySelectedSolid: {
    backgroundColor: '#E8435A',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  emoji: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  labelDark: {
    color: '#F5F5F5',
  },
  labelSelectedWhite: {
    color: '#fff',
  },
  note: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A3A3A3',
    marginTop: 3,
    fontStyle: 'italic',
  },
  noteSelectedWhite: {
    color: 'rgba(255,255,255,0.8)',
  },
  checkmarkSelected: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
