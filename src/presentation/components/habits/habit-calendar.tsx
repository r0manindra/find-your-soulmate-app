import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '@/src/store/habit-store';

interface HabitCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  locale: 'en' | 'de';
  isDark?: boolean;
}

const DAY_LABELS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS_DE = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekDays(reference: Date): Date[] {
  const day = reference.getDay();
  const monday = new Date(reference);
  monday.setDate(reference.getDate() - ((day === 0 ? 7 : day) - 1));
  monday.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function HabitCalendar({ selectedDate, onSelectDate, locale, isDark = false }: HabitCalendarProps) {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const dayLabels = locale === 'de' ? DAY_LABELS_DE : DAY_LABELS_EN;

  const dayStatuses = useMemo(() => {
    return weekDays.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const activeForDay = habits.filter((h) => {
        if (h.isArchived) return false;
        if (h.scheduledDays && h.scheduledDays.length > 0) {
          return h.scheduledDays.includes(dayOfWeek);
        }
        return true;
      });

      if (activeForDay.length === 0) return 'none' as const;

      const completedIds = new Set(
        completions.filter((c) => c.date === dateStr).map((c) => c.habitId)
      );
      const allDone = activeForDay.every((h) => completedIds.has(h.id));

      return allDone ? ('done' as const) : ('has_habits' as const);
    });
  }, [weekDays, habits, completions]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.weekRow}>
        {weekDays.map((date, idx) => {
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          const status = dayStatuses[idx];

          return (
            <Pressable
              key={idx}
              onPress={() => {
                Haptics.selectionAsync();
                onSelectDate(date);
              }}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isSelected && isDark && styles.dayCellSelectedDark,
              ]}
            >
              <Text style={[
                styles.dayLabel,
                isDark && styles.dayLabelDark,
                isSelected && styles.dayLabelSelected,
              ]}>
                {dayLabels[date.getDay()]}
              </Text>
              <Text style={[
                styles.dayNumber,
                isDark && styles.dayNumberDark,
                isToday && styles.dayNumberToday,
                isSelected && styles.dayNumberSelected,
              ]}>
                {date.getDate()}
              </Text>
              <View
                style={[
                  styles.dotIndicator,
                  status === 'done' && styles.dotDone,
                  status === 'has_habits' && styles.dotHasHabits,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  containerDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 40,
  },
  dayCellSelected: {
    backgroundColor: 'rgba(232,67,90,0.1)',
  },
  dayCellSelectedDark: {
    backgroundColor: 'rgba(232,67,90,0.2)',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A3A3A3',
    marginBottom: 4,
  },
  dayLabelDark: {
    color: '#737373',
  },
  dayLabelSelected: {
    color: '#E8435A',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#525252',
  },
  dayNumberDark: {
    color: '#D4D4D4',
  },
  dayNumberToday: {
    color: '#E8435A',
    fontWeight: '700',
  },
  dayNumberSelected: {
    color: '#E8435A',
    fontWeight: '700',
  },
  dotIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  dotDone: {
    backgroundColor: '#22C55E',
  },
  dotHasHabits: {
    backgroundColor: '#E8435A',
  },
});
