import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { AddHabitModal } from '@/src/presentation/components/habits/add-habit-modal';
import { HabitCalendar } from '@/src/presentation/components/habits/habit-calendar';
import { WeeklyReview } from '@/src/presentation/components/habits/weekly-review';
import { useHabitStore } from '@/src/store/habit-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { getTopNudge } from '@/src/core/habit-nudges';
import type { Habit } from '@/src/core/entities/habit-types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HabitRow = React.memo(function HabitRow({
  habit,
  locale,
  isCompleted,
  streak,
  onToggle,
  onArchive,
}: {
  habit: { id: string; emoji: string; title: { en: string; de: string } };
  locale: 'en' | 'de';
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onArchive: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onArchive();
  };

  return (
    <AnimatedPressable onPress={handlePress} onLongPress={handleLongPress} style={animatedStyle}>
      <GlassCard style={styles.habitRow}>
        <View style={styles.habitContent}>
          <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
            {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <Text
            style={[styles.habitTitle, isCompleted && styles.habitTitleCompleted]}
            numberOfLines={1}
          >
            {habit.title[locale]}
          </Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>
      </GlassCard>
    </AnimatedPressable>
  );
});

type TimeSlotKey = 'morning' | 'afternoon' | 'evening' | 'anytime';

const TIME_SLOT_CONFIG: { key: TimeSlotKey; icon: string; en: string; de: string }[] = [
  { key: 'morning', icon: 'sunny-outline', en: 'Morning', de: 'Morgens' },
  { key: 'afternoon', icon: 'partly-sunny-outline', en: 'Afternoon', de: 'Nachmittags' },
  { key: 'evening', icon: 'moon-outline', en: 'Evening', de: 'Abends' },
  { key: 'anytime', icon: 'time-outline', en: 'Anytime', de: 'Jederzeit' },
];

function groupByTimeSlot(habits: Habit[]): Record<TimeSlotKey, Habit[]> {
  const groups: Record<TimeSlotKey, Habit[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    anytime: [],
  };

  for (const h of habits) {
    const slot = h.scheduledTime ?? 'anytime';
    const key = slot === null ? 'anytime' : slot;
    groups[key].push(h);
  }

  return groups;
}

