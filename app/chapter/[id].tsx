import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, FlatList, Modal,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { CharismoIcon } from '@/src/presentation/components/ui/charismo-icon';
import { ChapterHabitsSheet } from '@/src/presentation/components/habits/chapter-habits-sheet';
import { QuizModal } from '@/src/presentation/components/quiz/quiz-modal';
import { VoiceTrainer } from '@/src/presentation/components/voice/voice-trainer';
import { VoiceCoachModal } from '@/src/presentation/components/voice/voice-coach-modal';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useHabitStore } from '@/src/store/habit-store';
import { chapters, phases } from '@/src/data/content/chapters';
import { chapterLessons } from '@/src/data/content/chapter-lessons';
import { chapterLessonsDe } from '@/src/data/content/chapter-lessons-de';
import { getCharacter } from '@/src/data/content/coach-characters';
import { getBooksForChapter } from '@/src/data/content/books';
import * as api from '@/src/services/api';
import type { JourneyContext } from '@/src/services/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function formatParagraphs(text: string): string[] {
  // Split on ". " followed by a capital letter — groups ~2-3 sentences per paragraph
  const sentences = text.split(/(?<=\.)\s+(?=[A-ZÄÖÜ"])/);
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join(' '));
  }
  return paragraphs;
}

interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const FALLBACK_RESPONSES = [
  "Good question. Here's the thing: confidence isn't about knowing all the answers. It's about being comfortable not knowing. That's what makes someone magnetic.",
  "Listen, I get it. Approaching someone feels like defusing a bomb. But here's the secret: they're probably just as nervous. Start with something genuine, comment on something real in the moment.",
  "The biggest mistake I see? Trying to be someone you're not. The right person will love the real you, weird quirks, awkward pauses, and all. Authenticity is the ultimate cheat code.",
  "Let me be real with you: rejection isn't about you. It's about timing, circumstances, chemistry. Don't take it personally. The best players in the game have the most strikeouts. Keep swinging.",
  "Here's what separates the amateurs from the naturals: listening. Most people are just waiting for their turn to talk. Actually listen. Ask follow-up questions. Make them feel seen.",
];

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const chapterId = parseInt(id || '1', 10);
  const locale = useSettingsStore((s) => s.locale);
  const selectedCharacterId = useSettingsStore((s) => s.selectedCharacterId);
  const userProfile = useUserProfileStore();
  const userGender = userProfile.userGender;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const progressStore = useProgressStore();
  const { completedChapters, completeChapter, uncompleteChapter } = progressStore;
  const { isLoggedIn } = useAuthStore();
  const habitStore = useHabitStore();
  const insets = useSafeAreaInsets();

  const [coachVisible, setCoachVisible] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [voiceCoachVisible, setVoiceCoachVisible] = useState(false);
  const isPremium = useAuthStore((s) => s.isPremium);
  const isProPlus = useAuthStore((s) => s.isProPlus);
  const quizScore = progressStore.quizScores[chapterId];
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const coachListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const activeCharacter = getCharacter(selectedCharacterId);

  const chapter = useMemo(() => chapters.find((c) => c.id === chapterId), [chapterId]);
  const lesson = useMemo(() => {
    let base;
    if (locale === 'de' && chapterLessonsDe.length > 0) {
      base = chapterLessonsDe.find((l) => l.chapterId === chapterId) ?? chapterLessons.find((l) => l.chapterId === chapterId);
    } else {
      base = chapterLessons.find((l) => l.chapterId === chapterId);
    }
    if (!base) return base;
    // Use female variant if available and user is female
    if (userGender === 'female' && base.femaleVariant) {
      return { ...base, ...base.femaleVariant };
    }
    return base;
  }, [chapterId, locale, userGender]);
  const isCompleted = completedChapters.includes(chapterId);
  const prevChapter = useMemo(() => chapters.find((c) => c.id === chapterId - 1), [chapterId]);
  const nextChapterNav = useMemo(() => chapters.find((c) => c.id === chapterId + 1), [chapterId]);

  // Journey-ordered next chapter (follows phase order: 21→22→...→25→1→2→...→20)
  const journeyOrder = useMemo(() => phases.flatMap((p) => p.chapters), []);
  const nextChapterId = useMemo(() => {
    const idx = journeyOrder.indexOf(chapterId);
    return idx >= 0 && idx < journeyOrder.length - 1 ? journeyOrder[idx + 1] : null;
  }, [chapterId, journeyOrder]);

  // Generate suggestion chips from chapter exercises
  const suggestionChips = useMemo(() => {
    if (!lesson) return [];
    const chips: { label: string; text: string }[] = [];
    lesson.exercises.slice(0, 2).forEach((ex) => {
      chips.push({
        label: locale === 'de' ? `Üben: ${ex.title}` : `Practice: ${ex.title}`,
        text: locale === 'de'
          ? `Lass uns die Übung "${ex.title}" aus diesem Kapitel gemeinsam üben.`
          : `Let's practice the exercise "${ex.title}" from this chapter together.`,
      });
    });
    chips.push({
      label: locale === 'de' ? 'Quiz mich' : 'Quiz me',
      text: locale === 'de'
        ? 'Stell mir Quizfragen zu diesem Kapitel, um mein Verständnis zu testen.'
        : 'Quiz me on this chapter to test my understanding.',
    });
    chips.push({
      label: locale === 'de' ? 'Erkläre die Erkenntnis' : 'Explain the takeaway',
      text: locale === 'de'
        ? `Erkläre mir die wichtigste Erkenntnis dieses Kapitels genauer: "${lesson.keyTakeaway}"`
        : `Explain the key takeaway of this chapter in more detail: "${lesson.keyTakeaway}"`,
    });
    return chips;
  }, [lesson, locale]);

  const buildChapterContext = useCallback((): JourneyContext => {
    const completed = progressStore.completedChapters;
    const activeHabits = habitStore.getActiveHabits();
    const activeWithStreaks = activeHabits.map((h) => ({
      name: h.title[locale] || h.title.en,
      currentStreak: habitStore.getStreak(h.id).current,
    }));

    return {
      profile: {
        gender: userProfile.userGender,
        ageGroup: userProfile.ageGroup,
        skillLevel: userProfile.skillLevel,
        socialEnergy: userProfile.socialEnergy,
        basicsLevel: userProfile.basicsLevel,
        goal: userProfile.goal,
      },
      progress: {
        completedChapters: completed,
        currentChapterId: chapterId,
        streak: progressStore.streak,
        graduated: progressStore.graduated,
      },
      habits: {
        active: activeWithStreaks,
        todayCompleted: habitStore.getTodayCompletedCount(),
        todayTotal: habitStore.getTodayTotalCount(),
        weeklyCompletionRate: habitStore.getWeeklyCompletionRate(),
      },
      locale,
    };
  }, [progressStore, habitStore, userProfile, locale, chapterId]);

  const sendCoachMsg = useCallback(async (messageText?: string) => {
    const text = messageText ?? coachInput;
    if (!text.trim() || coachLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: CoachMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text.trim(),
    };
    setCoachMessages((prev) => [...prev, userMsg]);
    setCoachInput('');
    setCoachLoading(true);

    try {
      if (isLoggedIn) {
        const context = buildChapterContext();
        const data = await api.sendCoachMessage(userMsg.content, selectedCharacterId, context);
        setCoachMessages((prev) => [...prev, {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: data.response,
        }]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        setCoachMessages((prev) => [...prev, {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: response,
        }]);
      }
    } catch (err: any) {
      const errorMsg = err?.status === 429
        ? (locale === 'de' ? 'Nachrichtenlimit erreicht. Upgrade auf Premium für unbegrenzte Nachrichten.' : 'Message limit reached. Upgrade to Premium for unlimited messages.')
        : err?.status === 403
          ? (locale === 'de' ? 'Premium erforderlich für diesen Charakter.' : 'Premium required for this character.')
          : (locale === 'de' ? 'Verbindungsfehler. Tippe um es erneut zu versuchen.' : 'Connection error. Tap to retry.');
      setCoachMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorMsg,
      }]);
    } finally {
      setCoachLoading(false);
    }
  }, [coachInput, coachLoading, isLoggedIn, selectedCharacterId, locale, buildChapterContext]);

  const handleChipPress = useCallback((chipText: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendCoachMsg(chipText);
  }, [sendCoachMsg]);

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
      setQuizVisible(true);
    }
  };

  const handleQuizComplete = (score: number) => {
    progressStore.saveQuizScore(chapterId, score);
    if (!isCompleted) {
      completeChapter(chapterId);
    }
  };

  const handleQuizSkip = () => {
    if (!isCompleted) {
      completeChapter(chapterId);
    }
  };

  const handleNavigateToNextChapter = nextChapterId ? () => {
    router.replace(`/chapter/${nextChapterId}` as any);
  } : undefined;

  const showChips = coachMessages.length === 0 && !coachLoading;

  const handleRetry = useCallback(() => {
    // Find the last user message and resend
    const lastUserMsg = [...coachMessages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;
    // Remove error messages
    setCoachMessages((prev) => prev.filter((m) => !m.id.startsWith('error-')));
    sendCoachMsg(lastUserMsg.content);
  }, [coachMessages, sendCoachMsg]);

  const renderCoachMessage = ({ item }: { item: CoachMessage }) => {
    const isUser = item.role === 'user';
    const isError = item.id.startsWith('error-');
    return (
      <Pressable
        onPress={isError ? handleRetry : undefined}
        disabled={!isError}
      >
        <View style={[styles.coachMsgRow, isUser && styles.coachMsgRowUser]}>
          {!isUser && (
            <View style={[styles.coachAvatar, { backgroundColor: `${activeCharacter.color}15` }]}>
              <CharismoIcon size={16} color={activeCharacter.color} />
            </View>
          )}
          <View style={[
            styles.coachBubble,
            isUser ? styles.coachBubbleUser : [styles.coachBubbleAI, isDark && styles.coachBubbleAIDark],
            isError && styles.coachBubbleError,
          ]}>
            <Text style={[styles.coachMsgText, isDark && !isUser && styles.coachMsgTextDark, isUser && styles.coachMsgTextUser]}>
              {item.content}
            </Text>
            {isError && (
              <View style={styles.retryRow}>
                <Ionicons name="refresh" size={14} color="#E8435A" />
                <Text style={styles.retryText}>
                  {locale === 'de' ? 'Erneut versuchen' : 'Tap to retry'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with chapter nav */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.backButton, isDark && styles.backButtonDark]}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#F5F5F5' : '#171717'} />
          </Pressable>
          <View style={styles.chapterNav}>
            {prevChapter ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.replace(`/chapter/${prevChapter.id}`);
                }}
                style={[styles.chapterNavBtn, isDark && styles.chapterNavBtnDark]}
              >
                <Ionicons name="chevron-back" size={16} color="#E8435A" />
                <Text style={styles.chapterNavText} numberOfLines={1}>
                  {prevChapter.phase === 0 ? prevChapter.title[locale] : prevChapter.id}
                </Text>
              </Pressable>
            ) : null}
            {nextChapterNav ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.replace(`/chapter/${nextChapterNav.id}`);
                }}
                style={[styles.chapterNavBtn, isDark && styles.chapterNavBtnDark]}
              >
                <Text style={styles.chapterNavText} numberOfLines={1}>
                  {nextChapterNav.phase === 0 ? nextChapterNav.title[locale] : nextChapterNav.id}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#E8435A" />
              </Pressable>
            ) : null}
          </View>
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
            {chapter.phase === 0
              ? (locale === 'de' ? 'Grundlagen' : 'Basics')
              : `${locale === 'de' ? 'Kapitel' : 'Chapter'} ${chapter.id}`}
          </Text>
          <Text style={styles.introTitle}>{chapter.title[locale]}</Text>
          <Text style={styles.introSubtitle}>{chapter.subtitle[locale]}</Text>
        </LinearGradient>

        {/* Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.summaryText, isDark && styles.summaryTextDark]}>{chapter.summary[locale]}</Text>
        </GlassCard>

        {/* Lessons */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {locale === 'de' ? 'Lektionen' : 'Lessons'}
        </Text>
        {lesson.lessons.map((l, idx) => (
          <GlassCard key={idx} style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{idx + 1}</Text>
              </View>
              <Text style={[styles.lessonTitle, isDark && styles.lessonTitleDark]}>{l.title}</Text>
            </View>
            {formatParagraphs(l.content).map((para, pIdx) => (
              <Text key={pIdx} style={[styles.lessonContent, isDark && styles.lessonContentDark, pIdx > 0 && { marginTop: 10 }]}>
                {para}
              </Text>
            ))}
          </GlassCard>
        ))}

        {/* Exercises */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {locale === 'de' ? 'Übungen' : 'Exercises'}
        </Text>
        {lesson.exercises.map((ex, idx) => (
          <GlassCard key={idx} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Ionicons name="flash" size={18} color="#E8435A" />
              <Text style={[styles.exerciseTitle, isDark && styles.exerciseTitleDark]}>{ex.title}</Text>
            </View>
            {formatParagraphs(ex.description).map((para, pIdx) => (
              <Text key={pIdx} style={[styles.exerciseDescription, isDark && styles.exerciseDescriptionDark, pIdx > 0 && { marginTop: 10 }]}>
                {para}
              </Text>
            ))}
          </GlassCard>
        ))}

        {/* Voice Trainer — voice-related chapters */}
        {(chapterId === 22 || chapterId === 25 || chapterId === 2) && (
          <>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              {locale === 'de' ? 'Stimmtrainer' : 'Voice Trainer'}
            </Text>
            <View style={styles.voiceTrainerContainer}>
              <VoiceTrainer />
            </View>

            {/* Practice with Voice Coach (Pro+) */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (!isProPlus) {
                  router.push('/paywall');
                } else {
                  setVoiceCoachVisible(true);
                }
              }}
              style={styles.voiceCoachContainer}
            >
              <GlassCard style={styles.voiceCoachCard}>
                <View style={styles.voiceCoachRow}>
                  <View style={styles.voiceCoachIcon}>
                    <Ionicons name="mic" size={22} color="#E8435A" />
                  </View>
                  <View style={styles.voiceCoachInfo}>
                    <Text style={[styles.voiceCoachTitle, isDark && { color: '#F5F5F5' }]}>
                      {locale === 'de' ? 'Mit Sprach-Coach üben' : 'Practice with Voice Coach'}
                    </Text>
                    <Text style={styles.voiceCoachDesc}>
                      {locale === 'de' ? 'Echtzeit-Sprachgespräch mit deinem KI-Coach' : 'Real-time voice conversation with your AI coach'}
                    </Text>
                  </View>
                  {!isProPlus ? (
                    <View style={styles.voiceCoachLock}>
                      <Ionicons name="lock-closed" size={14} color="#E8435A" />
                      <Text style={styles.voiceCoachLockText}>PRO+</Text>
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
                  )}
                </View>
              </GlassCard>
            </Pressable>
          </>
        )}

        {/* Key Takeaway */}
        <GlassCard style={styles.takeawayCard}>
          <Text style={styles.takeawayLabel}>
            {locale === 'de' ? 'Wichtigste Erkenntnis' : 'Key Takeaway'}
          </Text>
          <Text style={[styles.takeawayText, isDark && styles.takeawayTextDark]}>"{lesson.keyTakeaway}"</Text>
        </GlassCard>

        {/* Chapter-specific book recommendations */}
        {(() => {
          const chapterBooks = getBooksForChapter(chapterId);
          if (chapterBooks.length === 0) return null;
          return (
            <>
              <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                {locale === 'de' ? 'Passende Bücher' : 'Recommended Reading'}
              </Text>
              {chapterBooks.map((book) => (
                <Pressable
                  key={book.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/books');
                  }}
                  style={styles.booksLinkContainer}
                >
                  <GlassCard style={styles.booksLinkCard}>
                    <View style={styles.booksLinkRow}>
                      <View style={styles.booksLinkIcon}>
                        <Text style={{ fontSize: 20 }}>{book.emoji}</Text>
                      </View>
                      <View style={styles.booksLinkInfo}>
                        <Text style={[styles.booksLinkTitle, isDark && { color: '#F5F5F5' }]} numberOfLines={1}>
                          {book.title}
                        </Text>
                        <Text style={styles.booksLinkSubtitle} numberOfLines={1}>
                          {locale === 'de' ? 'von' : 'by'} {book.author}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
                    </View>
                  </GlassCard>
                </Pressable>
              ))}
            </>
          );
        })()}

        {/* Habit suggestions for this chapter */}
        <ChapterHabitsSheet chapterId={chapterId} locale={locale} isDark={isDark} />

        {/* Action button */}
        <View style={styles.actionContainer}>
          {isCompleted && quizScore != null && (
            <View style={styles.quizScoreBadge}>
              <Text style={styles.quizScoreText}>
                {quizScore}/5 {quizScore === 5 ? '\uD83C\uDFC6' : quizScore >= 4 ? '\u2B50' : quizScore >= 3 ? '\uD83D\uDC4D' : '\uD83D\uDCAA'}
              </Text>
            </View>
          )}
          <BrandButton
            title={
              isCompleted
                ? locale === 'de' ? 'Abgeschlossen' : 'Completed'
                : locale === 'de' ? 'Kapitel abschließen' : 'Mark Complete'
            }
            variant={isCompleted ? 'secondary' : 'primary'}
            onPress={handleToggleComplete}
          />
          {isCompleted && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setQuizVisible(true);
              }}
              style={[styles.retakeButton, isDark && styles.retakeButtonDark]}
            >
              <Ionicons name="refresh" size={16} color="#E8435A" />
              <Text style={styles.retakeButtonText}>
                {locale === 'de' ? 'Quiz wiederholen' : 'Retake Quiz'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Next Chapter card */}
        {isCompleted && (() => {
          const nextChapter = chapters.find((c) => c.id === chapterId + 1) ??
            chapters.find((c) => !completedChapters.includes(c.id) && c.id !== chapterId);
          if (!nextChapter) return null;
          return (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.replace(`/chapter/${nextChapter.id}`);
              }}
              style={styles.nextChapterContainer}
            >
              <LinearGradient
                colors={['#E8435A', '#FF7854']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextChapterCard}
              >
                <View style={styles.nextChapterContent}>
                  <View style={styles.nextChapterIconContainer}>
                    <Ionicons name={nextChapter.ionicon as any} size={24} color="#fff" />
                  </View>
                  <View style={styles.nextChapterText}>
                    <Text style={styles.nextChapterLabel}>
                      {locale === 'de' ? 'Nächstes Kapitel' : 'Next Chapter'}
                    </Text>
                    <Text style={styles.nextChapterTitle} numberOfLines={1}>
                      {nextChapter.title[locale]}
                    </Text>
                    <Text style={styles.nextChapterSubtitle} numberOfLines={1}>
                      {nextChapter.phase === 0
                        ? nextChapter.subtitle[locale]
                        : `${locale === 'de' ? 'Kapitel' : 'Chapter'} ${nextChapter.id} · ${nextChapter.subtitle[locale]}`}
                    </Text>
                  </View>
                  <View style={styles.nextChapterArrow}>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })()}
      </ScrollView>

      {/* Floating "Ask Coach" button */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setCoachVisible(true);
        }}
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
      >
        <LinearGradient
          colors={['#E8435A', '#FF7854']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <CharismoIcon size={22} color="#fff" />
        </LinearGradient>
      </Pressable>

      {/* Quiz Modal */}
      <QuizModal
        visible={quizVisible}
        onClose={() => setQuizVisible(false)}
        chapterId={chapterId}
        locale={locale}
        isDark={isDark}
        onComplete={handleQuizComplete}
        onSkip={handleQuizSkip}
        onNavigateNext={handleNavigateToNextChapter}
      />

      {/* Voice Coach Modal */}
      <VoiceCoachModal
        visible={voiceCoachVisible}
        onClose={() => setVoiceCoachVisible(false)}
        characterId={selectedCharacterId}
        locale={locale}
        chapterContext={chapter.title[locale]}
      />

      {/* Coach Panel Modal */}
      <Modal
        visible={coachVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCoachVisible(false)}
      >
        <SafeAreaView style={[styles.coachSafeArea, isDark && styles.coachSafeAreaDark]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            {/* Coach panel header */}
            <View style={styles.coachHeader}>
              <View style={styles.coachHeaderLeft}>
                <View style={[styles.coachHeaderIcon, { backgroundColor: `${activeCharacter.color}15` }]}>
                  <CharismoIcon size={18} color={activeCharacter.color} />
                </View>
                <View>
                  <Text style={[styles.coachHeaderTitle, isDark && styles.coachHeaderTitleDark]}>
                    {locale === 'de' ? 'Mit Coach üben' : 'Practice with Coach'}
                  </Text>
                  <Text style={styles.coachHeaderSubtitle} numberOfLines={1}>
                    {chapter.title[locale]}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setCoachVisible(false)}
                style={[styles.coachCloseBtn, isDark && styles.coachCloseBtnDark]}
              >
                <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
              </Pressable>
            </View>

            {/* Messages */}
            <FlatList
              ref={coachListRef}
              data={coachMessages}
              keyExtractor={(item) => item.id}
              renderItem={renderCoachMessage}
              contentContainerStyle={styles.coachMsgList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => coachListRef.current?.scrollToEnd({ animated: true })}
              ListHeaderComponent={
                showChips ? (
                  <View style={styles.coachChipsArea}>
                    <Text style={[styles.coachChipsTitle, isDark && styles.coachChipsTitleDark]}>
                      {locale === 'de' ? 'Probiere eine Frage:' : 'Try a question:'}
                    </Text>
                    <View style={styles.coachChipsWrap}>
                      {suggestionChips.map((chip, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => handleChipPress(chip.text)}
                          style={[styles.coachChip, isDark && styles.coachChipDark]}
                        >
                          <Text style={styles.coachChipText} numberOfLines={1}>{chip.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null
              }
              ListFooterComponent={
                coachLoading ? (
                  <View style={styles.coachMsgRow}>
                    <View style={[styles.coachAvatar, { backgroundColor: `${activeCharacter.color}15` }]}>
                      <CharismoIcon size={16} color={activeCharacter.color} />
                    </View>
                    <View style={[styles.coachBubbleAI, isDark && styles.coachBubbleAIDark]}>
                      <Text style={styles.coachLoadingText}>
                        {locale === 'de' ? 'Denke nach...' : 'Thinking...'}
                      </Text>
                    </View>
                  </View>
                ) : null
              }
            />

            {/* Input */}
            <BlurView
              intensity={isDark ? 40 : 80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.coachInputBlur, { paddingBottom: insets.bottom + 8 }]}
            >
              <View style={styles.coachInputRow}>
                <TextInput
                  style={[styles.coachInput, isDark && styles.coachInputDark]}
                  value={coachInput}
                  onChangeText={setCoachInput}
                  placeholder={locale === 'de' ? 'Frage stellen...' : 'Ask a question...'}
                  placeholderTextColor="#A3A3A3"
                  multiline
                  maxLength={500}
                  onSubmitEditing={() => sendCoachMsg()}
                  returnKeyType="send"
                />
                <Pressable
                  onPress={() => sendCoachMsg()}
                  style={[styles.coachSendBtn, { backgroundColor: activeCharacter.color }, (!coachInput.trim() || coachLoading) && styles.coachSendBtnDisabled]}
                  disabled={!coachInput.trim() || coachLoading}
                >
                  <Ionicons name="arrow-up" size={20} color="#fff" />
                </Pressable>
              </View>
            </BlurView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  scrollView: { flex: 1 },
  content: { paddingBottom: 120 },
  errorText: { fontSize: 16, color: '#737373', textAlign: 'center', marginTop: 40 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Chapter nav (inline in header)
  chapterNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(232,67,90,0.08)',
  },
  chapterNavBtnDark: {
    backgroundColor: 'rgba(232,67,90,0.15)',
  },
  chapterNavText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8435A',
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
  summaryTextDark: { color: '#D4D4D4' },

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
  sectionTitleDark: {
    color: '#F5F5F5',
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
  lessonTitleDark: {
    color: '#F5F5F5',
  },
  lessonContent: {
    fontSize: 15,
    lineHeight: 23,
    color: '#404040',
  },
  lessonContentDark: {
    color: '#D4D4D4',
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
  exerciseTitleDark: {
    color: '#F5F5F5',
  },
  exerciseDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#525252',
  },
  exerciseDescriptionDark: {
    color: '#D4D4D4',
  },

  // Voice Trainer
  voiceTrainerContainer: { marginHorizontal: 20, marginBottom: 12 },
  voiceCoachContainer: { paddingHorizontal: 20, marginBottom: 12 },
  voiceCoachCard: { marginHorizontal: 0 },
  voiceCoachRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  voiceCoachIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(232,67,90,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  voiceCoachInfo: { flex: 1 },
  voiceCoachTitle: { fontSize: 16, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  voiceCoachDesc: { fontSize: 13, color: '#737373', marginTop: 2 },
  voiceCoachLock: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(232,67,90,0.08)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  voiceCoachLockText: { fontSize: 10, fontWeight: '800', color: '#E8435A' },

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
  takeawayTextDark: {
    color: '#F5F5F5',
  },

  // Books link
  booksLinkContainer: { paddingHorizontal: 20, marginBottom: 16 },
  booksLinkCard: { marginHorizontal: 0 },
  booksLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  booksLinkIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(232,67,90,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  booksLinkInfo: { flex: 1 },
  booksLinkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  booksLinkSubtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },

  // Action
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quizScoreBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(232,67,90,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  quizScoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8435A',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(232,67,90,0.08)',
  },
  retakeButtonDark: {
    backgroundColor: 'rgba(232,67,90,0.15)',
  },
  retakeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E8435A',
  },

  // Next Chapter
  nextChapterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nextChapterCard: {
    borderRadius: 20,
    padding: 18,
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextChapterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  nextChapterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextChapterText: {
    flex: 1,
  },
  nextChapterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextChapterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  nextChapterSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  nextChapterArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: 20,
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  fabGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Coach Panel
  coachSafeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  coachSafeAreaDark: { backgroundColor: '#171717' },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  coachHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  coachHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  coachHeaderTitleDark: { color: '#F5F5F5' },
  coachHeaderSubtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 1,
  },
  coachCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachCloseBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)' },

  // Suggestion chips
  coachChipsArea: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  coachChipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
    marginBottom: 10,
  },
  coachChipsTitleDark: { color: '#A3A3A3' },
  coachChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coachChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(232,67,90,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232,67,90,0.15)',
  },
  coachChipDark: {
    backgroundColor: 'rgba(232,67,90,0.12)',
    borderColor: 'rgba(232,67,90,0.2)',
  },
  coachChipText: { fontSize: 13, fontWeight: '600', color: '#E8435A' },

  // Messages
  coachMsgList: { paddingHorizontal: 20, paddingBottom: 8 },
  coachMsgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  coachMsgRowUser: { justifyContent: 'flex-end' },
  coachAvatar: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  coachBubble: { maxWidth: '75%', padding: 14, borderRadius: 20 },
  coachBubbleUser: { backgroundColor: '#E8435A', borderBottomRightRadius: 4 },
  coachBubbleAI: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    borderBottomLeftRadius: 4,
    maxWidth: '75%',
    padding: 14,
    borderRadius: 20,
  },
  coachBubbleAIDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  coachMsgText: { fontSize: 16, lineHeight: 22, color: '#171717' },
  coachMsgTextDark: { color: '#F5F5F5' },
  coachMsgTextUser: { color: '#fff' },
  coachLoadingText: { fontSize: 14, color: '#A3A3A3', fontStyle: 'italic' },
  coachBubbleError: {
    borderColor: 'rgba(232,67,90,0.2)',
    borderWidth: 1,
  },
  retryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8,
  },
  retryText: { fontSize: 12, fontWeight: '600', color: '#E8435A' },

  // Input area
  coachInputBlur: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  coachInputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  coachInput: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 16, color: '#171717',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)',
  },
  coachInputDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#F5F5F5',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  coachSendBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  coachSendBtnDisabled: { opacity: 0.4 },
});
