import React from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/src/store/auth-store';
import { useUIStore } from '@/src/store/ui-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { exerciseModes, type ExerciseModeId } from '@/src/data/content/exercise-modes';
import { useTranslation } from 'react-i18next';

interface ExerciseModeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ExerciseModeModal({ visible, onClose }: ExerciseModeModalProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isPremium = useAuthStore((s) => s.isPremium);
  const activeMode = useUIStore((s) => s.activeExerciseMode);
  const setExerciseMode = useUIStore((s) => s.setExerciseMode);
  const locale = useSettingsStore((s) => s.locale);
  const router = useRouter();

  const handlePress = (modeId: ExerciseModeId, modePremium: boolean) => {
    if (modePremium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      onClose();
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (activeMode === modeId) {
      setExerciseMode(null);
    } else {
      setExerciseMode(modeId);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('coach.exerciseModes')}
          </Text>
          <Pressable onPress={onClose} style={[styles.closeBtn, isDark && styles.closeBtnDark]}>
            <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
          </Pressable>
        </View>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          {t('coach.exerciseModesSubtitle')}
        </Text>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {exerciseModes.map((mode) => {
            const isActive = activeMode === mode.id;
            const isLocked = mode.isPremium && !isPremium;

            return (
              <Pressable
                key={mode.id}
                onPress={() => handlePress(mode.id, mode.isPremium)}
                style={[
                  styles.card,
                  isDark && styles.cardDark,
                  isActive && { borderColor: mode.color, borderWidth: 2 },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${mode.color}15` }]}>
                    <Ionicons name={mode.icon as any} size={24} color={mode.color} />
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.name, isDark && styles.nameDark]}>{mode.name[locale]}</Text>
                      {isLocked && (
                        <View style={styles.proBadge}>
                          <Ionicons name="lock-closed" size={10} color="#E8435A" />
                          <Text style={styles.proBadgeText}>PRO</Text>
                        </View>
                      )}
                      {isActive && (
                        <Ionicons name="checkmark-circle" size={20} color={mode.color} />
                      )}
                    </View>
                  </View>
                </View>
                <Text style={[styles.description, isDark && styles.descriptionDark]}>
                  {mode.description[locale]}
                </Text>
                {isActive && (
                  <Text style={[styles.deactivateHint, { color: mode.color }]}>
                    {t('coach.deactivate')}
                  </Text>
                )}
              </Pressable>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  titleDark: { color: '#F5F5F5' },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  subtitle: {
    fontSize: 15, color: '#737373', paddingHorizontal: 20, marginTop: 4, marginBottom: 20,
  },
  subtitleDark: { color: '#A3A3A3' },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardDark: {
    backgroundColor: '#252525', borderColor: 'rgba(255,255,255,0.08)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  iconContainer: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 18, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  nameDark: { color: '#F5F5F5' },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(232,67,90,0.08)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  proBadgeText: { fontSize: 10, fontWeight: '800', color: '#E8435A' },
  description: { fontSize: 14, lineHeight: 20, color: '#525252' },
  descriptionDark: { color: '#A3A3A3' },
  deactivateHint: {
    fontSize: 13, fontWeight: '600', marginTop: 8,
  },
});
