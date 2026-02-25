import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import type { Phase } from '@/src/core/entities/types';

interface PhaseHeaderProps {
  phase: Phase;
  locale: 'en' | 'de';
  completedCount: number;
  totalCount: number;
  isDark?: boolean;
}

export function PhaseHeader({ phase, locale, completedCount, totalCount, isDark = false }: PhaseHeaderProps) {
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const isComplete = completedCount === totalCount;

  return (
    <GlassCard style={styles.container} intensity={40}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.phaseLabel}>
            {locale === 'de' ? 'Phase' : 'Phase'} {phase.id}
          </Text>
          <Text style={[styles.phaseTitle, isDark && styles.phaseTitleDark]}>{phase.title[locale]}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>
      <View style={[styles.progressTrack, isDark && styles.progressTrackDark]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` },
            isComplete && styles.progressComplete,
          ]}
        />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8435A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.4,
  },
  phaseTitleDark: {
    color: '#F5F5F5',
  },
  badge: {
    backgroundColor: 'rgba(232,67,90,0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8435A',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressTrackDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E8435A',
    borderRadius: 2,
  },
  progressComplete: {
    backgroundColor: '#34C759',
  },
});
