import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useHeartsStore } from '@/src/store/hearts-store';
import { useAuthStore } from '@/src/store/auth-store';

interface HeartCounterProps {
  compact?: boolean;
}

export function HeartCounter({ compact }: HeartCounterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isProPlus = useAuthStore((s) => s.isProPlus);
  const dailyHearts = useHeartsStore((s) => s.dailyHearts);
  const bonusHearts = useHeartsStore((s) => s.bonusHearts);
  const resetIfNewDay = useHeartsStore((s) => s.resetIfNewDay);

  useEffect(() => {
    resetIfNewDay();
  }, []);

  const total = isProPlus ? Infinity : dailyHearts + bonusHearts;

  // Pulse animation when hearts decrease
  const scale = useSharedValue(1);
  const prevTotal = useSharedValue(total);

  useEffect(() => {
    if (total < prevTotal.value && total !== Infinity) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 15, stiffness: 400 })
      );
    }
    prevTotal.value = total;
  }, [total]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (compact) {
    return (
      <Animated.View style={[styles.compactContainer, animatedStyle]}>
        <Ionicons name="heart" size={14} color="#E8435A" />
        <Text style={[styles.compactText, isDark && styles.compactTextDark]}>
          {isProPlus ? '\u221E' : total}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, isDark && styles.containerDark, animatedStyle]}>
      <Ionicons name="heart" size={16} color="#E8435A" />
      <Text style={[styles.text, isDark && styles.textDark]}>
        {isProPlus ? '\u221E' : total}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(232,67,90,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  containerDark: {
    backgroundColor: 'rgba(232,67,90,0.15)',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8435A',
  },
  textDark: {
    color: '#F87171',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8435A',
  },
  compactTextDark: {
    color: '#F87171',
  },
});
