import React from 'react';
import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/src/store/auth-store';
import { useUIStore } from '@/src/store/ui-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { exerciseModes, type ExerciseModeId } from '@/src/data/content/exercise-modes';

export function ExerciseModeSelector() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isPremium = useAuthStore((s) => s.isPremium);
  const activeMode = useUIStore((s) => s.activeExerciseMode);
  const setExerciseMode = useUIStore((s) => s.setExerciseMode);
  const locale = useSettingsStore((s) => s.locale);
  const router = useRouter();

  const handlePress = (modeId: ExerciseModeId, modePremium: boolean) => {
    if (modePremium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeMode === modeId) {
      setExerciseMode(null);
    } else {
      setExerciseMode(modeId);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {exerciseModes.map((mode) => {
        const isActive = activeMode === mode.id;
        const isLocked = mode.isPremium && !isPremium;

        return (
          <Pressable
            key={mode.id}
            onPress={() => handlePress(mode.id, mode.isPremium)}
            style={[
              styles.chip,
              isDark && styles.chipDark,
              isActive && { backgroundColor: mode.color, borderColor: mode.color },
            ]}
          >
            <Ionicons
              name={mode.icon as any}
              size={14}
              color={isActive ? '#fff' : mode.color}
            />
            <Text
              style={[
                styles.chipText,
                isDark && styles.chipTextDark,
                isActive && styles.chipTextActive,
              ]}
              numberOfLines={1}
            >
              {mode.name[locale]}
            </Text>
            {isLocked && (
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={10} color={isActive ? '#fff' : '#A3A3A3'} />
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  chipDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#525252',
  },
  chipTextDark: {
    color: '#D4D4D4',
  },
  chipTextActive: {
    color: '#fff',
  },
  lockIcon: {
    marginLeft: -2,
  },
});
