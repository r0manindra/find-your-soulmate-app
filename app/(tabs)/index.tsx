import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { ProgressRing } from '@/src/presentation/components/ui/progress-ring';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { chapters } from '@/src/data/content/chapters';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { HeartCounter } from '@/src/presentation/components/ui/heart-counter';
import { useAuthStore } from '@/src/store/auth-store';
import { HEART_COSTS } from '@/src/config/heart-costs';
import { useHeartsStore } from '@/src/store/hearts-store';
import { useHabitStore } from '@/src/store/habit-store';

function getGreeting(locale: 'en' | 'de'): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return locale === 'de' ? 'Guten Morgen' : 'Good Morning';
  if (hour >= 12 && hour < 17) return locale === 'de' ? 'Guten Nachmittag' : 'Good Afternoon';
  return locale === 'de' ? 'Guten Abend' : 'Good Evening';
}

const MOTIVATIONAL_LINES_EN = [
  'Your future self is counting on you.',
  'Small steps, big transformation.',
  "Today's effort is tomorrow's confidence.",
  'Every conversation is practice.',
  'You got this.',
];
const MOTIVATIONAL_LINES_DE = [
  'Dein zukünftiges Ich zählt auf dich.',
  'Kleine Schritte, große Veränderung.',
  'Die Mühe von heute ist das Selbstbewusstsein von morgen.',
  'Jedes Gespräch ist Übung.',
  'Du schaffst das.',
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ContinueCard({ locale }: { locale: 'en' | 'de' }) {
  const { completedChapters } = useProgressStore();
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasChapterUnlock = useAuthStore((s) => s.hasChapterUnlock);
  const scale = useSharedValue(1);

  // Chapter order: Phase 0 (21-25), then Phase 1-5 (1-20)
  const chapterOrder = useMemo(
    () => [21, 22, 23, 24, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [],
  );

  const nextChapter = useMemo(() => {
    const nextId = chapterOrder.find((id) => !completedChapters.includes(id));
    return chapters.find((c) => c.id === nextId) ?? chapters[0];
  }, [completedChapters, chapterOrder]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!nextChapter) return null;

  const isFree = nextChapter.phase === 0;
  const isCompleted = completedChapters.includes(nextChapter.id);
  const needsHearts = isLoggedIn && !isFree && !isCompleted && !hasChapterUnlock;

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (!nextChapter) return;

        if (needsHearts) {
          const hearts = useHeartsStore.getState();
          if (!hearts.canSpend(HEART_COSTS.CHAPTER)) {
            router.push('/paywall?trigger=hearts');
            return;
          }
          Alert.alert(
            locale === 'de' ? 'Kapitel freischalten' : 'Unlock Chapter',
            locale === 'de'
              ? `Dieses Kapitel kostet ${HEART_COSTS.CHAPTER} Herzen. Fortfahren?`
              : `This chapter costs ${HEART_COSTS.CHAPTER} hearts. Continue?`,
            [
              { text: locale === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
              {
                text: locale === 'de' ? 'Freischalten' : 'Unlock',
                onPress: () => router.push(`/chapter/${nextChapter.id}`),
              },
            ],
          );
          return;
        }
        router.push(`/chapter/${nextChapter.id}`);
      }}
    >
      <LinearGradient
        colors={['#E8435A', '#FF7854']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.continueCard}
      >
        <View style={styles.continueTopRow}>
          <View style={styles.continueIconContainer}>
            <Ionicons name={nextChapter.ionicon as any} size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.continueLabel}>
              {needsHearts
                ? locale === 'de' ? 'Freischalten' : 'Unlock'
                : locale === 'de' ? 'Weiter mit' : 'Continue with'}
            </Text>
            <Text style={styles.continueTitle} numberOfLines={2}>
              {nextChapter.title[locale]}
            </Text>
          </View>
          {needsHearts && (
            <View style={styles.heartCostBadge}>
              <Ionicons name="heart" size={10} color="#fff" />
              <Text style={styles.heartCostText}>{HEART_COSTS.CHAPTER}</Text>
            </View>
          )}
        </View>
        <Text style={styles.continueSubtitle}>
          {nextChapter.phase === 0
            ? nextChapter.subtitle[locale]
            : `${locale === 'de' ? 'Kapitel' : 'Chapter'} ${nextChapter.id} · ${nextChapter.subtitle[locale]}`}
        </Text>
        <Text style={styles.continueDescription} numberOfLines={3}>
          {nextChapter.summary[locale]}
        </Text>
        <View style={styles.continueCta}>
          <View style={styles.continueArrow}>
            <Ionicons name={needsHearts ? 'lock-open' : 'play'} size={18} color="#fff" />
          </View>
          <Text style={styles.continueCtaText}>
            {needsHearts
              ? locale === 'de' ? 'Kapitel freischalten' : 'Unlock chapter'
              : locale === 'de' ? 'Jetzt lesen' : 'Read now'}
          </Text>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { completedChapters, streak, updateStreak } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userGender = useUserProfileStore((s) => s.userGender);
  const [personalizeCardDismissed, setPersonalizeCardDismissed] = useState(false);

  // Habits mini-summary
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const activeHabits = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayDow = useMemo(() => new Date().getDay(), []);
  const habitsForToday = useMemo(() => {
    return activeHabits.filter((h) => {
      if (h.scheduledDays && h.scheduledDays.length > 0) {
        return h.scheduledDays.includes(todayDow);
      }
      return true;
    });
  }, [activeHabits, todayDow]);
  const habitsDone = useMemo(() => {
    const completedIds = new Set(completions.filter((c) => c.date === todayStr).map((c) => c.habitId));
    return habitsForToday.filter((h) => completedIds.has(h.id)).length;
  }, [habitsForToday, completions, todayStr]);

  useEffect(() => {
    updateStreak();
  }, []);

  const overallProgress = completedChapters.length / chapters.length;

  const greeting = useMemo(() => getGreeting(locale), [locale]);
  const motivationalLine = useMemo(() => {
    const lines = locale === 'de' ? MOTIVATIONAL_LINES_DE : MOTIVATIONAL_LINES_EN;
    return lines[new Date().getDate() % lines.length];
  }, [locale]);

  return (
    <View style={[styles.safeArea, isDark && styles.safeAreaDark, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, isDark && styles.titleDark, { flex: 1 }]}>{greeting}</Text>
            {isLoggedIn && <HeartCounter />}
          </View>
          <Text style={[styles.greetingSubtitle, isDark && styles.greetingSubtitleDark]}>{motivationalLine}</Text>
        </Animated.View>

        {/* Personalize card for users who skipped onboarding */}
        {!userGender && !personalizeCardDismissed && (
          <Animated.View entering={FadeInDown.delay(50).duration(300)}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/onboarding' as any);
              }}
              style={[styles.personalizeCard, isDark && styles.personalizeCardDark]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.personalizeTitle, isDark && { color: '#F5F5F5' }]}>
                  {locale === 'de' ? 'Erfahrung personalisieren' : 'Personalize your experience'}
                </Text>
                <Text style={[styles.personalizeSubtitle, isDark && { color: '#A3A3A3' }]}>
                  {locale === 'de' ? '3 schnelle Fragen für bessere Inhalte' : '3 quick questions for better content'}
                </Text>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setPersonalizeCardDismissed(true);
                }}
                hitSlop={8}
              >
                <Ionicons name="close" size={18} color="#A3A3A3" />
              </Pressable>
            </Pressable>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(60).duration(300)}>
          <ContinueCard locale={locale} />
        </Animated.View>

        {/* Today's Habits mini-summary */}
        {activeHabits.length > 0 && (
          <Animated.View entering={FadeInDown.delay(140).duration(300)}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/habits');
              }}
              style={[styles.habitsMiniCard, isDark && styles.habitsMiniCardDark]}
            >
              <View style={styles.habitsMiniLeft}>
                <Text style={styles.habitsMiniEmoji}>
                  {habitsDone === habitsForToday.length && habitsForToday.length > 0 ? '🎉' : '📋'}
                </Text>
                <View>
                  <Text style={[styles.habitsMiniTitle, isDark && styles.habitsMiniTitleDark]}>
                    {locale === 'de' ? 'Heutige Habits' : "Today's Habits"}
                  </Text>
                  <Text style={[styles.habitsMiniSubtitle, isDark && styles.habitsMiniSubtitleDark]}>
                    {habitsDone === habitsForToday.length && habitsForToday.length > 0
                      ? locale === 'de' ? 'Alles erledigt!' : 'All done!'
                      : `${habitsDone}/${habitsForToday.length} ${locale === 'de' ? 'erledigt' : 'done'}`}
                  </Text>
                </View>
              </View>
              <View style={styles.habitsMiniDots}>
                {habitsForToday.slice(0, 5).map((h, i) => {
                  const done = completions.some((c) => c.habitId === h.id && c.date === todayStr);
                  return (
                    <View
                      key={h.id}
                      style={[styles.habitsMiniDot, done && styles.habitsMiniDotDone]}
                    />
                  );
                })}
              </View>
              <Ionicons name="chevron-forward" size={18} color={isDark ? '#525252' : '#D4D4D4'} />
            </Pressable>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(180).duration(300)}>
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressRow}>
              <ProgressRing
                progress={overallProgress}
                size={130}
                label={t('home.progress')}
                isDark={isDark}
              />
              <View style={styles.statsColumn}>
                <View>
                  <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>{completedChapters.length}/{chapters.length}</Text>
                  <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{t('home.chapters')}</Text>
                </View>
                <View style={styles.streakStatRow}>
                  <Ionicons name="flame" size={20} color="#FF7854" />
                  <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>{streak}</Text>
                  <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{t('home.streak')}</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: '#171717' },
  titleDark: { color: '#F5F5F5' },
  greetingSubtitle: { fontSize: 15, color: '#737373', marginBottom: 20 },
  greetingSubtitleDark: { color: '#A3A3A3' },

  // Personalize card
  personalizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(232,67,90,0.06)',
    borderRadius: 14,
    marginBottom: 12,
  },
  personalizeCardDark: {
    backgroundColor: 'rgba(232,67,90,0.12)',
  },
  personalizeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  personalizeSubtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },

  // Continue Card
  continueCard: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 12,
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  continueTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  continueIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  continueTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  continueSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  continueDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 14,
  },
  heartCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heartCostText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  continueCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  continueArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  // Habits mini card
  habitsMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  habitsMiniCardDark: {
    backgroundColor: '#252525',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  habitsMiniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  habitsMiniEmoji: {
    fontSize: 24,
  },
  habitsMiniTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  habitsMiniTitleDark: { color: '#F5F5F5' },
  habitsMiniSubtitle: {
    fontSize: 12,
    color: '#737373',
    marginTop: 1,
  },
  habitsMiniSubtitleDark: { color: '#A3A3A3' },
  habitsMiniDots: {
    flexDirection: 'row',
    gap: 4,
  },
  habitsMiniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  habitsMiniDotDone: {
    backgroundColor: '#E8435A',
  },

  // Progress card
  progressCard: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statsColumn: { flex: 1, gap: 16 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  statNumberDark: { color: '#F5F5F5' },
  statLabel: { fontSize: 13, color: '#737373', marginTop: 2 },
  statLabelDark: { color: '#A3A3A3' },

  // Streak (compact, in progress card)
  streakStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
