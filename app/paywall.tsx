import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import * as purchases from '@/src/services/purchases';
import type { TieredOfferings } from '@/src/services/purchases';

type BillingPeriod = 'monthly' | 'yearly';
type Tier = 'pro' | 'pro_plus';

const PRO_FEATURES = {
  en: [
    { icon: 'book' as const, text: 'All 20 chapters' },
    { icon: 'chatbubbles' as const, text: 'Unlimited AI coach' },
    { icon: 'people' as const, text: 'All coach characters' },
    { icon: 'flash' as const, text: 'All exercise modes' },
  ],
  de: [
    { icon: 'book' as const, text: 'Alle 20 Kapitel' },
    { icon: 'chatbubbles' as const, text: 'Unbegrenzter KI-Coach' },
    { icon: 'people' as const, text: 'Alle Coach-Charaktere' },
    { icon: 'flash' as const, text: 'Alle Übungsmodi' },
  ],
};

const PRO_PLUS_EXTRAS = {
  en: [
    { icon: 'mic' as const, text: 'Real-time voice coaching' },
    { icon: 'call' as const, text: '3 voice sessions/day' },
  ],
  de: [
    { icon: 'mic' as const, text: 'Echtzeit-Sprach-Coaching' },
    { icon: 'call' as const, text: '3 Sprach-Sitzungen/Tag' },
  ],
};

