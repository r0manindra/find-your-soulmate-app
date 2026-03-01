import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { QuizQuestion } from '@/src/core/entities/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
  isDark: boolean;
}

export function QuizQuestionView({ question, questionNumber, totalQuestions, onAnswer, isDark }: Props) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answered = selectedIndex !== null;
  const scrollRef = useRef<ScrollView>(null);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    if (index === question.correctIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Auto-scroll to bottom when feedback appears so the Next button is visible
  useEffect(() => {
    if (answered) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
    }
  }, [answered]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAnswer(selectedIndex!);
  };

  const progress = questionNumber / totalQuestions;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Progress bar */}
      <View style={[styles.progressBarBg, isDark && styles.progressBarBgDark]}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
          {t('quiz.question', { current: questionNumber, total: totalQuestions })}
        </Text>

        {/* Question */}
        <Text style={[styles.questionText, isDark && styles.questionTextDark]}>
          {question.question}
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrect = index === question.correctIndex;
            const showCorrect = answered && isCorrect;
            const showWrong = answered && isSelected && !isCorrect;

            return (
              <OptionButton
                key={index}
                label={OPTION_LABELS[index]}
                text={option}
                onPress={() => handleSelect(index)}
                disabled={answered}
                showCorrect={showCorrect}
                showWrong={showWrong}
                isDark={isDark}
              />
            );
          })}
        </View>

        {/* Feedback */}
        {answered && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackLabel,
              selectedIndex === question.correctIndex ? styles.feedbackCorrect : styles.feedbackIncorrect,
            ]}>
              {selectedIndex === question.correctIndex ? t('quiz.correct') : t('quiz.incorrect')}
            </Text>
            <Text style={[styles.explanationText, isDark && styles.explanationTextDark]}>
              {question.explanation}
            </Text>
            <Pressable onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>
                {questionNumber === totalQuestions ? t('quiz.seeResults') : t('quiz.next')}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

function OptionButton({ label, text, onPress, disabled, showCorrect, showWrong, isDark }: {
  label: string;
  text: string;
  onPress: () => void;
  disabled: boolean;
  showCorrect: boolean;
  showWrong: boolean;
  isDark: boolean;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animStyle,
        styles.optionButton,
        isDark && styles.optionButtonDark,
        showCorrect && styles.optionCorrect,
        showWrong && styles.optionWrong,
      ]}
    >
      <View style={[
        styles.optionLabel,
        showCorrect && styles.optionLabelCorrect,
        showWrong && styles.optionLabelWrong,
      ]}>
        <Text style={[
          styles.optionLabelText,
          (showCorrect || showWrong) && styles.optionLabelTextActive,
        ]}>
          {label}
        </Text>
      </View>
      <Text style={[
        styles.optionText,
        isDark && styles.optionTextDark,
        showCorrect && styles.optionTextCorrect,
        showWrong && styles.optionTextWrong,
      ]}>
        {text}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarBgDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E8435A',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#737373',
    marginBottom: 20,
  },
  progressTextDark: {
    color: '#A3A3A3',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    lineHeight: 28,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  questionTextDark: {
    color: '#F5F5F5',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  optionButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionCorrect: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: '#22C55E',
  },
  optionWrong: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderColor: '#EF4444',
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelCorrect: {
    backgroundColor: '#22C55E',
  },
  optionLabelWrong: {
    backgroundColor: '#EF4444',
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#737373',
  },
  optionLabelTextActive: {
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#171717',
  },
  optionTextDark: {
    color: '#F5F5F5',
  },
  optionTextCorrect: {
    color: '#15803D',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#DC2626',
  },
  feedbackContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  feedbackCorrect: {
    color: '#22C55E',
  },
  feedbackIncorrect: {
    color: '#EF4444',
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#525252',
    marginBottom: 20,
  },
  explanationTextDark: {
    color: '#D4D4D4',
  },
  nextButton: {
    backgroundColor: '#E8435A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
