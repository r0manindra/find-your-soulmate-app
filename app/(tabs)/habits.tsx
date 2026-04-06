import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { AddHabitModal } from '@/src/presentation/components/habits/add-habit-modal';
import { HabitCalendar } from '@/src/presentation/components/habits/habit-calendar';
import { useHabitStore } from '@/src/store/habit-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useAuthStore } from '@/src/store/auth-store';
import { createHabitEvent } from '@/src/services/calendar';
import type { Habit } from '@/src/core/entities/habit-types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HabitRow = React.memo(function HabitRow({
  habit,
  locale,
  isCompleted,
  streak,
  specificTime,
  onToggle,
  onArchive,
  onAddToCalendar,
  isDark,
}: {
  habit: { id: string; emoji: string; title: { en: string; de: string } };
  locale: 'en' | 'de';
  isCompleted: boolean;
  streak: number;
  specificTime?: string;
  onToggle: () => void;
  onArchive: () => void;
  onAddToCalendar: () => void;
  isDark: boolean;
}) {
  const scale = useSharedValue(1);
  const swipeableRef = useRef<Swipeable>(null);
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

  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <Pressable
        onPress={() => {
          swipeableRef.current?.close();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onAddToCalendar();
        }}
        style={[styles.swipeAction, styles.calendarAction]}
      >
        <Ionicons name="calendar-outline" size={18} color="#fff" />
      </Pressable>
      <Pressable
        onPress={() => {
          swipeableRef.current?.close();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onArchive();
        }}
        style={[styles.swipeAction, styles.archiveAction]}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.swipeContainer}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
      >
        <AnimatedPressable onPress={handlePress} style={animatedStyle}>
          <GlassCard style={styles.habitRow}>
            <View style={styles.habitContent}>
              <View style={[styles.checkbox, isDark && styles.checkboxDark, isCompleted && styles.checkboxChecked]}>
                {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <Text
                style={[styles.habitTitle, isDark && styles.habitTitleDark, isCompleted && styles.habitTitleCompleted]}
                numberOfLines={1}
              >
                {habit.title[locale]}
              </Text>
              {specificTime && (
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>
                    {(() => {
                      const [h, m] = specificTime.split(':').map(Number);
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const h12 = h % 12 || 12;
                      return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                    })()}
                  </Text>
                </View>
              )}
              {streak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakIcon}>🔥</Text>
                  <Text style={styles.streakText}>{streak}</Text>
                </View>
              )}
            </View>
          </GlassCard>
        </AnimatedPressable>
      </Swipeable>
    </View>
  );
});

const TIME_SLOT_ORDER = ['morning', 'afternoon', 'evening', 'anytime'] as const;

function sortByTimeSlot(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    const aIdx = TIME_SLOT_ORDER.indexOf((a.scheduledTime ?? 'anytime') as any);
    const bIdx = TIME_SLOT_ORDER.indexOf((b.scheduledTime ?? 'anytime') as any);
    return aIdx - bIdx;
  });
}

const FREE_HABIT_LIMIT = 5;

