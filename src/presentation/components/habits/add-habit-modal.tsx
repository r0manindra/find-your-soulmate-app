import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable, Modal, Platform, Linking, Alert, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '@/src/store/habit-store';
import { presetHabits } from '@/src/data/content/preset-habits';
import { phases } from '@/src/data/content/chapters';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import type { HabitTimeSlot } from '@/src/core/entities/habit-types';

const EMOJI_GRID = [
  '\u{1F525}', '\u{1F4AA}', '\u{1F9E0}', '\u{1F4DD}', '\u{1F3C3}', '\u{1F9D8}', '\u{1F4A7}', '\u{1F957}', '\u{1F60A}', '\u{1F3AF}',
  '\u{2B50}', '\u{1F31F}', '\u{1F48E}', '\u{1F3B5}', '\u{1F4DA}', '\u{1F305}', '\u{1F9F9}', '\u{1F4A4}', '\u{1F64F}', '\u{2764}\u{FE0F}',
];

const TIME_OPTIONS: { key: HabitTimeSlot; icon: string; en: string; de: string }[] = [
  { key: 'morning', icon: 'sunny-outline', en: 'Morning', de: 'Morgens' },
  { key: 'afternoon', icon: 'partly-sunny-outline', en: 'Afternoon', de: 'Nachmittags' },
  { key: 'evening', icon: 'moon-outline', en: 'Evening', de: 'Abends' },
];

const DAY_LABELS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS_DE = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  locale: 'en' | 'de';
  isDark?: boolean;
}

