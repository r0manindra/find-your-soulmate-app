import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import * as purchases from '@/src/services/purchases';
import type { PurchasesPackage } from 'react-native-purchases';

const FEATURES = [
  { icon: 'book' as const, title: { en: 'All 20 Chapters', de: 'Alle 20 Kapitel' }, description: { en: 'Unlock the full guide from self-discovery to commitment', de: 'Der komplette Guide von Selbstfindung bis Beziehung' } },
  { icon: 'chatbubbles' as const, title: { en: 'Unlimited AI Coach', de: 'Unbegrenzter KI-Coach' }, description: { en: 'No daily message limits with Coach Hank', de: 'Keine täglichen Nachrichtenlimits mit Coach Hank' } },
  { icon: 'document-text' as const, title: { en: 'Premium PDF Guide', de: 'Premium PDF Guide' }, description: { en: 'Download the complete guide as a beautifully formatted PDF', de: 'Lade den kompletten Guide als PDF herunter' } },
  { icon: 'star' as const, title: { en: 'Priority Support', de: 'Prioritäts-Support' }, description: { en: 'Get help faster when you need it', de: 'Schnellere Hilfe, wenn du sie brauchst' } },
];

type Plan = 'monthly' | 'yearly';

export default function PaywallScreen() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const locale = useSettingsStore((s) => s.locale);
  const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [monthlyPkg, setMonthlyPkg] = useState<PurchasesPackage | null>(null);
  const [annualPkg, setAnnualPkg] = useState<PurchasesPackage | null>(null);

  // Load RevenueCat offerings
  useEffect(() => {
    purchases.getOfferings().then((offerings) => {
      if (offerings) {
        setMonthlyPkg(offerings.monthly ?? null);
        setAnnualPkg(offerings.annual ?? null);
      }
    }).catch(() => { /* RevenueCat not configured yet */ });
  }, []);

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isLoggedIn) {
      router.push('/auth/register');
      return;
    }

    setLoading(true);
    try {
      const pkg = selectedPlan === 'yearly' ? annualPkg : monthlyPkg;
      if (pkg) {
        const success = await purchases.purchasePackage(pkg);
        if (success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
          return;
        }
      } else {
        // RevenueCat not configured — show info
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
            ? 'Dein Premium-Zugang wurde wiederhergestellt.'
            : 'Your premium access has been restored.'
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

  const selectPlan = (plan: Plan) => {
    Haptics.selectionAsync();
    setSelectedPlan(plan);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Close button */}
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#737373" />
        </Pressable>

        {/* Hero */}
        <LinearGradient
          colors={['#E8435A', '#FF7854']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Ionicons name="diamond" size={48} color="#fff" />
          <Text style={styles.heroTitle}>
            {locale === 'de' ? 'Werde Premium' : 'Go Premium'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {locale === 'de'
              ? 'Schalte das volle Find Your Soulmate Erlebnis frei'
              : 'Unlock the full Find Your Soulmate experience'}
          </Text>
        </LinearGradient>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((feature, idx) => (
            <GlassCard key={idx} style={styles.featureCard}>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={22} color="#E8435A" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title[locale]}</Text>
                  <Text style={styles.featureDesc}>{feature.description[locale]}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Plan selection */}
        <View style={styles.plans}>
          <Pressable onPress={() => selectPlan('yearly')}>
            <GlassCard style={[styles.planCard, selectedPlan === 'yearly' && styles.planSelected]}>
              <View style={styles.planHeader}>
                <View style={[styles.radio, selectedPlan === 'yearly' && styles.radioSelected]}>
                  {selectedPlan === 'yearly' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.planInfo}>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planTitle}>
                      {locale === 'de' ? 'Jährlich' : 'Yearly'}
                    </Text>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveText}>
                        {locale === 'de' ? '-58%' : 'SAVE 58%'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.planPrice}>
                    $49.99/{locale === 'de' ? 'Jahr' : 'year'}
                  </Text>
                  <Text style={styles.planPerMonth}>
                    $4.17/{locale === 'de' ? 'Monat' : 'month'}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <Pressable onPress={() => selectPlan('monthly')}>
            <GlassCard style={[styles.planCard, selectedPlan === 'monthly' && styles.planSelected]}>
              <View style={styles.planHeader}>
                <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioSelected]}>
                  {selectedPlan === 'monthly' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>
                    {locale === 'de' ? 'Monatlich' : 'Monthly'}
                  </Text>
                  <Text style={styles.planPrice}>
                    $9.99/{locale === 'de' ? 'Monat' : 'month'}
                  </Text>
                </View>
              </View>
            </GlassCard>
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
          <Text style={styles.trialNote}>
            {locale === 'de'
              ? '7 Tage kostenlos testen. Jederzeit kündbar.'
              : '7-day free trial. Cancel anytime.'}
          </Text>
          <Text style={styles.terms}>
            {locale === 'de'
              ? 'Die Zahlung wird nach Ablauf der Testphase über deinen App Store Account abgerechnet. Das Abo verlängert sich automatisch, sofern es nicht mindestens 24 Stunden vor Ende der aktuellen Laufzeit gekündigt wird.'
              : 'Payment will be charged to your App Store account after the trial period. Subscription renews automatically unless cancelled at least 24 hours before the end of the current period.'}
          </Text>
        </View>

        {/* Restore */}
        <Pressable onPress={handleRestore} style={styles.restoreButton} disabled={loading}>
          <Text style={styles.restoreText}>
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
  hero: {
    borderRadius: 24, padding: 32,
    alignItems: 'center', marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32, fontWeight: '800', color: '#fff',
    letterSpacing: -0.5, marginTop: 16, marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 22,
  },
  features: { gap: 10, marginBottom: 20 },
  featureCard: {},
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: '#171717' },
  featureDesc: { fontSize: 13, color: '#737373', marginTop: 2 },

  // Plans
  plans: { gap: 10, marginBottom: 20 },
  planCard: { borderWidth: 2, borderColor: 'transparent' },
  planSelected: { borderColor: '#E8435A' },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D4D4D4',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#E8435A' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E8435A' },
  planInfo: { flex: 1 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planTitle: { fontSize: 17, fontWeight: '700', color: '#171717' },
  saveBadge: {
    backgroundColor: '#E8435A', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  saveText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  planPrice: { fontSize: 15, fontWeight: '600', color: '#525252', marginTop: 2 },
  planPerMonth: { fontSize: 13, color: '#737373', marginTop: 1 },

  // CTA
  ctaContainer: { gap: 8, marginBottom: 16 },
  trialNote: {
    fontSize: 14, fontWeight: '600', color: '#171717',
    textAlign: 'center',
  },
  terms: {
    fontSize: 11, color: '#A3A3A3', textAlign: 'center',
    lineHeight: 16, paddingHorizontal: 16,
  },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: 12 },
  restoreText: { fontSize: 14, color: '#A3A3A3', fontWeight: '500' },
});
