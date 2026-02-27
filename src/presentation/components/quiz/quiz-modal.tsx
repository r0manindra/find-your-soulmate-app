import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { QuizQuestionView } from './quiz-question';
import { QuizResults } from './quiz-results';
import { getQuizTemplate } from '@/src/data/content/quiz-templates';
import type { QuizQuestion } from '@/src/core/entities/types';

type Phase = 'question' | 'results';

interface Props {
  visible: boolean;
  onClose: () => void;
  chapterId: number;
  locale: string;
  isDark: boolean;
  onComplete: (score: number) => void;
  onSkip?: () => void;
  onNavigateNext?: () => void;
}

export function QuizModal({ visible, onClose, chapterId, locale, isDark, onComplete, onSkip, onNavigateNext }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('question');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const hasLoaded = useRef(false);

  // Load quiz instantly from static templates
  useEffect(() => {
    if (visible && !hasLoaded.current) {
      hasLoaded.current = true;
      const qs = getQuizTemplate(chapterId, locale);
      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setPhase('question');
    }
    if (!visible) {
      hasLoaded.current = false;
    }
  }, [visible, chapterId, locale]);

  const finalScoreRef = useRef(0);

  const handleAnswer = useCallback((selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentIndex].correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    if (currentIndex + 1 >= questions.length) {
      finalScoreRef.current = newScore;
      setPhase('results');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [questions, currentIndex, score]);

  const handleClose = useCallback(() => {
    const wasResults = phase === 'results';
    onClose();
    if (wasResults) {
      setTimeout(() => onComplete(finalScoreRef.current), 300);
    }
  }, [onClose, onComplete, phase]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    if (onSkip) {
      setTimeout(() => onSkip(), 300);
    }
  }, [onClose, onSkip]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            {t('quiz.title')}
          </Text>
          <View style={styles.headerRight}>
            {phase === 'question' && onSkip && (
              <Pressable onPress={handleSkip} style={styles.skipBtn}>
                <Text style={styles.skipText}>{t('quiz.skip')}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleClose}
              style={[styles.closeBtn, isDark && styles.closeBtnDark]}
            >
              <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        {phase === 'question' && questions[currentIndex] && (
          <QuizQuestionView
            key={currentIndex}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            isDark={isDark}
          />
        )}

        {phase === 'results' && (
          <QuizResults
            score={score}
            total={questions.length}
            onClose={handleClose}
            onNavigateNext={onNavigateNext}
            isDark={isDark}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeAreaDark: {
    backgroundColor: '#171717',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  headerTitleDark: {
    color: '#F5F5F5',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
