import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable, Modal, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '@/src/store/habit-store';
import { presetHabits } from '@/src/data/content/preset-habits';
import { phases } from '@/src/data/content/chapters';

const EMOJI_GRID = [
  '🔥', '💪', '🧠', '📝', '🏃', '🧘', '💧', '🥗', '😊', '🎯',
  '⭐', '🌟', '💎', '🎵', '📚', '🌅', '🧹', '💤', '🙏', '❤️',
];

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  locale: 'en' | 'de';
}

export function AddHabitModal({ visible, onClose, locale }: AddHabitModalProps) {
  const { addHabitFromPreset, addCustomHabit, isPresetAlreadyAdded } = useHabitStore();
  const [customEmoji, setCustomEmoji] = useState('🔥');
  const [customName, setCustomName] = useState('');

  const handleAddPreset = (preset: typeof presetHabits[0]) => {
    if (isPresetAlreadyAdded(preset.id)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addHabitFromPreset(preset.id, preset.emoji, preset.title, preset.chapterId);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addCustomHabit(customEmoji, customName.trim());
    setCustomName('');
    setCustomEmoji('🔥');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {locale === 'de' ? 'Habit hinzufügen' : 'Add Habit'}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#737373" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Custom habit creation */}
          <Text style={styles.sectionTitle}>
            {locale === 'de' ? 'Eigene erstellen' : 'Create Custom'}
          </Text>
          <View style={styles.customCard}>
            <Text style={styles.emojiPickerLabel}>
              {locale === 'de' ? 'Emoji wählen' : 'Pick an emoji'}
            </Text>
            <View style={styles.emojiGrid}>
              {EMOJI_GRID.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setCustomEmoji(emoji);
                  }}
                  style={[styles.emojiItem, emoji === customEmoji && styles.emojiItemSelected]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.input}
              value={customName}
              onChangeText={setCustomName}
              placeholder={locale === 'de' ? 'Habit-Name' : 'Habit name'}
              placeholderTextColor="#A3A3A3"
              maxLength={50}
            />
            <Pressable
              onPress={handleAddCustom}
              style={[styles.addCustomButton, !customName.trim() && styles.addCustomButtonDisabled]}
              disabled={!customName.trim()}
            >
              <Text style={styles.addCustomButtonText}>
                {locale === 'de' ? 'Hinzufügen' : 'Add'}
              </Text>
            </Pressable>
          </View>

          {/* Suggested presets by phase */}
          <Text style={styles.sectionTitle}>
            {locale === 'de' ? 'Vorgeschlagen' : 'Suggested'}
          </Text>
          {phases.map((phase) => {
            const phasePresets = presetHabits.filter((p) =>
              phase.chapters.includes(p.chapterId)
            );
            if (phasePresets.length === 0) return null;

            return (
              <View key={phase.id} style={styles.phaseGroup}>
                <Text style={styles.phaseTitle}>{phase.title[locale]}</Text>
                {phasePresets.map((preset) => {
                  const added = isPresetAlreadyAdded(preset.id);
                  return (
                    <Pressable
                      key={preset.id}
                      onPress={() => handleAddPreset(preset)}
                      style={styles.presetRow}
                      disabled={added}
                    >
                      <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                      <View style={styles.presetInfo}>
                        <Text style={[styles.presetTitle, added && styles.presetTitleAdded]}>
                          {preset.title[locale]}
                        </Text>
                      </View>
                      {added ? (
                        <Ionicons name="checkmark-circle" size={22} color="#E8435A" />
                      ) : (
                        <Ionicons name="add-circle-outline" size={22} color="#A3A3A3" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: '#171717',
    letterSpacing: -0.3, marginBottom: 12, marginTop: 8,
  },
  customCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    marginBottom: 24,
  },
  emojiPickerLabel: {
    fontSize: 13, fontWeight: '600', color: '#737373', marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14,
  },
  emojiItem: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  emojiItemSelected: {
    backgroundColor: 'rgba(232,67,90,0.12)',
    borderWidth: 2, borderColor: '#E8435A',
  },
  emojiText: { fontSize: 20 },
  input: {
    height: 44, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 12,
    paddingHorizontal: 14, fontSize: 16, color: '#171717',
    marginBottom: 12,
  },
  addCustomButton: {
    backgroundColor: '#E8435A', borderRadius: 14,
    paddingVertical: 12, alignItems: 'center',
  },
  addCustomButtonDisabled: { opacity: 0.4 },
  addCustomButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  phaseGroup: { marginBottom: 20 },
  phaseTitle: {
    fontSize: 13, fontWeight: '700', color: '#A3A3A3',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)',
  },
  presetEmoji: { fontSize: 22 },
  presetInfo: { flex: 1 },
  presetTitle: { fontSize: 15, fontWeight: '600', color: '#171717' },
  presetTitleAdded: { color: '#A3A3A3' },
});
