import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { ProgressRing } from '@/src/presentation/components/ui/progress-ring';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { getPersonalization } from '@/src/core/personalization';
import { chapters, phases } from '@/src/data/content/chapters';

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
        if (nextChapter && nextChapter.id <= 4) {
          router.push(`/chapter/${nextChapter.id}`);
        } else if (nextChapter) {
          router.push('/paywall');
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

function JourneyMiniMap({ completedChapters }: { completedChapters: number[] }) {
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
            <Text style={[styles.miniMapLabel, (isComplete || isActive) && styles.miniMapLabelActive]}>
              {phase.id}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { completedChapters, completedBooks, streak, updateStreak } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);

  useEffect(() => {
    updateStreak();
  }, []);

  const overallProgress = completedChapters.length / chapters.length;

  const dailyTip = useMemo(() => {
    const tips = t('home.tips', { returnObjects: true }) as string[];
    const dayIndex = new Date().getDate() % tips.length;
    return tips[dayIndex];
  }, [t]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('home.title')}</Text>

        <ContinueCard locale={locale} />

        <GlassCard style={styles.progressCard}>
          <View style={styles.progressRow}>
            <ProgressRing
              progress={overallProgress}
              size={110}
              label={t('home.progress')}
            />
            <View style={styles.statsColumn}>
              <View>
                <Text style={styles.statNumber}>{completedChapters.length}/20</Text>
                <Text style={styles.statLabel}>{t('home.chapters')}</Text>
              </View>
              <View>
                <Text style={styles.statNumber}>{completedBooks.length}/10</Text>
                <Text style={styles.statLabel}>{t('home.books')}</Text>
              </View>
            </View>
          </View>
          <JourneyMiniMap completedChapters={completedChapters} />
        </GlassCard>

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

        <GlassCard style={styles.tipCard}>
          <Text style={styles.tipTitle}>{t('home.dailyTip')}</Text>
          <Text style={styles.tipText}>{dailyTip}</Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: '#171717', marginBottom: 20 },

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
  statLabel: { fontSize: 13, color: '#737373', marginTop: 2 },

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
  miniMapLabelActive: {
    color: '#E8435A',
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
});
