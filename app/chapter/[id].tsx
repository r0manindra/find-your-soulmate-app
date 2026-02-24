import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { chapters } from '@/src/data/content/chapters';
import { chapterLessons } from '@/src/data/content/chapter-lessons';
import { chapterLessonsDe } from '@/src/data/content/chapter-lessons-de';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const chapterId = parseInt(id || '1', 10);
  const locale = useSettingsStore((s) => s.locale);
  const { completedChapters, completeChapter, uncompleteChapter } = useProgressStore();

  const chapter = useMemo(() => chapters.find((c) => c.id === chapterId), [chapterId]);
  const lesson = useMemo(() => {
    if (locale === 'de' && chapterLessonsDe.length > 0) {
      return chapterLessonsDe.find((l) => l.chapterId === chapterId) ?? chapterLessons.find((l) => l.chapterId === chapterId);
    }
    return chapterLessons.find((l) => l.chapterId === chapterId);
  }, [chapterId, locale]);
  const isCompleted = completedChapters.includes(chapterId);

  if (!chapter || !lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Chapter not found</Text>
      </SafeAreaView>
    );
  }

  const handleToggleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isCompleted) {
      uncompleteChapter(chapterId);
    } else {
      completeChapter(chapterId);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#171717" />
          </Pressable>
        </View>

        {/* Chapter intro */}
        <LinearGradient
          colors={['#E8435A', '#FF7854']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.introCard}
        >
          <View style={styles.introIconContainer}>
            <Ionicons name={chapter.ionicon as any} size={32} color="#fff" />
          </View>
          <Text style={styles.introLabel}>
            {locale === 'de' ? 'Kapitel' : 'Chapter'} {chapter.id}
          </Text>
          <Text style={styles.introTitle}>{chapter.title[locale]}</Text>
          <Text style={styles.introSubtitle}>{chapter.subtitle[locale]}</Text>
        </LinearGradient>

        {/* Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.summaryText}>{chapter.summary[locale]}</Text>
        </GlassCard>

        {/* Lessons */}
        <Text style={styles.sectionTitle}>
          {locale === 'de' ? 'Lektionen' : 'Lessons'}
        </Text>
        {lesson.lessons.map((l, idx) => (
          <GlassCard key={idx} style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.lessonTitle}>{l.title}</Text>
            </View>
            <Text style={styles.lessonContent}>{l.content}</Text>
          </GlassCard>
        ))}

        {/* Exercises */}
        <Text style={styles.sectionTitle}>
          {locale === 'de' ? 'Übungen' : 'Exercises'}
        </Text>
        {lesson.exercises.map((ex, idx) => (
          <GlassCard key={idx} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Ionicons name="flash" size={18} color="#E8435A" />
              <Text style={styles.exerciseTitle}>{ex.title}</Text>
            </View>
            <Text style={styles.exerciseDescription}>{ex.description}</Text>
          </GlassCard>
        ))}

        {/* Key Takeaway */}
        <GlassCard style={styles.takeawayCard}>
          <Text style={styles.takeawayLabel}>
            {locale === 'de' ? 'Wichtigste Erkenntnis' : 'Key Takeaway'}
          </Text>
          <Text style={styles.takeawayText}>"{lesson.keyTakeaway}"</Text>
        </GlassCard>

        {/* Action button */}
        <View style={styles.actionContainer}>
          <BrandButton
            title={
              isCompleted
                ? locale === 'de' ? 'Abgeschlossen' : 'Completed'
                : locale === 'de' ? 'Kapitel abschließen' : 'Mark Complete'
            }
            variant={isCompleted ? 'secondary' : 'primary'}
            onPress={handleToggleComplete}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollView: { flex: 1 },
  content: { paddingBottom: 120 },
  errorText: { fontSize: 16, color: '#737373', textAlign: 'center', marginTop: 40 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Intro card
  introCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  introIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  introLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // Summary
  summaryCard: { marginHorizontal: 20, marginBottom: 24 },
  summaryText: { fontSize: 16, lineHeight: 24, color: '#404040' },

  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.3,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },

  // Lessons
  lessonCard: { marginHorizontal: 20, marginBottom: 12 },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8435A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  lessonContent: {
    fontSize: 15,
    lineHeight: 23,
    color: '#404040',
  },

  // Exercises
  exerciseCard: { marginHorizontal: 20, marginBottom: 12 },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
  },
  exerciseDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#525252',
  },

  // Takeaway
  takeawayCard: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#E8435A',
  },
  takeawayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8435A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  takeawayText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  // Action
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
