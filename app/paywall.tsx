import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { LiquidGlassIconButton } from '@/src/presentation/components/ui/liquid-glass-icon-button';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import * as purchases from '@/src/services/purchases';
import type { TieredOfferings } from '@/src/services/purchases';

type SelectedPlan = 'pro_monthly' | 'pro_plus_annual';
type PaywallTrigger = 'character' | 'exercise' | 'hearts' | 'chapter' | 'habits' | 'general';

const PRO_MONTHLY_FEATURES = {
  en: [
    { icon: 'heart' as const, text: '15 hearts/day (refreshed daily)', highlight: true },
    { icon: 'people' as const, text: 'All coach characters' },
    { icon: 'flash' as const, text: 'All exercise modes (incl. Reply Helper)' },
    { icon: 'checkmark-done' as const, text: 'Unlimited habit tracking' },
  ],
  de: [
    { icon: 'heart' as const, text: '15 Herzen/Tag (täglich erneuert)', highlight: true },
    { icon: 'people' as const, text: 'Alle Coach-Charaktere' },
    { icon: 'flash' as const, text: 'Alle Übungsmodi (inkl. Antwort-Helfer)' },
    { icon: 'checkmark-done' as const, text: 'Unbegrenztes Habit-Tracking' },
  ],
};

const PRO_PLUS_ANNUAL_FEATURES = {
  en: [
    { icon: 'heart' as const, text: '25 hearts/day (refreshed daily)', highlight: true },
    { icon: 'people' as const, text: 'All coach characters' },
    { icon: 'flash' as const, text: 'All exercise modes (incl. Reply Helper)' },
    { icon: 'checkmark-done' as const, text: 'Unlimited habit tracking' },
    { icon: 'book' as const, text: 'All chapters unlocked', highlight: true },
  ],
  de: [
    { icon: 'heart' as const, text: '25 Herzen/Tag (täglich erneuert)', highlight: true },
    { icon: 'people' as const, text: 'Alle Coach-Charaktere' },
    { icon: 'flash' as const, text: 'Alle Übungsmodi (inkl. Antwort-Helfer)' },
    { icon: 'checkmark-done' as const, text: 'Unbegrenztes Habit-Tracking' },
    { icon: 'book' as const, text: 'Alle Kapitel freigeschaltet', highlight: true },
  ],
};

const HERO_TEXT: Record<PaywallTrigger, { en: { title: string; subtitle: string }; de: { title: string; subtitle: string } }> = {
  character: {
    en: { title: 'Unlock All Characters', subtitle: 'Get access to all AI coach personalities with a subscription' },
    de: { title: 'Alle Charaktere freischalten', subtitle: 'Erhalte Zugang zu allen KI-Coach-Persönlichkeiten mit einem Abo' },
  },
  exercise: {
    en: { title: 'Unlock All Exercises', subtitle: 'Practice with every exercise mode including Reply Helper' },
    de: { title: 'Alle Übungen freischalten', subtitle: 'Übe mit allen Übungsmodi inkl. Antwort-Helfer' },
  },
  hearts: {
    en: { title: 'Need More Hearts?', subtitle: 'Hearts power your coaching, chapters, and exercises' },
    de: { title: 'Mehr Herzen nötig?', subtitle: 'Herzen sind deine Währung für Coaching, Kapitel und Übungen' },
  },
  chapter: {
    en: { title: 'Unlock All Chapters', subtitle: 'Read every chapter without spending hearts' },
    de: { title: 'Alle Kapitel freischalten', subtitle: 'Lies alle Kapitel ohne Herzen auszugeben' },
  },
  habits: {
    en: { title: 'Unlimited Habits', subtitle: 'Track as many habits as you want with Pro' },
    de: { title: 'Unbegrenzte Habits', subtitle: 'Tracke so viele Gewohnheiten wie du willst mit Pro' },
  },
  general: {
    en: { title: 'Level Up Your Game', subtitle: 'More hearts, all characters, and premium features' },
    de: { title: 'Level Up dein Game', subtitle: 'Mehr Herzen, alle Charaktere und Premium-Features' },
  },
};

function getTriggerDefault(trigger: PaywallTrigger): SelectedPlan {
  // Chapter triggers suggest Pro+ (includes all chapters), others default to monthly
  if (trigger === 'chapter') return 'pro_plus_annual';
  if (trigger === 'character' || trigger === 'exercise' || trigger === 'habits') return 'pro_monthly';
  return 'pro_plus_annual';
}

