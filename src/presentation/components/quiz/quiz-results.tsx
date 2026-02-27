import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface Props {
  score: number;
  total: number;
  onClose: () => void;
  onNavigateNext?: () => void;
  isDark: boolean;
}

function getGrade(score: number, total: number): { emoji: string; key: string } {
  const ratio = score / total;
  if (ratio === 1) return { emoji: '\uD83C\uDFC6', key: 'grade5' };
  if (ratio >= 0.8) return { emoji: '\u2B50', key: 'grade4' };
  if (ratio >= 0.6) return { emoji: '\uD83D\uDC4D', key: 'grade3' };
  if (ratio >= 0.4) return { emoji: '\uD83D\uDCAA', key: 'grade2' };
  return { emoji: '\uD83D\uDCAA', key: 'grade1' };
}

export function QuizResults({ score, total, onClose, onNavigateNext, isDark }: Props) {
  const { t } = useTranslation();
  const grade = getGrade(score, total);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };

  const handleNavigateNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
    // Navigate after modal dismisses
    setTimeout(() => onNavigateNext?.(), 300);
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{grade.emoji}</Text>
        <Text style={[styles.resultLabel, isDark && styles.resultLabelDark]}>
          {t('quiz.results')}
        </Text>
        <Text style={[styles.scoreText, isDark && styles.scoreTextDark]}>
          {score}/{total}
        </Text>
        <Text style={[styles.gradeText, isDark && styles.gradeTextDark]}>
          {t(`quiz.${grade.key}`)}
        </Text>
      </View>

      <View style={styles.buttons}>
        <Pressable onPress={handleClose} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>
            {t('quiz.complete')}
          </Text>
        </Pressable>

        {onNavigateNext && (
          <Pressable onPress={handleNavigateNext} style={[styles.nextButton, isDark && styles.nextButtonDark]}>
            <Text style={[styles.nextButtonText, isDark && styles.nextButtonTextDark]}>
              {t('quiz.continueNext')}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={isDark ? '#F5F5F5' : '#171717'} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  resultLabelDark: {
    color: '#A3A3A3',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -1,
    marginBottom: 12,
  },
  scoreTextDark: {
    color: '#F5F5F5',
  },
  gradeText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#525252',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  gradeTextDark: {
    color: '#D4D4D4',
  },
  buttons: {
    gap: 10,
  },
  completeButton: {
    backgroundColor: '#E8435A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  nextButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  nextButtonTextDark: {
    color: '#F5F5F5',
  },
});
