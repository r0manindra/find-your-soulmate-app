import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { ProgressRing } from '@/src/presentation/components/ui/progress-ring';
import { useProgressStore } from '@/src/store/progress-store';
import { chapters } from '@/src/data/content/chapters';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { completedChapters, completedBooks, streak, updateStreak } = useProgressStore();

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
        </GlassCard>

        <GlassCard style={styles.streakCard}>
          <LinearGradient
            colors={['#E8435A', '#FF7854']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakGradient}
          >
            <Text style={styles.streakEmoji}>🔥</Text>
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
  progressCard: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statsColumn: { flex: 1, gap: 16 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  statLabel: { fontSize: 13, color: '#737373', marginTop: 2 },
  streakCard: { marginBottom: 16, overflow: 'hidden' },
  streakGradient: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, margin: -16, borderRadius: 20 },
  streakEmoji: { fontSize: 40 },
  streakNumber: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -1 },
  streakLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  tipCard: { marginBottom: 16 },
  tipTitle: { fontSize: 15, fontWeight: '600', color: '#E8435A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  tipText: { fontSize: 17, lineHeight: 24, color: '#404040' },
});
