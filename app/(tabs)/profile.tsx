import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { achievements } from '@/src/data/content/achievements';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const progress = useProgressStore();
  const { locale, setLocale } = useSettingsStore();

  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.condition(progress)),
    [progress]
  );

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'de' : 'en';
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGraduate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    progress.graduate();
    router.push('/modal');
  };

  const handleReset = () => {
    Alert.alert(
      t('profile.resetProgress'),
      t('profile.resetConfirm'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            progress.reset();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('profile.title')}</Text>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>{t('profile.achievements')}</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => {
            const unlocked = achievement.condition(progress);
            return (
              <GlassCard
                key={achievement.id}
                style={[styles.achievementCard, !unlocked && styles.achievementLocked]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[styles.achievementTitle, !unlocked && styles.lockedText]}>
                  {achievement.title[locale]}
                </Text>
                <Text style={[styles.achievementDesc, !unlocked && styles.lockedText]}>
                  {achievement.description[locale]}
                </Text>
                <Text style={styles.achievementStatus}>
                  {unlocked ? `✓ ${t('profile.unlocked')}` : t('profile.locked')}
                </Text>
              </GlassCard>
            );
          })}
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

        <GlassCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('profile.language')}</Text>
            <Pressable onPress={toggleLanguage} style={styles.languageToggle}>
              <View style={[styles.langOption, locale === 'en' && styles.langActive]}>
                <Text style={[styles.langText, locale === 'en' && styles.langTextActive]}>EN</Text>
              </View>
              <View style={[styles.langOption, locale === 'de' && styles.langActive]}>
                <Text style={[styles.langText, locale === 'de' && styles.langTextActive]}>DE</Text>
              </View>
            </Pressable>
          </View>
        </GlassCard>

        {/* Graduate button */}
        <GlassCard style={styles.graduateCard}>
          <Text style={styles.graduateEmoji}>🎓</Text>
          <Text style={styles.graduateTitle}>{t('profile.graduate')}</Text>
          <Text style={styles.graduateDesc}>{t('profile.graduateDesc')}</Text>
          <Pressable onPress={handleGraduate} style={styles.graduateButton}>
            <Text style={styles.graduateButtonText}>{t('profile.graduate')}</Text>
          </Pressable>
        </GlassCard>

        {/* Reset */}
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>{t('profile.resetProgress')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: '#171717', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#171717', letterSpacing: -0.3, marginBottom: 12, marginTop: 8 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  achievementCard: { width: '47%', alignItems: 'center', paddingVertical: 16 },
  achievementLocked: { opacity: 0.4 },
  achievementIcon: { fontSize: 32, marginBottom: 8 },
  achievementTitle: { fontSize: 14, fontWeight: '600', color: '#171717', textAlign: 'center' },
  achievementDesc: { fontSize: 12, color: '#737373', textAlign: 'center', marginTop: 4 },
  achievementStatus: { fontSize: 11, fontWeight: '600', color: '#E8435A', marginTop: 8 },
  lockedText: { color: '#A3A3A3' },
  settingCard: { marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLabel: { fontSize: 17, fontWeight: '500', color: '#171717' },
  languageToggle: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: 3 },
  langOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  langActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  langText: { fontSize: 14, fontWeight: '600', color: '#A3A3A3' },
  langTextActive: { color: '#171717' },
  graduateCard: { marginBottom: 20, alignItems: 'center', paddingVertical: 24 },
  graduateEmoji: { fontSize: 48, marginBottom: 12 },
  graduateTitle: { fontSize: 22, fontWeight: '700', color: '#171717', letterSpacing: -0.3 },
  graduateDesc: { fontSize: 14, color: '#737373', textAlign: 'center', marginTop: 6, marginBottom: 16, paddingHorizontal: 16 },
  graduateButton: {
    backgroundColor: '#E8435A', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 14,
  },
  graduateButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  resetButton: { alignItems: 'center', paddingVertical: 16 },
  resetText: { fontSize: 15, color: '#A3A3A3', fontWeight: '500' },
});
