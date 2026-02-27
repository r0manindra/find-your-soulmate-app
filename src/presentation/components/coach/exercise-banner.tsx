import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useUIStore } from '@/src/store/ui-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { getExerciseMode } from '@/src/data/content/exercise-modes';

interface ExerciseBannerProps {
  onEndExercise: () => void;
}

export function ExerciseBanner({ onEndExercise }: ExerciseBannerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeMode = useUIStore((s) => s.activeExerciseMode);
  const locale = useSettingsStore((s) => s.locale);

  if (!activeMode) return null;

  const mode = getExerciseMode(activeMode);

  const handleEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onEndExercise();
  };

  return (
    <View style={[styles.banner, { backgroundColor: `${mode.color}12` }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${mode.color}20` }]}>
        <Ionicons name={mode.icon as any} size={16} color={mode.color} />
      </View>
      <Text style={[styles.text, isDark && styles.textDark]} numberOfLines={1}>
        {mode.name[locale]}
      </Text>
      <Pressable onPress={handleEnd} style={[styles.endButton, { borderColor: mode.color }]}>
        <Text style={[styles.endButtonText, { color: mode.color }]}>
          {locale === 'de' ? 'Beenden' : 'End'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  textDark: {
    color: '#F5F5F5',
  },
  endButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  endButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