export function AddHabitModal({ visible, onClose, locale, isDark = false }: AddHabitModalProps) {
  const { addHabitFromPreset, addCustomHabit, isPresetAlreadyAdded, setHabitSchedule } = useHabitStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [customEmoji, setCustomEmoji] = useState('\u{1F525}');
  const [customName, setCustomName] = useState('');
  const [selectedTime, setSelectedTime] = useState<HabitTimeSlot>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>(ALL_DAYS);
  const [selectedPreset, setSelectedPreset] = useState<typeof presetHabits[0] | null>(null);
  const [specificHour, setSpecificHour] = useState<number | null>(null);
  const [specificMinute, setSpecificMinute] = useState(0);

  const dayLabels = locale === 'de' ? DAY_LABELS_DE : DAY_LABELS_EN;

  const toggleDay = (day: number) => {
    Haptics.selectionAsync();
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length <= 1) return prev;
        return prev.filter((d) => d !== day);
      }
      return [...prev, day].sort();
    });
  };

  const handleSelectPreset = (preset: typeof presetHabits[0]) => {
    if (isPresetAlreadyAdded(preset.id)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPreset(preset);
    setSelectedTime(null);
    setSelectedDays(ALL_DAYS);
    setSpecificHour(null);
    setSpecificMinute(0);
    setStep(2);
  };

  const handleCustomNext = () => {
    if (!customName.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPreset(null);
    setSelectedTime(null);
    setSelectedDays(ALL_DAYS);
    setSpecificHour(null);
    setSpecificMinute(0);
    setStep(2);
  };

  const formatTimeDisplay = (h: number, m: number): string => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatTime24 = (h: number, m: number): string => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const adjustHour = (delta: number) => {
    Haptics.selectionAsync();
    if (specificHour === null) {
      setSpecificHour(9);
      return;
    }
    setSpecificHour((h) => {
      const next = ((h ?? 9) + delta + 24) % 24;
      return next;
    });
  };

  const adjustMinute = (delta: number) => {
    Haptics.selectionAsync();
    setSpecificMinute((m) => {
      const next = (m + delta + 60) % 60;
      return next;
    });
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (selectedPreset) {
      addHabitFromPreset(selectedPreset.id, selectedPreset.emoji, selectedPreset.title, selectedPreset.chapterId);
    } else {
      addCustomHabit(customEmoji, customName.trim());
    }

    const habits = useHabitStore.getState().habits;
    const newHabit = habits[habits.length - 1];
    if (newHabit) {
      const days = selectedDays.length === 7 ? [] : selectedDays;
      const timeStr = specificHour !== null ? formatTime24(specificHour, specificMinute) : undefined;
      setHabitSchedule(newHabit.id, selectedTime, days, timeStr);
    }

    resetState();
    onClose();
  };

  const handleAddToCalendar = () => {
    const title = selectedPreset ? selectedPreset.title[locale] : customName;
    const emoji = selectedPreset ? selectedPreset.emoji : customEmoji;
    const eventTitle = `${emoji} ${title}`;

    let startHour = 9;
    let startMinute = 0;
    if (specificHour !== null) {
      startHour = specificHour;
      startMinute = specificMinute;
    } else if (selectedTime === 'morning') {
      startHour = 8;
    } else if (selectedTime === 'afternoon') {
      startHour = 14;
    } else if (selectedTime === 'evening') {
      startHour = 19;
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    if (Platform.OS === 'ios') {
      const timestamp = start.getTime() / 1000;
      Linking.openURL(`calshow:${timestamp}`).catch(() => {
        Alert.alert(
          locale === 'de' ? 'Kalender' : 'Calendar',
          locale === 'de' ? 'Kalender-App konnte nicht geoffnet werden' : 'Could not open Calendar app'
        );
      });
    } else {
      const intentUrl = `content://com.android.calendar/events?title=${encodeURIComponent(eventTitle)}&beginTime=${start.getTime()}&endTime=${end.getTime()}`;
      Linking.openURL(intentUrl).catch(() => {
        Alert.alert(
          locale === 'de' ? 'Kalender' : 'Calendar',
          locale === 'de' ? 'Kalender-App konnte nicht geoffnet werden' : 'Could not open Calendar app'
        );
      });
    }
  };

  const handleBack = () => {
    setSelectedPreset(null);
    setSelectedTime(null);
    setSelectedDays(ALL_DAYS);
    setSpecificHour(null);
    setSpecificMinute(0);
    setStep(1);
  };

  const resetState = () => {
    setStep(1);
    setSelectedPreset(null);
    setCustomName('');
    setCustomEmoji('\u{1F525}');
    setSelectedTime(null);
    setSelectedDays(ALL_DAYS);
    setSpecificHour(null);
    setSpecificMinute(0);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const bg = isDark ? '#171717' : '#FAFAFA';
  const textPrimary = isDark ? '#F5F5F5' : '#171717';
  const textSecondary = isDark ? '#A3A3A3' : '#737373';
  const surfaceBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const cardBg = isDark ? '#252525' : '#fff';

  const previewEmoji = selectedPreset ? selectedPreset.emoji : customEmoji;
  const previewTitle = selectedPreset ? selectedPreset.title[locale] : customName;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textPrimary }]}>
            {step === 2
              ? (locale === 'de' ? 'Zeitplan wählen' : 'Set Schedule')
              : (locale === 'de' ? 'Habit hinzufügen' : 'Add Habit')}
          </Text>
          <Pressable onPress={handleClose} style={[styles.closeButton, isDark && styles.closeButtonDark]}>
            <Ionicons name="close" size={24} color={textSecondary} />
          </Pressable>
        </View>

        {step === 2 ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Preview */}
            <GlassCard style={styles.previewCard} padding={18}>
              <View style={styles.previewRow}>
                <Text style={styles.previewEmoji}>{previewEmoji}</Text>
                <Text style={[styles.previewTitle, { color: textPrimary }]}>
                  {previewTitle}
                </Text>
              </View>
            </GlassCard>

            {/* Time of day */}
            <Text style={[styles.scheduleLabel, { color: textSecondary }]}>
              {locale === 'de' ? 'Tageszeit' : 'Time of day'}
            </Text>
            <View style={styles.timeRow}>
              {TIME_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedTime((prev) => (prev === opt.key ? null : opt.key));
                  }}
                  style={[
                    styles.timeButton,
                    { backgroundColor: surfaceBg },
                    selectedTime === opt.key && styles.timeButtonActive,
                  ]}
                >
                  <Ionicons
                    name={opt.icon as any}
                    size={16}
                    color={selectedTime === opt.key ? '#E8435A' : '#A3A3A3'}
                  />
                  <Text style={[
                    styles.timeButtonText,
                    selectedTime === opt.key && styles.timeButtonTextActive,
                  ]}>
                    {opt[locale]}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Specific time */}
            <Text style={[styles.scheduleLabel, { color: textSecondary }]}>
              {locale === 'de' ? 'Genaue Uhrzeit (optional)' : 'Specific time (optional)'}
            </Text>
            {specificHour === null ? (
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  setSpecificHour(9);
                  setSpecificMinute(0);
                }}
                style={[styles.specificTimeButton, { backgroundColor: surfaceBg }]}
              >
                <Ionicons name="time-outline" size={18} color="#A3A3A3" />
                <Text style={styles.specificTimeText}>
                  {locale === 'de' ? 'Uhrzeit festlegen' : 'Set a time'}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.timePickerContainer, { backgroundColor: surfaceBg }]}>
                <View style={styles.timePickerRow}>
                  {/* Hour */}
                  <View style={styles.timePickerColumn}>
                    <Pressable onPress={() => adjustHour(1)} style={styles.timePickerArrow}>
                      <Ionicons name="chevron-up" size={22} color="#A3A3A3" />
                    </Pressable>
                    <Text style={[styles.timePickerValue, { color: textPrimary }]}>
                      {specificHour.toString().padStart(2, '0')}
                    </Text>
                    <Pressable onPress={() => adjustHour(-1)} style={styles.timePickerArrow}>
                      <Ionicons name="chevron-down" size={22} color="#A3A3A3" />
                    </Pressable>
                  </View>
                  <Text style={[styles.timePickerSeparator, { color: textPrimary }]}>:</Text>
                  {/* Minute */}
                  <View style={styles.timePickerColumn}>
                    <Pressable onPress={() => adjustMinute(5)} style={styles.timePickerArrow}>
                      <Ionicons name="chevron-up" size={22} color="#A3A3A3" />
                    </Pressable>
                    <Text style={[styles.timePickerValue, { color: textPrimary }]}>
                      {specificMinute.toString().padStart(2, '0')}
                    </Text>
                    <Pressable onPress={() => adjustMinute(-5)} style={styles.timePickerArrow}>
                      <Ionicons name="chevron-down" size={22} color="#A3A3A3" />
                    </Pressable>
                  </View>
                  {/* Display */}
                  <Text style={styles.timePickerDisplay}>
                    {formatTimeDisplay(specificHour, specificMinute)}
                  </Text>
                  {/* Clear */}
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSpecificHour(null);
                      setSpecificMinute(0);
                    }}
                    style={styles.timePickerClear}
                  >
                    <Ionicons name="close-circle" size={20} color="#A3A3A3" />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Days */}
            <Text style={[styles.scheduleLabel, { color: textSecondary, marginTop: 14 }]}>
              {locale === 'de' ? 'Wochentage' : 'Days'}
            </Text>
            <View style={styles.daysRow}>
              {ALL_DAYS.map((day) => (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.dayToggle,
                    { backgroundColor: surfaceBg },
                    selectedDays.includes(day) && styles.dayToggleActive,
                  ]}
                >
                  <Text style={[
                    styles.dayToggleText,
                    selectedDays.includes(day) && styles.dayToggleTextActive,
                  ]}>
                    {dayLabels[day]}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Add to Calendar */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleAddToCalendar();
              }}
              style={[styles.calendarButton, { backgroundColor: surfaceBg }]}
            >
              <Ionicons name="calendar-outline" size={18} color="#E8435A" />
              <Text style={styles.calendarButtonText}>
                {locale === 'de' ? 'Zum Kalender hinzufügen' : 'Add to Calendar'}
              </Text>
            </Pressable>

            {/* Action buttons - equal size */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleBack}
                style={[styles.actionButton, { backgroundColor: surfaceBg }]}
              >
                <Ionicons name="chevron-back" size={18} color={textPrimary} />
                <Text style={[styles.actionButtonText, { color: textPrimary }]}>
                  {locale === 'de' ? 'Zurück' : 'Back'}
                </Text>
              </Pressable>
              <Pressable onPress={handleConfirm} style={[styles.actionButton, styles.actionButtonPrimary]}>
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={styles.actionButtonPrimaryText}>
                  {locale === 'de' ? 'Hinzufügen' : 'Add Habit'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Custom habit creation */}
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {locale === 'de' ? 'Eigene erstellen' : 'Create Custom'}
            </Text>
            <GlassCard style={styles.customCard} padding={18}>
              <Text style={[styles.emojiPickerLabel, { color: textSecondary }]}>
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
                    style={[
                      styles.emojiItem,
                      { backgroundColor: surfaceBg },
                      emoji === customEmoji && styles.emojiItemSelected,
                    ]}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: surfaceBg, color: textPrimary }]}
                value={customName}
                onChangeText={setCustomName}
                placeholder={locale === 'de' ? 'Habit-Name' : 'Habit name'}
                placeholderTextColor="#A3A3A3"
                maxLength={50}
              />
              <Pressable
                onPress={handleCustomNext}
                style={[styles.nextButton, !customName.trim() && styles.nextButtonDisabled]}
                disabled={!customName.trim()}
              >
                <Text style={styles.nextButtonText}>
                  {locale === 'de' ? 'Weiter' : 'Next'}
                </Text>
              </Pressable>
            </GlassCard>

            {/* Suggested presets */}
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
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
                        onPress={() => handleSelectPreset(preset)}
                        style={[
                          styles.presetRow,
                          { backgroundColor: cardBg, borderColor: borderCol },
                        ]}
                        disabled={added}
                      >
                        <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                        <View style={styles.presetInfo}>
                          <Text style={[styles.presetTitle, { color: textPrimary }, added && styles.presetTitleAdded]}>
                            {preset.title[locale]}
                          </Text>
                        </View>
                        {added ? (
                          <Ionicons name="checkmark-circle" size={22} color="#E8435A" />
                        ) : (
                          <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 20, fontWeight: '700',
    letterSpacing: -0.3, marginBottom: 12, marginTop: 8,
  },
  customCard: {
    marginBottom: 24,
  },
  emojiPickerLabel: {
    fontSize: 13, fontWeight: '600', marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14,
  },
  emojiItem: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  emojiItemSelected: {
    backgroundColor: 'rgba(232,67,90,0.12)',
    borderWidth: 2, borderColor: '#E8435A',
  },
  emojiText: { fontSize: 20 },
  input: {
    height: 44, borderRadius: 12,
    paddingHorizontal: 14, fontSize: 16,
    marginBottom: 14,
  },

  // Schedule
  scheduleLabel: {
    fontSize: 13, fontWeight: '600', marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row', gap: 8, marginBottom: 14,
  },
  timeButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 10, borderRadius: 12,
  },
  timeButtonActive: {
    backgroundColor: 'rgba(232,67,90,0.1)',
    borderWidth: 1.5, borderColor: '#E8435A',
  },
  timeButtonText: {
    fontSize: 12, fontWeight: '600', color: '#A3A3A3',
  },
  timeButtonTextActive: {
    color: '#E8435A',
  },

  // Specific time
  specificTimeButton: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12,
    marginBottom: 0,
  },
  specificTimeText: {
    flex: 1, fontSize: 15, fontWeight: '500', color: '#A3A3A3',
  },
  timePickerContainer: {
    borderRadius: 14, padding: 14, marginBottom: 0,
  },
  timePickerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  timePickerColumn: {
    alignItems: 'center',
  },
  timePickerArrow: {
    padding: 4,
  },
  timePickerValue: {
    fontSize: 28, fontWeight: '700', width: 50, textAlign: 'center',
  },
  timePickerSeparator: {
    fontSize: 28, fontWeight: '700', marginBottom: 2,
  },
  timePickerDisplay: {
    fontSize: 14, fontWeight: '600', color: '#E8435A', marginLeft: 12,
  },
  timePickerClear: {
    marginLeft: 8, padding: 4,
  },

  // Days
  daysRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16,
  },
  dayToggle: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  dayToggleActive: {
    backgroundColor: '#E8435A',
  },
  dayToggleText: {
    fontSize: 13, fontWeight: '700', color: '#A3A3A3',
  },
  dayToggleTextActive: {
    color: '#fff',
  },

  // Calendar button
  calendarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14, marginBottom: 16,
  },
  calendarButtonText: {
    fontSize: 15, fontWeight: '600', color: '#E8435A',
  },

  // Action buttons (equal size)
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: 14, paddingVertical: 14,
  },
  actionButtonText: { fontSize: 16, fontWeight: '600' },
  actionButtonPrimary: {
    backgroundColor: '#E8435A',
  },
  actionButtonPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Step 1 next button
  nextButton: {
    backgroundColor: '#E8435A', borderRadius: 14,
    paddingVertical: 12, alignItems: 'center',
  },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Preview
  previewCard: { marginBottom: 20 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  previewEmoji: { fontSize: 28 },
  previewTitle: { fontSize: 18, fontWeight: '700', flex: 1 },

  // Presets
  phaseGroup: { marginBottom: 20 },
  phaseTitle: {
    fontSize: 13, fontWeight: '700', color: '#A3A3A3',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 14,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  presetEmoji: { fontSize: 22 },
  presetInfo: { flex: 1 },
  presetTitle: { fontSize: 15, fontWeight: '600' },
  presetTitleAdded: { color: '#A3A3A3' },
});
