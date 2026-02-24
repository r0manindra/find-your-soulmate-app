import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { achievements } from '@/src/data/content/achievements';
import * as api from '@/src/services/api';
import { logoutRevenueCat } from '@/src/services/purchases';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const progress = useProgressStore();
  const { locale, setLocale } = useSettingsStore();
  const { user, isLoggedIn, isPremium, logout } = useAuthStore();
  const userProfile = useUserProfileStore();
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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

  const handleLogout = () => {
    Alert.alert(
      locale === 'de' ? 'Abmelden' : 'Sign Out',
      locale === 'de' ? 'Möchtest du dich wirklich abmelden?' : 'Are you sure you want to sign out?',
      [
        { text: locale === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
        {
          text: locale === 'de' ? 'Abmelden' : 'Sign Out',
          style: 'destructive',
          onPress: () => {
            api.clearToken();
            logoutRevenueCat().catch(() => {});
            logout();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
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

  const handleDownloadPdf = async () => {
    if (!isPremium) {
      router.push('/paywall');
      return;
    }
    setDownloadingPdf(true);
    try {
      // Open PDF URL in browser — backend serves the PDF directly
      const token = await api.getToken?.() ?? '';
      const baseUrl = __DEV__ ? 'http://localhost:3000/api' : 'https://find-your-soulmate-app-production.up.railway.app/api';
      await Linking.openURL(`${baseUrl}/pdf/guide?token=${token}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Error', locale === 'de' ? 'PDF konnte nicht geladen werden' : 'Could not download PDF');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('profile.title')}</Text>

        {/* Auth Section */}
        {isLoggedIn ? (
          <GlassCard style={styles.authCard}>
            <View style={styles.authRow}>
              <LinearGradient
                colors={['#E8435A', '#FF7854']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.authAvatar}
              >
                <Text style={styles.authAvatarText}>
                  {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <View style={styles.authInfo}>
                {user?.name ? <Text style={styles.authName}>{user.name}</Text> : null}
                <Text style={styles.authEmail}>{user?.email}</Text>
                <View style={styles.subscriptionBadge}>
                  <Ionicons
                    name={isPremium ? 'diamond' : 'person'}
                    size={12}
                    color={isPremium ? '#E8435A' : '#737373'}
                  />
                  <Text style={[styles.subscriptionText, isPremium && styles.premiumText]}>
                    {isPremium
                      ? (locale === 'de' ? 'Premium' : 'Premium')
                      : (locale === 'de' ? 'Kostenlos' : 'Free')}
                  </Text>
                </View>
              </View>
            </View>
            {!isPremium && (
              <Pressable onPress={() => router.push('/paywall')} style={styles.upgradeRow}>
                <Ionicons name="sparkles" size={16} color="#E8435A" />
                <Text style={styles.upgradeText}>
                  {locale === 'de' ? 'Auf Premium upgraden' : 'Upgrade to Premium'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#E8435A" />
              </Pressable>
            )}
            <Pressable onPress={handleLogout} style={styles.logoutRow}>
              <Ionicons name="log-out-outline" size={18} color="#A3A3A3" />
              <Text style={styles.logoutText}>
                {locale === 'de' ? 'Abmelden' : 'Sign Out'}
              </Text>
            </Pressable>
          </GlassCard>
        ) : (
          <GlassCard style={styles.authCard}>
            <View style={styles.signInPrompt}>
              <Ionicons name="person-circle-outline" size={48} color="#D4D4D4" />
              <Text style={styles.signInTitle}>
                {locale === 'de' ? 'Anmelden' : 'Sign In'}
              </Text>
              <Text style={styles.signInDesc}>
                {locale === 'de'
                  ? 'Melde dich an, um deinen Fortschritt zu speichern und den AI Coach zu nutzen'
                  : 'Sign in to save your progress and use the AI Coach'}
              </Text>
              <View style={styles.authButtons}>
                <BrandButton
                  title={locale === 'de' ? 'Registrieren' : 'Create Account'}
                  onPress={() => router.push('/auth/register')}
                />
                <Pressable onPress={() => router.push('/auth/login')} style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>
                    {locale === 'de' ? 'Einloggen' : 'Sign In'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Premium PDF Download */}
        <GlassCard style={styles.pdfCard}>
          <View style={styles.pdfRow}>
            <View style={styles.pdfIconContainer}>
              <Ionicons name="document-text" size={24} color="#E8435A" />
            </View>
            <View style={styles.pdfInfo}>
              <Text style={styles.pdfTitle}>
                {locale === 'de' ? 'Premium PDF Guide' : 'Premium PDF Guide'}
              </Text>
              <Text style={styles.pdfDesc}>
                {locale === 'de'
                  ? 'Lade den kompletten Guide als PDF herunter'
                  : 'Download the complete guide as a PDF'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={handleDownloadPdf}
            style={[styles.pdfButton, !isPremium && styles.pdfButtonLocked]}
            disabled={downloadingPdf}
          >
            <Ionicons
              name={isPremium ? 'download-outline' : 'lock-closed'}
              size={16}
              color={isPremium ? '#fff' : '#A3A3A3'}
            />
            <Text style={[styles.pdfButtonText, !isPremium && styles.pdfButtonTextLocked]}>
              {downloadingPdf
                ? (locale === 'de' ? 'Wird geladen...' : 'Loading...')
                : isPremium
                  ? (locale === 'de' ? 'Herunterladen' : 'Download')
                  : (locale === 'de' ? 'Premium erforderlich' : 'Premium Required')}
            </Text>
          </Pressable>
        </GlassCard>

        {/* Charismo Profile */}
        {userProfile.hasCompletedOnboarding && userProfile.socialEnergy && (
          <>
            <Text style={styles.sectionTitle}>{t('onboarding.profile.title')}</Text>
            <GlassCard style={styles.charismoCard}>
              <View style={styles.charismoGrid}>
                <View style={styles.charismoItem}>
                  <Text style={styles.charismoLabel}>{t('onboarding.profile.socialEnergy')}</Text>
                  <Text style={styles.charismoValue}>
                    {t(`onboarding.profile.labels.${userProfile.socialEnergy}`)}
                  </Text>
                </View>
                {userProfile.basicsLevel && (
                  <View style={styles.charismoItem}>
                    <Text style={styles.charismoLabel}>{t('onboarding.profile.basicsLevel')}</Text>
                    <Text style={styles.charismoValue}>
                      {t(`onboarding.profile.labels.${userProfile.basicsLevel}`)}
                    </Text>
                  </View>
                )}
                {userProfile.skillLevel && (
                  <View style={styles.charismoItem}>
                    <Text style={styles.charismoLabel}>{t('onboarding.profile.skillLevel')}</Text>
                    <Text style={styles.charismoValue}>
                      {t(`onboarding.profile.labels.${userProfile.skillLevel}`)}
                    </Text>
                  </View>
                )}
                {userProfile.goal && (
                  <View style={styles.charismoItem}>
                    <Text style={styles.charismoLabel}>{t('onboarding.profile.goal')}</Text>
                    <Text style={styles.charismoValue}>
                      {t(`onboarding.profile.labels.${userProfile.goal}`)}
                    </Text>
                  </View>
                )}
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  userProfile.resetProfile();
                  router.replace('/onboarding');
                }}
                style={styles.retakeButton}
              >
                <Ionicons name="refresh" size={16} color="#E8435A" />
                <Text style={styles.retakeText}>{t('onboarding.profile.retakeQuiz')}</Text>
              </Pressable>
            </GlassCard>
          </>
        )}

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
          <Ionicons name="school" size={48} color="#E8435A" />
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

  // Auth
  authCard: { marginBottom: 16 },
  authRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  authAvatar: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  authAvatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  authInfo: { flex: 1 },
  authName: { fontSize: 18, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  authEmail: { fontSize: 14, color: '#737373', marginTop: 1 },
  subscriptionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4,
  },
  subscriptionText: { fontSize: 12, fontWeight: '600', color: '#737373' },
  premiumText: { color: '#E8435A' },
  upgradeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 14, paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  upgradeText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#E8435A' },
  logoutRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 12, paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  logoutText: { fontSize: 15, color: '#A3A3A3', fontWeight: '500' },
  signInPrompt: { alignItems: 'center', paddingVertical: 8 },
  signInTitle: { fontSize: 20, fontWeight: '700', color: '#171717', marginTop: 12 },
  signInDesc: { fontSize: 14, color: '#737373', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  authButtons: { width: '100%', gap: 10 },
  loginButton: { alignItems: 'center', paddingVertical: 12 },
  loginButtonText: { fontSize: 16, fontWeight: '600', color: '#E8435A' },

  // PDF
  pdfCard: { marginBottom: 24 },
  pdfRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  pdfIconContainer: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  pdfInfo: { flex: 1 },
  pdfTitle: { fontSize: 17, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  pdfDesc: { fontSize: 13, color: '#737373', marginTop: 2 },
  pdfButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#E8435A', paddingVertical: 12, borderRadius: 12,
  },
  pdfButtonLocked: { backgroundColor: 'rgba(0,0,0,0.04)' },
  pdfButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  pdfButtonTextLocked: { color: '#A3A3A3' },

  // Charismo Profile
  charismoCard: { marginBottom: 24 },
  charismoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14,
  },
  charismoItem: {
    backgroundColor: 'rgba(232,67,90,0.04)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, minWidth: '45%',
  },
  charismoLabel: { fontSize: 11, fontWeight: '700', color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.5 },
  charismoValue: { fontSize: 15, fontWeight: '600', color: '#171717', marginTop: 3 },
  retakeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)',
    marginTop: 2,
  },
  retakeText: { fontSize: 15, fontWeight: '600', color: '#E8435A' },

  // Section title
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#171717', letterSpacing: -0.3, marginBottom: 12, marginTop: 8 },

  // Achievements
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  achievementCard: { width: '47%', alignItems: 'center', paddingVertical: 16 },
  achievementLocked: { opacity: 0.4 },
  achievementIcon: { fontSize: 32, marginBottom: 8 },
  achievementTitle: { fontSize: 14, fontWeight: '600', color: '#171717', textAlign: 'center' },
  achievementDesc: { fontSize: 12, color: '#737373', textAlign: 'center', marginTop: 4 },
  achievementStatus: { fontSize: 11, fontWeight: '600', color: '#E8435A', marginTop: 8 },
  lockedText: { color: '#A3A3A3' },

  // Settings
  settingCard: { marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLabel: { fontSize: 17, fontWeight: '500', color: '#171717' },
  languageToggle: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: 3 },
  langOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  langActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  langText: { fontSize: 14, fontWeight: '600', color: '#A3A3A3' },
  langTextActive: { color: '#171717' },

  // Graduate
  graduateCard: { marginBottom: 20, alignItems: 'center', paddingVertical: 24 },
  graduateTitle: { fontSize: 22, fontWeight: '700', color: '#171717', letterSpacing: -0.3, marginTop: 12 },
  graduateDesc: { fontSize: 14, color: '#737373', textAlign: 'center', marginTop: 6, marginBottom: 16, paddingHorizontal: 16 },
  graduateButton: {
    backgroundColor: '#E8435A', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 14,
  },
  graduateButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  // Reset
  resetButton: { alignItems: 'center', paddingVertical: 16 },
  resetText: { fontSize: 15, color: '#A3A3A3', fontWeight: '500' },
});
