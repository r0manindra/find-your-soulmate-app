import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
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
import { CharismoIcon } from '@/src/presentation/components/ui/charismo-icon';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { chapters } from '@/src/data/content/chapters';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { HeartCounter } from '@/src/presentation/components/ui/heart-counter';
import { useAuthStore } from '@/src/store/auth-store';
import { HEART_COSTS } from '@/src/config/heart-costs';

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
              {nextChapter.phase === 0
                ? nextChapter.subtitle[locale]
                : `${locale === 'de' ? 'Kapitel' : 'Chapter'} ${nextChapter.id} · ${nextChapter.subtitle[locale]}`}
            </Text>
          </View>
          <View style={styles.continueRight}>
            {isLoggedIn && nextChapter.phase !== 0 && !completedChapters.includes(nextChapter.id) && (
              <View style={styles.heartCostBadge}>
                <Ionicons name="heart" size={10} color="#fff" />
                <Text style={styles.heartCostText}>{HEART_COSTS.CHAPTER}</Text>
              </View>
            )}
            <View style={styles.continueArrow}>
              <Ionicons name="play" size={20} color="#fff" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

function QuickActionButton({ icon, label, subtitle, onPress, isDark, delay, customIcon }: { icon: string; label: string; subtitle?: string; onPress: () => void; isDark: boolean; delay: number; customIcon?: React.ReactNode }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeInDown.delay(delay).duration(400).springify()}>
      <AnimatedPressable
        style={[animatedStyle, styles.quickAction, isDark && styles.quickActionDark]}
        onPressIn={() => { scale.value = withSpring(0.92, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
      >
        {customIcon ?? <Ionicons name={icon as any} size={24} color="#E8435A" />}
        <Text style={[styles.quickActionLabel, isDark && styles.quickActionLabelDark]}>{label}</Text>
        {subtitle ? (
          <Text style={[styles.quickActionStat, isDark && styles.quickActionStatDark]}>{subtitle}</Text>
        ) : null}
      </AnimatedPressable>
    </Animated.View>
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
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, isDark && styles.titleDark, { flex: 1 }]}>{greeting}</Text>
            {isLoggedIn && <HeartCounter />}
          </View>
          <Text style={[styles.greetingSubtitle, isDark && styles.greetingSubtitleDark]}>{motivationalLine}</Text>
        </Animated.View>

        {/* Personalize card for users who skipped onboarding */}
        {!userGender && !personalizeCardDismissed && (
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
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

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ContinueCard locale={locale} />
        </Animated.View>

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
  continueRight: {
    alignItems: 'center',
    gap: 6,
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

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(232,67,90,0.06)',
    gap: 4,
  },
  quickActionDark: {
    backgroundColor: 'rgba(232,67,90,0.12)',
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#525252',
  },
  quickActionLabelDark: {
    color: '#A3A3A3',
  },
  quickActionStat: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A3A3A3',
  },
  quickActionStatDark: {
    color: '#737373',
  },

  // Streak (compact, in progress card)
  streakStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

});
