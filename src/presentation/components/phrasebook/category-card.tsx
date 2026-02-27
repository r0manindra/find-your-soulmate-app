import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import type { PhraseCategory } from '@/src/data/content/phrasebook';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryCardProps {
  category: PhraseCategory;
  phraseCount: number;
  freeCount: number;
  locale: 'en' | 'de';
  onPress: () => void;
}

export function CategoryCard({ category, phraseCount, freeCount, locale, onPress }: CategoryCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, styles.card, isDark && styles.cardDark]}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
        <Ionicons name={category.icon as any} size={28} color={category.color} />
      </View>
      <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={2}>
        {category.name[locale]}
      </Text>
      <Text style={[styles.count, isDark && styles.countDark]}>
        {phraseCount} {locale === 'de' ? 'Sprüche' : 'phrases'}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  cardDark: {
    backgroundColor: '#252525',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  nameDark: {
    color: '#F5F5F5',
  },
  count: {
    fontSize: 12,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  countDark: {
    color: '#737373',
  },
});