export default function PaywallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trigger?: string }>();
  const trigger = (params.trigger as PaywallTrigger) || 'general';
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const locale = useSettingsStore((s) => s.locale);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>(getTriggerDefault(trigger));
  const [loading, setLoading] = useState(false);
  const [oneTimeLoading, setOneTimeLoading] = useState<string | null>(null);
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
      const pkg = selectedPlan === 'pro_plus_annual'
        ? offerings?.proPlusAnnual
        : offerings?.proMonthly;

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

  const handleOneTimePurchase = async (type: 'hearts' | 'chapters') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isLoggedIn) {
      router.push('/auth/register');
      return;
    }
    setOneTimeLoading(type);
    try {
      let success = false;
      if (type === 'hearts') success = await purchases.purchaseHeartPack();
      else if (type === 'chapters') success = await purchases.purchaseChapterUnlock();

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          locale === 'de' ? 'Gekauft!' : 'Purchased!',
          locale === 'de' ? 'Dein Kauf war erfolgreich.' : 'Your purchase was successful.'
        );
      }
    } catch (e: any) {
      Alert.alert(
        locale === 'de' ? 'Fehler' : 'Error',
        e.message || (locale === 'de' ? 'Kauf fehlgeschlagen' : 'Purchase failed')
      );
    } finally {
      setOneTimeLoading(null);
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

  const heroContent = HERO_TEXT[trigger]?.[locale] ?? HERO_TEXT.general[locale];
  const proMonthlyPrice = offerings?.proMonthly?.product.priceString ?? '7.99 €';
  const proPlusAnnualPrice = offerings?.proPlusAnnual?.product.priceString ?? '49.99 €';
  const proPlusMonthlyEquiv = offerings?.proPlusAnnual
    ? `${(offerings.proPlusAnnual.product.price / 12).toFixed(2)} ${offerings.proPlusAnnual.product.currencyCode}/${locale === 'de' ? 'Monat' : 'mo'}`
    : `4.17 €/${locale === 'de' ? 'Monat' : 'mo'}`;

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: 70 }]} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['#E8435A', '#FF7854']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Ionicons name={trigger === 'hearts' ? 'heart' : trigger === 'character' ? 'people' : trigger === 'chapter' ? 'book' : 'diamond'} size={44} color="#fff" />
          <Text style={styles.heroTitle}>{heroContent.title}</Text>
          <Text style={styles.heroSubtitle}>{heroContent.subtitle}</Text>
        </LinearGradient>

        {/* Subscription cards */}
        <View style={styles.tierCards}>
          {/* Monthly PRO */}
          <Pressable onPress={() => { Haptics.selectionAsync(); setSelectedPlan('pro_monthly'); }}>
            <View style={[
              styles.tierCard,
              isDark && styles.tierCardDark,
              selectedPlan === 'pro_monthly' && styles.tierCardSelected,
            ]}>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={[styles.tierName, isDark && styles.tierNameDark]}>
                    {locale === 'de' ? 'Monatlich PRO' : 'Monthly PRO'}
                  </Text>
                  <View style={[styles.tierRadio, selectedPlan === 'pro_monthly' && styles.tierRadioSelected]}>
                    {selectedPlan === 'pro_monthly' && <View style={styles.tierRadioDot} />}
                  </View>
                </View>
                <Text style={[styles.tierPrice, isDark && styles.tierPriceDark]}>
                  {proMonthlyPrice}/{locale === 'de' ? 'Monat' : 'month'}
                </Text>
              </View>
              <View style={styles.tierFeatures}>
                {PRO_MONTHLY_FEATURES[locale].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={(f as any).highlight ? '#E8435A' : '#22C55E'} />
                    <Text style={[
                      styles.featureText,
                      isDark && styles.featureTextDark,
                      (f as any).highlight && styles.featureTextHighlight,
                    ]}>{f.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>

          {/* Annual PRO+ */}
          <Pressable onPress={() => { Haptics.selectionAsync(); setSelectedPlan('pro_plus_annual'); }}>
            <View style={[
              styles.tierCard,
              isDark && styles.tierCardDark,
              selectedPlan === 'pro_plus_annual' && styles.tierCardSelected,
            ]}>
              <View style={styles.bestValueBadge}>
                <Ionicons name="star" size={11} color="#fff" />
                <Text style={styles.bestValueText}>
                  {locale === 'de' ? 'BESTER WERT' : 'BEST VALUE'}
                </Text>
              </View>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={[styles.tierName, isDark && styles.tierNameDark]}>
                    {locale === 'de' ? 'Jährlich PRO+' : 'Annual PRO+'}
                  </Text>
                  <View style={[styles.tierRadio, selectedPlan === 'pro_plus_annual' && styles.tierRadioSelected]}>
                    {selectedPlan === 'pro_plus_annual' && <View style={styles.tierRadioDot} />}
                  </View>
                </View>
                <View style={styles.tierPriceRow}>
                  <Text style={[styles.tierPrice, isDark && styles.tierPriceDark]}>
                    {proPlusAnnualPrice}/{locale === 'de' ? 'Jahr' : 'year'}
                  </Text>
                  <Text style={[styles.tierPriceEquiv, isDark && styles.tierPriceEquivDark]}>
                    {proPlusMonthlyEquiv}
                  </Text>
                </View>
              </View>
              <View style={styles.tierFeatures}>
                {PRO_PLUS_ANNUAL_FEATURES[locale].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={(f as any).highlight ? '#E8435A' : '#22C55E'} />
                    <Text style={[
                      styles.featureText,
                      isDark && styles.featureTextDark,
                      (f as any).highlight && styles.featureTextHighlight,
                    ]}>{f.text}</Text>
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
                : (locale === 'de' ? 'Jetzt abonnieren' : 'Subscribe Now')
            }
            onPress={handleSubscribe}
            disabled={loading}
          />
          <Text style={[styles.terms, isDark && styles.termsDark]}>
            {locale === 'de'
              ? 'Die Zahlung wird über deinen App Store Account abgerechnet. Das Abo verlängert sich automatisch, sofern es nicht mindestens 24 Stunden vor Ende der aktuellen Laufzeit gekündigt wird.'
              : 'Payment will be charged to your App Store account. Subscription renews automatically unless cancelled at least 24 hours before the end of the current period.'}
          </Text>
        </View>

        {/* One-Time Purchases */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {locale === 'de' ? 'Einmalkäufe' : 'One-Time Purchases'}
        </Text>

        <View style={styles.oneTimeCards}>
          {/* Unlock All Chapters */}
          <Pressable
            onPress={() => handleOneTimePurchase('chapters')}
            disabled={oneTimeLoading === 'chapters'}
            style={[styles.oneTimeCard, isDark && styles.oneTimeCardDark]}
          >
            <View style={[styles.oneTimeIcon, { backgroundColor: 'rgba(14,165,233,0.08)' }]}>
              <Ionicons name="book" size={22} color="#0EA5E9" />
            </View>
            <View style={styles.oneTimeInfo}>
              <Text style={[styles.oneTimeName, isDark && styles.oneTimeNameDark]}>
                {locale === 'de' ? 'Alle Kapitel freischalten' : 'Unlock All Chapters'}
              </Text>
              <Text style={styles.oneTimeDesc}>
                {locale === 'de' ? 'Kapitel lesen ohne Herzen' : 'Read chapters without spending hearts'}
              </Text>
            </View>
            <Text style={[styles.oneTimePrice, isDark && styles.oneTimePriceDark]}>~6.99 €</Text>
          </Pressable>

          {/* Heart Pack — 10 hearts */}
          <Pressable
            onPress={() => handleOneTimePurchase('hearts')}
            disabled={oneTimeLoading === 'hearts'}
            style={[styles.oneTimeCard, isDark && styles.oneTimeCardDark]}
          >
            <View style={[styles.oneTimeIcon, { backgroundColor: 'rgba(232,67,90,0.08)' }]}>
              <Ionicons name="heart" size={22} color="#E8435A" />
            </View>
            <View style={styles.oneTimeInfo}>
              <Text style={[styles.oneTimeName, isDark && styles.oneTimeNameDark]}>
                {locale === 'de' ? '+ 10 Herzen' : '+ 10 Hearts'}
              </Text>
              <Text style={styles.oneTimeDesc}>
                {locale === 'de' ? 'Bonus-Herzen, verfallen nicht' : 'Bonus hearts, never expire'}
              </Text>
            </View>
            <Text style={[styles.oneTimePrice, isDark && styles.oneTimePriceDark]}>~2.99 €</Text>
          </Pressable>
        </View>

        {/* Restore */}
        <Pressable onPress={handleRestore} style={styles.restoreButton} disabled={loading}>
          <Text style={[styles.restoreText, isDark && styles.restoreTextDark]}>
            {locale === 'de' ? 'Käufe wiederherstellen' : 'Restore Purchases'}
          </Text>
        </Pressable>
      </ScrollView>
      <View style={styles.floatingClose}>
        <LiquidGlassIconButton
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          icon="close"
          size={42}
          iconSize={22}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  content: { padding: 20, paddingBottom: 40 },
  floatingClose: { position: 'absolute', top: 8, right: 20, zIndex: 10 },
  hero: {
    borderRadius: 24, padding: 28,
    alignItems: 'center', marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28, fontWeight: '800', color: '#fff',
    letterSpacing: -0.5, marginTop: 12, marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 21,
  },

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
  bestValueBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#E8435A',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    marginBottom: 10,
  },
  bestValueText: {
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

  // CTA
  ctaContainer: { gap: 8, marginBottom: 24 },
  terms: {
    fontSize: 11, color: '#A3A3A3', textAlign: 'center',
    lineHeight: 16, paddingHorizontal: 16,
  },
  termsDark: { color: '#737373' },

  // Section title
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: '#171717',
    letterSpacing: -0.3, marginBottom: 12,
  },
  sectionTitleDark: { color: '#F5F5F5' },

  // One-time purchases
  oneTimeCards: { gap: 10, marginBottom: 20 },
  oneTimeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  oneTimeCardDark: {
    backgroundColor: '#252525',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  oneTimeIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  oneTimeInfo: { flex: 1 },
  oneTimeName: { fontSize: 15, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  oneTimeNameDark: { color: '#F5F5F5' },
  oneTimeDesc: { fontSize: 12, color: '#737373', marginTop: 2 },
  oneTimePrice: { fontSize: 15, fontWeight: '700', color: '#E8435A' },
  oneTimePriceDark: { color: '#F87171' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: 12 },
  restoreText: { fontSize: 14, color: '#A3A3A3', fontWeight: '500' },
  restoreTextDark: { color: '#737373' },
});