export default function PaywallScreen() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const locale = useSettingsStore((s) => s.locale);
  const [selectedTier, setSelectedTier] = useState<Tier>('pro_plus');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [offerings, setOfferings] = useState<TieredOfferings | null>(null);

  useEffect(() => {
    purchases.getOfferings().then((o) => {
      if (o) setOfferings(o);
    }).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isLoggedIn) {
      router.push('/auth/register');
      return;
    }

    setLoading(true);
    try {
      let pkg = null;
      if (selectedTier === 'pro_plus') {
        pkg = billingPeriod === 'yearly' ? offerings?.proPlusAnnual : offerings?.proPlusMonthly;
      } else {
        pkg = billingPeriod === 'yearly' ? offerings?.proAnnual : offerings?.proMonthly;
      }

      if (pkg) {
        const result = await purchases.purchasePackage(pkg);
        if (result) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
          return;
        }
      } else {
        Alert.alert(
          locale === 'de' ? 'Bald verfügbar' : 'Coming Soon',
          locale === 'de'
            ? 'In-App-Käufe werden bald aktiviert. Bitte versuche es später erneut.'
            : 'In-app purchases will be activated soon. Please try again later.'
        );
      }
    } catch (e: any) {
      Alert.alert(
        locale === 'de' ? 'Fehler' : 'Error',
        e.message || (locale === 'de' ? 'Kauf fehlgeschlagen' : 'Purchase failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      const restored = await purchases.restorePurchases();
      if (restored) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          locale === 'de' ? 'Wiederhergestellt!' : 'Restored!',
          locale === 'de'
            ? 'Dein Zugang wurde wiederhergestellt.'
            : 'Your subscription has been restored.'
        );
        router.back();
      } else {
        Alert.alert(
          locale === 'de' ? 'Kein Abo gefunden' : 'No Subscription Found',
          locale === 'de'
            ? 'Es wurden keine aktiven Abonnements gefunden.'
            : 'No active subscriptions were found for your account.'
        );
      }
    } catch {
      Alert.alert(
        locale === 'de' ? 'Fehler' : 'Error',
        locale === 'de' ? 'Wiederherstellung fehlgeschlagen' : 'Restore failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectTier = (tier: Tier) => {
    Haptics.selectionAsync();
    setSelectedTier(tier);
  };

  const toggleBilling = (period: BillingPeriod) => {
    Haptics.selectionAsync();
    setBillingPeriod(period);
  };

  const proPrice = billingPeriod === 'yearly' ? '$49.99' : '$6.99';
  const proPlusPrice = billingPeriod === 'yearly' ? '$69.99' : '$9.99';
  const proPeriod = billingPeriod === 'yearly'
    ? (locale === 'de' ? '/Jahr' : '/year')
    : (locale === 'de' ? '/Monat' : '/month');
  const proMonthlyEquiv = billingPeriod === 'yearly'
    ? `$4.17/${locale === 'de' ? 'Monat' : 'mo'}`
    : null;
  const proPlusMonthlyEquiv = billingPeriod === 'yearly'
    ? `$5.83/${locale === 'de' ? 'Monat' : 'mo'}`
    : null;

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Close button */}
        <Pressable onPress={() => router.back()} style={[styles.closeButton, isDark && styles.closeButtonDark]}>
          <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
        </Pressable>

        {/* Hero */}
        <LinearGradient
          colors={['#E8435A', '#FF7854']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Ionicons name="diamond" size={44} color="#fff" />
          <Text style={styles.heroTitle}>
            {locale === 'de' ? 'Level Up' : 'Upgrade Your Game'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {locale === 'de'
              ? 'Wähle den Plan, der zu dir passt'
              : 'Choose the plan that fits your goals'}
          </Text>
        </LinearGradient>

        {/* Billing toggle */}
        <View style={[styles.billingToggle, isDark && styles.billingToggleDark]}>
          <Pressable
            onPress={() => toggleBilling('monthly')}
            style={[styles.billingOption, billingPeriod === 'monthly' && styles.billingOptionActive]}
          >
            <Text style={[
              styles.billingText,
              isDark && styles.billingTextDark,
              billingPeriod === 'monthly' && styles.billingTextActive,
            ]}>
              {locale === 'de' ? 'Monatlich' : 'Monthly'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => toggleBilling('yearly')}
            style={[styles.billingOption, billingPeriod === 'yearly' && styles.billingOptionActive]}
          >
            <Text style={[
              styles.billingText,
              isDark && styles.billingTextDark,
              billingPeriod === 'yearly' && styles.billingTextActive,
            ]}>
              {locale === 'de' ? 'Jährlich' : 'Yearly'}
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>
                {locale === 'de' ? '-40%' : 'SAVE 40%'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Tier cards */}
        <View style={styles.tierCards}>
          {/* Pro Card */}
          <Pressable onPress={() => selectTier('pro')}>
            <View style={[
              styles.tierCard,
              isDark && styles.tierCardDark,
              selectedTier === 'pro' && styles.tierCardSelected,
            ]}>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={[styles.tierName, isDark && styles.tierNameDark]}>Pro</Text>
                  <View style={[styles.tierRadio, selectedTier === 'pro' && styles.tierRadioSelected]}>
                    {selectedTier === 'pro' && <View style={styles.tierRadioDot} />}
                  </View>
                </View>
                <View style={styles.tierPriceRow}>
                  <Text style={[styles.tierPrice, isDark && styles.tierPriceDark]}>
                    {proPrice}{proPeriod}
                  </Text>
                  {proMonthlyEquiv && (
                    <Text style={[styles.tierPriceEquiv, isDark && styles.tierPriceEquivDark]}>
                      {proMonthlyEquiv}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.tierFeatures}>
                {PRO_FEATURES[locale].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                    <Text style={[styles.featureText, isDark && styles.featureTextDark]}>{f.text}</Text>
                  </View>
                ))}
                <View style={styles.featureRow}>
                  <Ionicons name="close-circle" size={18} color="#D4D4D4" />
                  <Text style={[styles.featureTextDisabled, isDark && styles.featureTextDisabledDark]}>
                    {locale === 'de' ? 'Kein Sprach-Coaching' : 'No voice coaching'}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Pro+ Card */}
          <Pressable onPress={() => selectTier('pro_plus')}>
            <View style={[
              styles.tierCard,
              isDark && styles.tierCardDark,
              selectedTier === 'pro_plus' && styles.tierCardSelected,
            ]}>
              {/* Recommended badge */}
              <View style={styles.recommendedBadge}>
                <Ionicons name="star" size={11} color="#fff" />
                <Text style={styles.recommendedText}>
                  {locale === 'de' ? 'EMPFOHLEN' : 'RECOMMENDED'}
                </Text>
              </View>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={[styles.tierName, isDark && styles.tierNameDark]}>Pro+</Text>
                  <View style={[styles.tierRadio, selectedTier === 'pro_plus' && styles.tierRadioSelected]}>
                    {selectedTier === 'pro_plus' && <View style={styles.tierRadioDot} />}
                  </View>
                </View>
                <View style={styles.tierPriceRow}>
                  <Text style={[styles.tierPrice, isDark && styles.tierPriceDark]}>
                    {proPlusPrice}{proPeriod}
                  </Text>
                  {proPlusMonthlyEquiv && (
                    <Text style={[styles.tierPriceEquiv, isDark && styles.tierPriceEquivDark]}>
                      {proPlusMonthlyEquiv}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.tierFeatures}>
                {PRO_FEATURES[locale].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                    <Text style={[styles.featureText, isDark && styles.featureTextDark]}>{f.text}</Text>
                  </View>
                ))}
                {PRO_PLUS_EXTRAS[locale].map((f, i) => (
                  <View key={`extra-${i}`} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#E8435A" />
                    <Text style={[styles.featureText, styles.featureTextHighlight]}>{f.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <BrandButton
            title={
              loading
                ? (locale === 'de' ? 'Wird geladen...' : 'Loading...')
                : (locale === 'de' ? 'Kostenlos testen' : 'Start Free Trial')
            }
            onPress={handleSubscribe}
            disabled={loading}
          />
          <Text style={[styles.trialNote, isDark && styles.trialNoteDark]}>
            {locale === 'de'
              ? '7 Tage kostenlos testen. Jederzeit kündbar.'
              : '7-day free trial. Cancel anytime.'}
          </Text>
          <Text style={[styles.terms, isDark && styles.termsDark]}>
            {locale === 'de'
              ? 'Die Zahlung wird nach Ablauf der Testphase über deinen App Store Account abgerechnet. Das Abo verlängert sich automatisch, sofern es nicht mindestens 24 Stunden vor Ende der aktuellen Laufzeit gekündigt wird.'
              : 'Payment will be charged to your App Store account after the trial period. Subscription renews automatically unless cancelled at least 24 hours before the end of the current period.'}
          </Text>
        </View>

        {/* Restore */}
        <Pressable onPress={handleRestore} style={styles.restoreButton} disabled={loading}>
          <Text style={[styles.restoreText, isDark && styles.restoreTextDark]}>
            {locale === 'de' ? 'Käufe wiederherstellen' : 'Restore Purchases'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  content: { padding: 20, paddingBottom: 40 },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-end', marginBottom: 8,
  },
  closeButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  hero: {
    borderRadius: 24, padding: 28,
    alignItems: 'center', marginBottom: 20,
  },
  heroTitle: {
    fontSize: 30, fontWeight: '800', color: '#fff',
    letterSpacing: -0.5, marginTop: 12, marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 21,
  },

  // Billing toggle
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 14, padding: 4,
    marginBottom: 16,
  },
  billingToggleDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  billingOption: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 11,
  },
  billingOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  billingText: {
    fontSize: 14, fontWeight: '600', color: '#737373',
  },
  billingTextDark: { color: '#A3A3A3' },
  billingTextActive: { color: '#171717' },
  saveBadge: {
    backgroundColor: '#E8435A',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  saveText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  // Tier cards
  tierCards: { gap: 12, marginBottom: 20 },
  tierCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  tierCardDark: {
    backgroundColor: '#252525',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tierCardSelected: {
    borderColor: '#E8435A',
  },
  recommendedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#E8435A',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    marginBottom: 10,
  },
  recommendedText: {
    fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.5,
  },
  tierHeader: { marginBottom: 14 },
  tierTitleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierName: { fontSize: 22, fontWeight: '800', color: '#171717', letterSpacing: -0.3 },
  tierNameDark: { color: '#F5F5F5' },
  tierRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D4D4D4',
    alignItems: 'center', justifyContent: 'center',
  },
  tierRadioSelected: { borderColor: '#E8435A' },
  tierRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E8435A' },
  tierPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  tierPrice: { fontSize: 18, fontWeight: '700', color: '#525252' },
  tierPriceDark: { color: '#D4D4D4' },
  tierPriceEquiv: { fontSize: 13, color: '#737373' },
  tierPriceEquivDark: { color: '#A3A3A3' },
  tierFeatures: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, color: '#525252' },
  featureTextDark: { color: '#D4D4D4' },
  featureTextHighlight: { fontSize: 14, fontWeight: '600', color: '#E8435A' },
  featureTextDisabled: { fontSize: 14, color: '#A3A3A3' },
  featureTextDisabledDark: { color: '#525252' },

  // CTA
  ctaContainer: { gap: 8, marginBottom: 16 },
  trialNote: {
    fontSize: 14, fontWeight: '600', color: '#171717',
    textAlign: 'center',
  },
  trialNoteDark: { color: '#F5F5F5' },
  terms: {
    fontSize: 11, color: '#A3A3A3', textAlign: 'center',
    lineHeight: 16, paddingHorizontal: 16,
  },
  termsDark: { color: '#737373' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: 12 },
  restoreText: { fontSize: 14, color: '#A3A3A3', fontWeight: '500' },
  restoreTextDark: { color: '#737373' },
});
