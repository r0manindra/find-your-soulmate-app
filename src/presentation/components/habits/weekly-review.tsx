import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { ProgressRing } from '@/src/presentation/components/ui/progress-ring';
import { useHabitStore } from '@/src/store/habit-store';
import type { Habit } from '@/src/core/entities/habit-types';

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

interface WeeklyReviewProps {
  locale: 'en' | 'de';
}

export function WeeklyReview({ locale }: WeeklyReviewProps) {
  const { completions, getActiveHabits, getWeeklyCompletionRate } = useHabitStore();
  const activeHabits = getActiveHabits();
  const rate = getWeeklyCompletionRate();

  const weekDays = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today.getTime() - mondayOffset * 86400000);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday.getTime() + i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const completed = activeHabits.filter((h) =>
        completions.some((c) => c.habitId === h.id && c.date === dateStr)
      ).length;
      const isFuture = d > today;
      const isToday = dateStr === today.toISOString().split('T')[0];
      return { dateStr, completed, total: activeHabits.length, isFuture, isToday };
    });
  }, [completions, activeHabits]);

  const weekdayLabels = locale === 'de'
    ? ['M', 'D', 'M', 'D', 'F', 'S', 'S']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Per-habit breakdown
  const habitBreakdown = useMemo(() => {
    return activeHabits.map((h) => {
      const count = weekDays.filter((d) =>
        !d.isFuture && completions.some((c) => c.habitId === h.id && c.date === d.dateStr)
      ).length;
      const totalDays = weekDays.filter((d) => !d.isFuture).length;
      return { habit: h, count, totalDays };
    });
  }, [activeHabits, weekDays, completions]);

  if (activeHabits.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {locale === 'de' ? 'Diese Woche' : 'This Week'}
      </Text>

      <GlassCard style={styles.card}>
        <View style={styles.topRow}>
          <ProgressRing
            progress={rate}
            size={80}
            strokeWidth={6}
            label={locale === 'de' ? 'Erledigt' : 'Done'}
          />
          <View style={styles.dotGrid}>
            {weekDays.map((day, i) => (
              <View key={i} style={styles.dayColumn}>
                <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
                  {weekdayLabels[i]}
                </Text>
                <View
                  style={[
                    styles.dot,
                    day.isFuture && styles.dotFuture,
                    !day.isFuture && day.completed === day.total && day.total > 0 && styles.dotFull,
                    !day.isFuture && day.completed > 0 && day.completed < day.total && styles.dotPartial,
                    day.isToday && styles.dotToday,
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Per-habit breakdown */}
        {habitBreakdown.length > 0 && (
          <View style={styles.breakdown}>
            {habitBreakdown.map(({ habit, count, totalDays }) => (
              <View key={habit.id} style={styles.breakdownRow}>
                <Text style={styles.breakdownEmoji}>{habit.emoji}</Text>
                <Text style={styles.breakdownName} numberOfLines={1}>
                  {habit.title[locale]}
                </Text>
                <Text style={styles.breakdownCount}>{count}/{totalDays}</Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: '#171717',
    letterSpacing: -0.3, marginBottom: 12,
  },
  card: { marginBottom: 16 },
  topRow: {
    flexDirection: 'row', alignItems: 'center', gap: 20,
  },
  dotGrid: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  dayColumn: { alignItems: 'center', gap: 6 },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#A3A3A3' },
  dayLabelToday: { color: '#E8435A' },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },
  dotFuture: { backgroundColor: '#F5F5F5' },
  dotFull: { backgroundColor: '#E8435A' },
  dotPartial: { backgroundColor: '#FFB4B4' },
  dotToday: { borderWidth: 2, borderColor: '#E8435A' },
  breakdown: { marginTop: 16, gap: 8 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownEmoji: { fontSize: 16 },
  breakdownName: { flex: 1, fontSize: 14, color: '#525252' },
  breakdownCount: { fontSize: 14, fontWeight: '600', color: '#171717' },
});