export default function HabitsScreen() {
  const { t } = useTranslation();
  const locale = useSettingsStore((s) => s.locale);
  const isPremium = useAuthStore((s) => s.isPremium);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const archiveHabit = useHabitStore((s) => s.archiveHabit);
  const getStreak = useHabitStore((s) => s.getStreak);

  const [showModal, setShowModal] = useState(false);
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

  const sortedHabits = useMemo(() => sortByTimeSlot(habitsForDate), [habitsForDate]);

  const handleToggle = useCallback(
    (habitId: string) => toggleCompletion(habitId, dateStr),
    [toggleCompletion, dateStr]
  );

  const handleArchiveHabit = useCallback(
    (habitId: string) => {
      archiveHabit(habitId);
    },
    [archiveHabit]
  );

  const handleAddToCalendar = useCallback(
    async (habitId: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;
      let startHour = 9;
      if (habit.specificTime) {
        const [h] = habit.specificTime.split(':').map(Number);
        startHour = h;
      } else if (habit.scheduledTime === 'morning') {
        startHour = 8;
      } else if (habit.scheduledTime === 'afternoon') {
        startHour = 14;
      } else if (habit.scheduledTime === 'evening') {
        startHour = 19;
      }
      const startMinute = habit.specificTime
        ? parseInt(habit.specificTime.split(':')[1], 10)
        : 0;
      const success = await createHabitEvent({
        title: `${habit.emoji} ${habit.title[locale]}`,
        startHour,
        startMinute,
        scheduledDays: habit.scheduledDays,
        locale,
      });
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [habits, locale]
  );

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  if (activeHabits.length === 0) {
    return (
      <View style={[styles.safeArea, isDark && styles.safeAreaDark, { paddingTop: insets.top }]}>
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
        <AddHabitModal visible={showModal} onClose={closeModal} locale={locale} isDark={isDark} />
      </View>
    );
  }

  const isCompletedOnDate = (habitId: string) => {
    return completions.some((c) => c.habitId === habitId && c.date === dateStr);
  };

  return (
    <View style={[styles.safeArea, isDark && styles.safeAreaDark, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenTitle, isDark && styles.textDark]}>
          {t('habits.title')}
        </Text>

        {/* Weekly Calendar */}
        <HabitCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          locale={locale}
          isDark={isDark}
        />

        {/* Progress — simple count */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, isDark && styles.progressLabelDark]}>
              {isToday
                ? (locale === 'de' ? 'Heute' : 'Today')
                : selectedDate.toLocaleDateString(locale === 'de' ? 'de-AT' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <Text style={[styles.progressValue, isDark && styles.textDark]}>
              {todayStats.allDone
                ? locale === 'de' ? 'Alles erledigt!' : 'All done!'
                : `${todayStats.done}/${todayStats.total}`}
            </Text>
          </View>
        </GlassCard>

        {/* Flat habit list sorted by time */}
        <View style={styles.habitsList}>
          {sortedHabits.map((habit) => {
            const completed = isCompletedOnDate(habit.id);
            const { current } = getStreak(habit.id);
            return (
              <HabitRow
                key={habit.id}
                habit={habit}
                locale={locale}
                isCompleted={completed}
                streak={current}
                specificTime={habit.specificTime}
                onToggle={() => handleToggle(habit.id)}
                onArchive={() => handleArchiveHabit(habit.id)}
                onAddToCalendar={() => handleAddToCalendar(habit.id)}
                isDark={isDark}
              />
            );
          })}
        </View>

        {/* Add Habit Button */}
        {!isPremium && activeHabits.length >= FREE_HABIT_LIMIT ? (
          <GlassCard style={styles.limitCard}>
            <Ionicons name="lock-closed" size={20} color="#E8435A" style={{ marginBottom: 6 }} />
            <Text style={[styles.limitText, isDark && styles.textMutedDark]}>
              {locale === 'de'
                ? 'Du hast 5 von 5 Habits erreicht'
                : "You've reached 5 of 5 habits"}
            </Text>
            <BrandButton
              title={locale === 'de' ? 'Upgrade für mehr Habits' : 'Upgrade for More Habits'}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/paywall?trigger=habits' as any);
              }}
              style={{ marginTop: 10, width: '100%' }}
            />
          </GlassCard>
        ) : (
          <BrandButton
            title={locale === 'de' ? 'Habit hinzufügen' : 'Add Habit'}
            variant="secondary"
            onPress={openModal}
          />
        )}

      </ScrollView>

      <AddHabitModal visible={showModal} onClose={closeModal} locale={locale} isDark={isDark} />
    </View>
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
  progressLabel: { fontSize: 13, fontWeight: '600', color: '#737373' },
  progressLabelDark: { color: '#A3A3A3' },
  progressValue: { fontSize: 20, fontWeight: '700', color: '#171717', letterSpacing: -0.3 },

  // Habits list
  habitsList: { gap: 8, marginBottom: 8 },
  swipeContainer: { borderRadius: 20, overflow: 'hidden' },
  swipeActions: { flexDirection: 'row', alignItems: 'stretch' },
  swipeAction: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarAction: { backgroundColor: '#0EA5E9' },
  archiveAction: { backgroundColor: '#EF4444' },
  habitRow: { marginBottom: 0 },
  habitContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#D4D4D4',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxDark: { borderColor: '#525252' },
  checkboxChecked: {
    backgroundColor: '#E8435A', borderColor: '#E8435A',
  },
  habitEmoji: { fontSize: 20 },
  habitTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#171717' },
  habitTitleDark: { color: '#F5F5F5' },
  habitTitleCompleted: { color: '#A3A3A3', textDecorationLine: 'line-through' },
  timeBadge: {
    backgroundColor: 'rgba(232,67,90,0.08)', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  timeBadgeText: { fontSize: 11, fontWeight: '600', color: '#E8435A' },
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

  // Habit limit
  limitCard: { marginBottom: 16, alignItems: 'center', paddingVertical: 20 },
  limitText: {
    fontSize: 15, fontWeight: '600', color: '#737373', textAlign: 'center', lineHeight: 20,
  },
});
