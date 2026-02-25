import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming, FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { ProgressRing } from '@/src/presentation/components/ui/progress-ring';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { useHabitStore } from '@/src/store/habit-store';
import { getPersonalization } from '@/src/core/personalization';
import { chapters, phases } from '@/src/data/content/chapters';

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
  const profile = useUserProfileStore();
  const router = useRouter();
  const scale = useSharedValue(1);

  const nextChapter = useMemo(() => {
    // If user has no progress yet, use personalized start chapter
    if (completedChapters.length === 0 && profile.hasCompletedOnboarding && profile.skillLevel) {
      const personalization = getPersonalization(profile);
      return chapters.find((c) => c.id === personalization.suggestedStartChapter) ?? chapters[0];
    }
    return chapters.find((c) => !completedChapters.includes(c.id));
  }, [completedChapters, profile]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!nextChapter) return null;

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
        if (nextChapter) {
          router.push(`/chapter/${nextChapter.id}`);
        }
      }}
    >
      <LinearGradient
        colors={['#E8435A', '#FF7854']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.continueCard}
      >
        <View style={styles.continueContent}>
          <View style={styles.continueIconContainer}>
            <Ionicons name={nextChapter.ionicon as any} size={28} color="#fff" />
          </View>
          <View style={styles.continueText}>
            <Text style={styles.continueLabel}>
              {locale === 'de' ? 'Weiter mit' : 'Continue with'}
            </Text>
            <Text style={styles.continueTitle} numberOfLines={1}>
              {nextChapter.title[locale]}
            </Text>
            <Text style={styles.continueSubtitle} numberOfLines={1}>
              {locale === 'de' ? 'Kapitel' : 'Chapter'} {nextChapter.id} · {nextChapter.subtitle[locale]}
            </Text>
          </View>
          <View style={styles.continueArrow}>
            <Ionicons name="play" size={20} color="#fff" />
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

