import React, { useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useHeartsStore } from '@/src/store/hearts-store';

interface HeartCounterProps {
  compact?: boolean;
}

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export function HeartCounter({ compact }: HeartCounterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const dailyHearts = useHeartsStore((s) => s.dailyHearts);
  const bonusHearts = useHeartsStore((s) => s.bonusHearts);
  const getMaxDailyHearts = useHeartsStore((s) => s.getMaxDailyHearts);
  const resetIfNewDay = useHeartsStore((s) => s.resetIfNewDay);

  const [refillTime, setRefillTime] = useState(getTimeUntilMidnight());

  useEffect(() => {
    resetIfNewDay();
  }, []);

  const total = dailyHearts + bonusHearts;
  const maxDaily = getMaxDailyHearts();
  const showRefill = total < maxDaily;

  // Update refill timer every 60s
  useEffect(() => {
    if (!showRefill) return;
    setRefillTime(getTimeUntilMidnight());
    const timer = setInterval(() => {
      setRefillTime(getTimeUntilMidnight());
    }, 60000);
    return () => clearInterval(timer);
  }, [showRefill]);

  // Pulse animation when hearts decrease
  const scale = useSharedValue(1);
  const prevTotal = useSharedValue(total);

  useEffect(() => {
    if (total < prevTotal.value) {
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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/paywall');
  };

  if (compact) {
    return (
      <Pressable onPress={handlePress} hitSlop={8}>
        <Animated.View style={[styles.compactContainer, animatedStyle]}>
          <Ionicons name="heart" size={14} color="#E8435A" />
          <Text style={[styles.compactText, isDark && styles.compactTextDark]}>
            {total}
            {showRefill ? ` · ${refillTime}` : ''}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} hitSlop={6}>
      <Animated.View style={[styles.container, isDark && styles.containerDark, animatedStyle]}>
        <Ionicons name="heart" size={16} color="#E8435A" />
        <Text style={[styles.text, isDark && styles.textDark]}>
          {total}
        </Text>
        {showRefill && (
          <Text style={[styles.refillText, isDark && styles.refillTextDark]}>
            · {refillTime}
          </Text>
        )}
      </Animated.View>
    </Pressable>
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
  refillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A3A3A3',
  },
  refillTextDark: {
    color: '#737373',
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
