import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Modal, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { QuizQuestionView } from './quiz-question';
import { QuizResults } from './quiz-results';
import * as api from '@/src/services/api';
import type { QuizQuestion } from '@/src/core/entities/types';

type Phase = 'loading' | 'question' | 'results' | 'error';

interface Props {
  visible: boolean;
  onClose: () => void;
  chapterId: number;
  locale: string;
  gender: 'male' | 'female' | null;
  isDark: boolean;
  onComplete: (score: number) => void;
}

export function QuizModal({ visible, onClose, chapterId, locale, gender, isDark, onComplete }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const hasLoaded = useRef(false);

  const loadQuiz = useCallback(async () => {
    setPhase('loading');
    setCurrentIndex(0);
    setScore(0);
    setQuestions([]);
    try {
      const data = await api.generateQuiz(chapterId, locale, gender);
      setQuestions(data.questions);
      setPhase('question');
    } catch (err) {
      console.error('Quiz load error:', err);
      setPhase('error');
    }
  }, [chapterId, locale, gender]);

  // Load quiz when modal becomes visible (works on both iOS and Android)
  useEffect(() => {
    if (visible && !hasLoaded.current) {
      hasLoaded.current = true;
      loadQuiz();
    }
    if (!visible) {
      hasLoaded.current = false;
    }
  }, [visible, loadQuiz]);

  const handleAnswer = useCallback((selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentIndex].correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    if (currentIndex + 1 >= questions.length) {
      setPhase('results');
      // Use newScore since setState is async
      setTimeout(() => onComplete(newScore), 0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [questions, currentIndex, score, onComplete]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

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
          <Pressable
            onPress={handleClose}
            style={[styles.closeBtn, isDark && styles.closeBtnDark]}
          >
            <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
          </Pressable>
        </View>

        {/* Content */}
        {phase === 'loading' && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#E8435A" />
            <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
              {t('quiz.generating')}
            </Text>
          </View>
        )}

        {phase === 'error' && (
          <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={48} color="#E8435A" />
            <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
              {t('quiz.error')}
            </Text>
            <Pressable onPress={loadQuiz} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>
                {t('quiz.retake')}
              </Text>
            </Pressable>
          </View>
        )}

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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#737373',
  },
  loadingTextDark: {
    color: '#A3A3A3',
  },
  errorText: {
    fontSize: 16,
    color: '#525252',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorTextDark: {
    color: '#D4D4D4',
  },
  retryButton: {
    backgroundColor: '#E8435A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