export default function HabitsScreen() {
  const locale = useSettingsStore((s) => s.locale);
  const characterId = useSettingsStore((s) => s.selectedCharacterId);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const archiveHabit = useHabitStore((s) => s.archiveHabit);
  const isCompletedToday = useHabitStore((s) => s.isCompletedToday);
  const getStreak = useHabitStore((s) => s.getStreak);
  const setHabitSchedule = useHabitStore((s) => s.setHabitSchedule);

  const [showModal, setShowModal] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const activeHabits = useMemo(
    () => habits.filter((h) => !h.isArchived),
    [habits]
  );

  // Filter habits for the selected date's day-of-week
  const habitsForDate = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    return activeHabits.filter((h) => {
      if (h.scheduledDays && h.scheduledDays.length > 0) {
        return h.scheduledDays.includes(dayOfWeek);
      }
      return true;
    });
  }, [activeHabits, selectedDate]);

  const isToday = useMemo(() => {
    const now = new Date();
    return (
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate()
    );
  }, [selectedDate]);

  const dateStr = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);

  const todayStats = useMemo(() => {
    const completedIds = new Set(
      completions.filter((c) => c.date === dateStr).map((c) => c.habitId)
    );
    const total = habitsForDate.length;
    const done = habitsForDate.filter((h) => completedIds.has(h.id)).length;
    return { done, total, allDone: total > 0 && done === total };
  }, [habitsForDate, completions, dateStr]);

  const timeGroups = useMemo(() => groupByTimeSlot(habitsForDate), [habitsForDate]);

  const nudge = useMemo(() => {
    if (nudgeDismissed || activeHabits.length === 0 || !isToday) return null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const contexts = activeHabits.map((h) => {
      const streak = getStreak(h.id);
      return {
        habit: h,
        streak,
        missedYesterday:
          streak.current === 0 &&
          !completions.some((c) => c.habitId === h.id && c.date === yesterday),
        completedToday: isCompletedToday(h.id),
      };
    });
    return getTopNudge(contexts, characterId);
  }, [activeHabits, completions, characterId, nudgeDismissed, getStreak, isCompletedToday, isToday]);

  const handleToggle = useCallback(
    (habitId: string) => toggleCompletion(habitId, dateStr),
    [toggleCompletion, dateStr]
  );

  const handleArchive = useCallback(
    (habitId: string) => {
      Alert.alert(
        locale === 'de' ? 'Optionen' : 'Options',
        '',
        [
          { text: locale === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
          {
            text: locale === 'de' ? 'Archivieren' : 'Archive',
            style: 'destructive',
            onPress: () => archiveHabit(habitId),
          },
        ]
      );
    },
    [locale, archiveHabit, setHabitSchedule]
  );

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  if (activeHabits.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={[styles.emptyTitle, isDark && styles.textDark]}>
            {locale === 'de' ? 'Noch keine Habits' : 'No habits yet'}
          </Text>
          <Text style={[styles.emptySubtitle, isDark && styles.textMutedDark]}>
            {locale === 'de'
              ? 'Beginne tägliche Gewohnheiten aus den Kapiteln aufzubauen'
              : 'Start building daily habits from the chapters you learn'}
          </Text>
          <BrandButton
            title={locale === 'de' ? 'Ersten Habit hinzufügen' : 'Add Your First Habit'}
            onPress={openModal}
            style={styles.emptyButton}
          />
        </View>
        <AddHabitModal visible={showModal} onClose={closeModal} locale={locale} />
      </SafeAreaView>
    );
  }

  const isCompletedOnDate = (habitId: string) => {
    return completions.some((c) => c.habitId === habitId && c.date === dateStr);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenTitle, isDark && styles.textDark]}>
          Habits
        </Text>

        {/* Weekly Calendar */}
        <HabitCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          locale={locale}
          isDark={isDark}
        />

        {/* Progress */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressLabel}>
                {isToday
                  ? (locale === 'de' ? 'Heute' : 'Today')
                  : selectedDate.toLocaleDateString(locale === 'de' ? 'de-AT' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
              <Text style={[styles.progressValue, isDark && styles.textDark]}>
                {todayStats.allDone
                  ? locale === 'de' ? 'Alles erledigt!' : 'All done!'
                  : `${todayStats.done} / ${todayStats.total}`}
              </Text>
            </View>
            <View style={styles.progressDots}>
              {habitsForDate.map((h) => (
                <View
                  key={h.id}
                  style={[
                    styles.progressDot,
                    isCompletedOnDate(h.id) && styles.progressDotDone,
                  ]}
                />
              ))}
            </View>
          </View>
        </GlassCard>

        {/* Coach Nudge */}
        {nudge && (
          <GlassCard style={styles.nudgeCard}>
            <View style={styles.nudgeRow}>
              <Text style={[styles.nudgeText, isDark && styles.textSecondaryDark]}>
                {nudge[locale]}
              </Text>
              <Pressable
                onPress={() => setNudgeDismissed(true)}
                style={styles.nudgeDismiss}
              >
                <Ionicons name="close" size={16} color="#A3A3A3" />
              </Pressable>
            </View>
          </GlassCard>
        )}

        {/* Habits grouped by time slot */}
        {TIME_SLOT_CONFIG.map((slot) => {
          const group = timeGroups[slot.key];
          if (group.length === 0) return null;

          return (
            <View key={slot.key} style={styles.timeSlotSection}>
              <View style={styles.timeSlotHeader}>
                <Ionicons name={slot.icon as any} size={16} color="#A3A3A3" />
                <Text style={[styles.timeSlotTitle, isDark && styles.textMutedDark]}>
                  {slot[locale]}
                </Text>
              </View>
              <View style={styles.habitsList}>
                {group.map((habit) => {
                  const completed = isCompletedOnDate(habit.id);
                  const { current } = getStreak(habit.id);
                  return (
                    <HabitRow
                      key={habit.id}
                      habit={habit}
                      locale={locale}
                      isCompleted={completed}
                      streak={current}
                      onToggle={() => handleToggle(habit.id)}
                      onArchive={() => handleArchive(habit.id)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Add Habit Button */}
        <BrandButton
          title={locale === 'de' ? 'Habit hinzufügen' : 'Add Habit'}
          variant="secondary"
          onPress={openModal}
        />

        {/* Weekly Review */}
        <WeeklyReview locale={locale} />
      </ScrollView>

      <AddHabitModal visible={showModal} onClose={closeModal} locale={locale} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  screenTitle: {
    fontSize: 34, fontWeight: '700', color: '#171717',
    letterSpacing: -0.5, marginTop: 8, marginBottom: 20,
  },
  textDark: { color: '#F5F5F5' },
  textMutedDark: { color: '#A3A3A3' },
  textSecondaryDark: { color: '#D4D4D4' },

  // Progress card
  progressCard: { marginBottom: 16 },
  progressRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  progressLabel: { fontSize: 13, fontWeight: '600', color: '#737373', marginBottom: 2 },
  progressValue: { fontSize: 22, fontWeight: '700', color: '#171717', letterSpacing: -0.3 },
  progressDots: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', maxWidth: 150, justifyContent: 'flex-end' },
  progressDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E5E5',
  },
  progressDotDone: { backgroundColor: '#E8435A' },

  // Nudge
  nudgeCard: { marginBottom: 16 },
  nudgeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  nudgeText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#525252' },
  nudgeDismiss: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Time slot sections
  timeSlotSection: { marginBottom: 8 },
  timeSlotHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8,
  },
  timeSlotTitle: {
    fontSize: 13, fontWeight: '700', color: '#A3A3A3',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Habits list
  habitsList: { gap: 8, marginBottom: 8 },
  habitRow: { marginBottom: 0 },
  habitContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#D4D4D4',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E8435A', borderColor: '#E8435A',
  },
  habitEmoji: { fontSize: 20 },
  habitTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#171717' },
  habitTitleCompleted: { color: '#A3A3A3', textDecorationLine: 'line-through' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  streakIcon: { fontSize: 14 },
  streakText: { fontSize: 13, fontWeight: '700', color: '#FF7854' },

  // Empty state
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22, fontWeight: '700', color: '#171717',
    letterSpacing: -0.3, marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15, color: '#737373', textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  emptyButton: { width: '100%' },
});
