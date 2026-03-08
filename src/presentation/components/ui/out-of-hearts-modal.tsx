import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { BrandButton } from './brand-button';

interface OutOfHeartsModalProps {
  visible: boolean;
  onClose: () => void;
}

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export function OutOfHeartsModal({ visible, onClose }: OutOfHeartsModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const locale = useSettingsStore((s) => s.locale);
  const isPremium = useAuthStore((s) => s.isPremium);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 60000);
    return () => clearInterval(timer);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
        <View style={styles.header}>
          <View style={{ width: 36 }} />
          <View style={{ flex: 1 }} />
          <Pressable onPress={onClose} style={[styles.closeBtn, isDark && styles.closeBtnDark]}>
            <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart-dislike" size={56} color="#E8435A" />
          </View>

          <Text style={[styles.title, isDark && styles.titleDark]}>
            {locale === 'de' ? 'Keine Herzen mehr' : 'Out of Hearts'}
          </Text>

          <Text style={[styles.description, isDark && styles.descriptionDark]}>
            {locale === 'de'
              ? 'Deine täglichen Herzen sind aufgebraucht. Neue Herzen gibt es um Mitternacht.'
              : "You've used all your daily hearts. New hearts arrive at midnight."}
          </Text>

          <View style={[styles.countdownBadge, isDark && styles.countdownBadgeDark]}>
            <Ionicons name="time-outline" size={16} color={isDark ? '#A3A3A3' : '#737373'} />
            <Text style={[styles.countdownText, isDark && styles.countdownTextDark]}>
              {locale === 'de' ? `Reset in ${countdown}` : `Resets in ${countdown}`}
            </Text>
          </View>

          <View style={styles.actions}>
            {!isPremium ? (
              <BrandButton
                title={locale === 'de' ? 'Auf PRO upgraden' : 'Upgrade to PRO'}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onClose();
                  router.push('/paywall?trigger=hearts');
                }}
              />
            ) : (
              <>
                <BrandButton
                  title={locale === 'de' ? 'Herz-Paket kaufen' : 'Buy Heart Pack'}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onClose();
                    router.push('/paywall?trigger=hearts');
                  }}
                />
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClose();
                    router.push('/paywall?trigger=hearts');
                  }}
                  style={styles.secondaryAction}
                >
                  <Text style={[styles.secondaryText, isDark && styles.secondaryTextDark]}>
                    {locale === 'de' ? 'Auf Jahres-Abo upgraden' : 'Upgrade to Annual'}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDark: { color: '#F5F5F5' },
  description: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 20,
  },
  descriptionDark: { color: '#A3A3A3' },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 32,
  },
  countdownBadgeDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  countdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#525252',
  },
  countdownTextDark: { color: '#D4D4D4' },
  actions: {
    width: '100%',
    gap: 12,
  },
  secondaryAction: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#737373',
  },
  secondaryTextDark: { color: '#A3A3A3' },
});
