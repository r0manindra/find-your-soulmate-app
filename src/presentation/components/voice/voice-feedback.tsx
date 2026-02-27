import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import type { VoiceAnalysis } from '@/src/services/api';

interface Props {
  analysis: VoiceAnalysis;
  onTryAgain: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#10B981';
  if (score >= 6) return '#F59E0B';
  if (score >= 4) return '#F97316';
  return '#EF4444';
}

function getScoreEmoji(score: number): string {
  if (score >= 9) return '\uD83C\uDF1F';
  if (score >= 7) return '\u2B50';
  if (score >= 5) return '\uD83D\uDCAA';
  return '\uD83D\uDCA1';
}

export function VoiceFeedback({ analysis, onTryAgain }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scoreColor = getScoreColor(analysis.overallScore);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Overall Score */}
      <GlassCard>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreEmoji}>{getScoreEmoji(analysis.overallScore)}</Text>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>
            {analysis.overallScore}
          </Text>
          <Text style={[styles.scoreLabel, isDark && styles.labelDark]}>
            /10
          </Text>
          <Text style={[styles.scoreTitle, isDark && styles.titleDark]}>
            {t('voice.overallScore')}
          </Text>
        </View>
      </GlassCard>

      {/* Pace Card */}
      <GlassCard>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
            <Ionicons name="speedometer" size={18} color="#3B82F6" />
          </View>
          <Text style={[styles.cardTitle, isDark && styles.titleDark]}>
            {t('voice.pace')}
          </Text>
        </View>
        <View style={styles.paceRow}>
          <View style={styles.paceItem}>
            <Text style={[styles.paceValue, isDark && styles.titleDark]}>
              {analysis.wordsPerMinute}
            </Text>
            <Text style={[styles.paceLabel, isDark && styles.labelDark]}>
              {t('voice.wpm')}
            </Text>
          </View>
          <View style={styles.paceDivider} />
          <View style={styles.paceItem}>
            <Text style={[styles.paceValue, isDark && styles.titleDark]}>
              {analysis.wordCount}
            </Text>
            <Text style={[styles.paceLabel, isDark && styles.labelDark]}>
              {t('voice.words')}
            </Text>
          </View>
          <View style={styles.paceDivider} />
          <View style={styles.paceItem}>
            <View style={[styles.ratingBadge, {
              backgroundColor: analysis.paceRating === 'good'
                ? 'rgba(16,185,129,0.1)'
                : 'rgba(245,158,11,0.1)',
            }]}>
              <Text style={[styles.ratingText, {
                color: analysis.paceRating === 'good' ? '#10B981' : '#F59E0B',
              }]}>
                {t(`voice.paceRating.${analysis.paceRating}`)}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>

      {/* Filler Words Card */}
      {analysis.fillerWords.length > 0 && (
        <GlassCard>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
            </View>
            <Text style={[styles.cardTitle, isDark && styles.titleDark]}>
              {t('voice.fillerWords')}
            </Text>
            <View style={styles.fillerBadge}>
              <Text style={styles.fillerBadgeText}>{analysis.totalFillerCount}</Text>
            </View>
          </View>
          <View style={styles.fillerList}>
            {analysis.fillerWords.map((fw, idx) => (
              <View key={idx} style={[styles.fillerRow, isDark && styles.fillerRowDark]}>
                <Text style={[styles.fillerWord, isDark && styles.titleDark]}>
                  "{fw.word}"
                </Text>
                <Text style={[styles.fillerCount, isDark && styles.labelDark]}>
                  {fw.count}x
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>
      )}

      {/* Tips Card */}
      <GlassCard>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: 'rgba(232,67,90,0.1)' }]}>
            <Ionicons name="bulb" size={18} color="#E8435A" />
          </View>
          <Text style={[styles.cardTitle, isDark && styles.titleDark]}>
            {t('voice.tips')}
          </Text>
        </View>
        <View style={styles.tipsList}>
          {analysis.tips.map((tip, idx) => (
            <View key={idx} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={[styles.tipText, isDark && styles.tipTextDark]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Try Again Button */}
      <View style={styles.buttonContainer}>
        <BrandButton
          title={t('voice.tryAgain')}
          onPress={onTryAgain}
          icon={<Ionicons name="refresh" size={18} color="#fff" />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { gap: 12, paddingBottom: 24 },

  // Score
  scoreSection: { alignItems: 'center', paddingVertical: 8 },
  scoreEmoji: { fontSize: 32, marginBottom: 4 },
  scoreNumber: { fontSize: 56, fontWeight: '800', letterSpacing: -2 },
  scoreLabel: { fontSize: 20, fontWeight: '600', color: '#737373', marginTop: -8 },
  scoreTitle: { fontSize: 15, fontWeight: '600', color: '#171717', marginTop: 4 },

  // Card header
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  cardIcon: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#171717', flex: 1 },

  // Pace
  paceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  paceItem: { alignItems: 'center', flex: 1 },
  paceValue: { fontSize: 24, fontWeight: '800', color: '#171717', letterSpacing: -0.5 },
  paceLabel: { fontSize: 12, color: '#737373', marginTop: 2 },
  paceDivider: { width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.06)' },
  ratingBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  ratingText: { fontSize: 13, fontWeight: '700' },

  // Filler words
  fillerBadge: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  fillerBadgeText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },
  fillerList: { gap: 6 },
  fillerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 10,
  },
  fillerRowDark: { backgroundColor: 'rgba(255,255,255,0.04)' },
  fillerWord: { fontSize: 15, fontWeight: '600', color: '#171717' },
  fillerCount: { fontSize: 14, fontWeight: '700', color: '#737373' },

  // Tips
  tipsList: { gap: 10 },
  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#E8435A', marginTop: 7,
  },
  tipText: { flex: 1, fontSize: 15, lineHeight: 22, color: '#404040' },
  tipTextDark: { color: '#D4D4D4' },

  // Dark mode helpers
  titleDark: { color: '#F5F5F5' },
  labelDark: { color: '#A3A3A3' },

  // Button
  buttonContainer: { marginTop: 4 },
});