function JourneyMiniMap({ completedChapters, isDark }: { completedChapters: number[]; isDark: boolean }) {
  const locale = useSettingsStore((s) => s.locale);

  return (
    <View style={styles.miniMap}>
      {phases.map((phase) => {
        const phaseChapters = chapters.filter((c) => c.phase === phase.id);
        const completedInPhase = phaseChapters.filter((c) =>
          completedChapters.includes(c.id)
        ).length;
        const isComplete = completedInPhase === phaseChapters.length;
        const isActive = completedInPhase > 0 && !isComplete;
        const progress = completedInPhase / phaseChapters.length;

        return (
          <View key={phase.id} style={styles.miniMapPhase}>
            <View
              style={[
                styles.miniMapDot,
                isDark && styles.miniMapDotDark,
                isComplete && styles.miniMapDotComplete,
                isActive && styles.miniMapDotActive,
              ]}
            >
              {isComplete ? (
                <Ionicons name="checkmark" size={10} color="#fff" />
              ) : isActive ? (
                <View
                  style={[
                    styles.miniMapProgress,
                    { height: `${progress * 100}%` },
                  ]}
                />
              ) : null}
            </View>
            <Text style={[styles.miniMapLabel, isDark && styles.miniMapLabelDark, (isComplete || isActive) && styles.miniMapLabelActive]}>
              {phase.id}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function QuickActionButton({ icon, label, onPress, isDark, delay }: { icon: string; label: string; onPress: () => void; isDark: boolean; delay: number }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <AnimatedPressable
        style={[animatedStyle, styles.quickAction, isDark && styles.quickActionDark]}
        onPressIn={() => { scale.value = withSpring(0.92, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
      >
        <Ionicons name={icon as any} size={22} color="#E8435A" />
        <Text style={[styles.quickActionLabel, isDark && styles.quickActionLabelDark]}>{label}</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { completedChapters, completedBooks, streak, updateStreak } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // Habits data
  const habitsCompletedToday = useHabitStore((s) => s.getTodayCompletedCount());
  const habitsTotalToday = useHabitStore((s) => s.getTodayTotalCount());

  useEffect(() => {
    updateStreak();
  }, []);

  const overallProgress = completedChapters.length / chapters.length;

  const greeting = useMemo(() => getGreeting(locale), [locale]);
  const motivationalLine = useMemo(() => {
    const lines = locale === 'de' ? MOTIVATIONAL_LINES_DE : MOTIVATIONAL_LINES_EN;
    return lines[new Date().getDate() % lines.length];
  }, [locale]);

  const dailyTip = useMemo(() => {
    const tips = t('home.tips', { returnObjects: true }) as string[];
    const dayIndex = new Date().getDate() % tips.length;
    return tips[dayIndex];
  }, [t]);

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{greeting}</Text>
          <Text style={[styles.greetingSubtitle, isDark && styles.greetingSubtitleDark]}>{motivationalLine}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ContinueCard locale={locale} />
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <QuickActionButton
            icon="book-outline"
            label={locale === 'de' ? 'Guide' : 'Guide'}
            onPress={() => router.push('/guide' as any)}
            isDark={isDark}
            delay={200}
          />
          <QuickActionButton
            icon="checkmark-circle-outline"
            label="Habits"
            onPress={() => router.push('/habits' as any)}
            isDark={isDark}
            delay={250}
          />
          <QuickActionButton
            icon="chatbubble-outline"
            label="Coach"
            onPress={() => router.push('/coach' as any)}
            isDark={isDark}
            delay={300}
          />
        </View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressRow}>
            <ProgressRing
              progress={overallProgress}
              size={130}
              label={t('home.progress')}
            />
            <View style={styles.statsColumn}>
              <View>
                <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>{completedChapters.length}/{chapters.length}</Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{t('home.chapters')}</Text>
              </View>
              <View>
                <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>{completedBooks.length}/10</Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{t('home.books')}</Text>
              </View>
              {habitsTotalToday > 0 && (
                <View>
                  <Text style={[styles.statNumber, isDark && styles.statNumberDark]}>{habitsCompletedToday}/{habitsTotalToday}</Text>
                  <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{locale === 'de' ? 'Habits heute' : 'Habits today'}</Text>
                </View>
              )}
            </View>
          </View>
          <JourneyMiniMap completedChapters={completedChapters} isDark={isDark} />
        </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(400)}>
        <GlassCard style={styles.streakCard}>
          <LinearGradient
            colors={['#E8435A', '#FF7854']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakGradient}
          >
            <Ionicons name="flame" size={40} color="#fff" />
            <View>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>{t('home.streak')}</Text>
            </View>
          </LinearGradient>
        </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).duration(400)}>
        <GlassCard style={styles.tipCard}>
          <Text style={styles.tipTitle}>{t('home.dailyTip')}</Text>
          <Text style={[styles.tipText, isDark && styles.tipTextDark]}>{dailyTip}</Text>
        </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: '#171717', marginBottom: 4 },
  titleDark: { color: '#F5F5F5' },
  greetingSubtitle: { fontSize: 15, color: '#737373', marginBottom: 20 },
  greetingSubtitleDark: { color: '#A3A3A3' },

  // Continue Card
  continueCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  continueIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    flex: 1,
  },
  continueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  continueTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  continueSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  continueArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Progress card
  progressCard: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statsColumn: { flex: 1, gap: 16 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  statNumberDark: { color: '#F5F5F5' },
  statLabel: { fontSize: 13, color: '#737373', marginTop: 2 },
  statLabelDark: { color: '#A3A3A3' },

  // Journey mini-map
  miniMap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  miniMapPhase: {
    alignItems: 'center',
    gap: 4,
  },
  miniMapDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniMapDotDark: {
    backgroundColor: '#404040',
  },
  miniMapDotComplete: {
    backgroundColor: '#E8435A',
  },
  miniMapDotActive: {
    backgroundColor: '#E5E5E5',
    borderWidth: 2,
    borderColor: '#E8435A',
  },
  miniMapProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(232,67,90,0.3)',
  },
  miniMapLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  miniMapLabelDark: {
    color: '#737373',
  },
  miniMapLabelActive: {
    color: '#E8435A',
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(232,67,90,0.06)',
    gap: 6,
  },
  quickActionDark: {
    backgroundColor: 'rgba(232,67,90,0.12)',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#525252',
  },
  quickActionLabelDark: {
    color: '#A3A3A3',
  },

  // Streak
  streakCard: { marginBottom: 16, overflow: 'hidden' },
  streakGradient: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, margin: -16, borderRadius: 20 },
  streakNumber: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -1 },
  streakLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // Tip
  tipCard: { marginBottom: 16 },
  tipTitle: { fontSize: 15, fontWeight: '600', color: '#E8435A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  tipText: { fontSize: 17, lineHeight: 24, color: '#404040' },
  tipTextDark: { color: '#D4D4D4' },
});
