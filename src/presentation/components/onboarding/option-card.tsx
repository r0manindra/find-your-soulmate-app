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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, styles.container, selected && styles.containerSelected, isDark && styles.containerDark]}
    >
      <BlurView
        intensity={selected ? 40 : 50}
        tint={isDark ? 'dark' : 'light'}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.overlay,
          isDark ? styles.overlayDark : styles.overlayLight,
          selected && (isDark ? styles.overlaySelectedDark : styles.overlaySelectedLight),
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.label, isDark && styles.labelDark, selected && styles.labelSelected]}>
            {label}
          </Text>
          {note && (
            <Text style={[styles.note, selected && styles.noteSelected]}>
              {note}
            </Text>
          )}
        </View>
        {selected && (
          <View style={styles.checkmark}>
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
    borderWidth: 1.5,
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
    shadowOpacity: 0.15,
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
  overlaySelectedLight: {
    backgroundColor: 'rgba(232,67,90,0.06)',
  },
  overlaySelectedDark: {
    backgroundColor: 'rgba(232,67,90,0.12)',
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
  labelSelected: {
    color: '#E8435A',
  },
  note: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A3A3A3',
    marginTop: 3,
    fontStyle: 'italic',
  },
  noteSelected: {
    color: 'rgba(232,67,90,0.6)',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8435A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
