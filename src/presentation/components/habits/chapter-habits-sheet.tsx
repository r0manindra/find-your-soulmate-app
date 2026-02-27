import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useHabitStore } from '@/src/store/habit-store';
import { getPresetsForChapter } from '@/src/data/content/preset-habits';

interface ChapterHabitsSheetProps {
  chapterId: number;
  locale: 'en' | 'de';
  isDark?: boolean;
}

export function ChapterHabitsSheet({ chapterId, locale, isDark = false }: ChapterHabitsSheetProps) {
  const { addHabitFromPreset, isPresetAlreadyAdded } = useHabitStore();
  const presets = getPresetsForChapter(chapterId);

  if (presets.length === 0) return null;

  const handleAdd = (preset: typeof presets[0]) => {
    if (isPresetAlreadyAdded(preset.id)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addHabitFromPreset(preset.id, preset.emoji, preset.title, preset.chapterId);
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={18} color="#E8435A" />
        <Text style={[styles.title, isDark && { color: '#F5F5F5' }]}>
          {locale === 'de' ? 'Mach daraus eine Gewohnheit' : 'Build This Into a Habit'}
        </Text>
      </View>
      {presets.map((preset) => {
        const added = isPresetAlreadyAdded(preset.id);
        return (
          <Pressable
            key={preset.id}
            onPress={() => handleAdd(preset)}
            style={[styles.row, isDark && { borderTopColor: 'rgba(255,255,255,0.08)' }]}
            disabled={added}
          >
            <Text style={styles.emoji}>{preset.emoji}</Text>
            <Text style={[styles.presetTitle, isDark && { color: '#F5F5F5' }, added && styles.presetTitleAdded]} numberOfLines={1}>
              {preset.title[locale]}
            </Text>
            {added ? (
              <View style={styles.addedBadge}>
                <Ionicons name="checkmark" size={14} color="#E8435A" />
                <Text style={styles.addedText}>
                  {locale === 'de' ? 'Hinzugefügt' : 'Added'}
                </Text>
              </View>
            ) : (
              <View style={styles.addButton}>
                <Ionicons name="add" size={14} color="#fff" />
                <Text style={styles.addButtonText}>
                  {locale === 'de' ? 'Hinzufügen' : 'Add'}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginTop: 12, marginBottom: 24 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14,
  },
  title: {
    fontSize: 16, fontWeight: '700', color: '#171717', letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)',
  },
  emoji: { fontSize: 20 },
  presetTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#171717' },
  presetTitleAdded: { color: '#A3A3A3' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E8435A', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  addButtonText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  addedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(232,67,90,0.08)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  addedText: { fontSize: 12, fontWeight: '700', color: '#E8435A' },
});
