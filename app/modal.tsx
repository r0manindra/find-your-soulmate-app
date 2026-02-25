import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';

export default function GraduateModal() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8435A', '#FF7854']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.emoji}>🎓</Text>
        <Text style={styles.title}>{t('graduate.title')}</Text>
        <Text style={styles.subtitle}>{t('graduate.subtitle')}</Text>
        <Text style={styles.message}>{t('graduate.message')}</Text>

        <GlassCard style={styles.buttonsCard} intensity="light" padding={16}>
          <View style={styles.buttons}>
            <Pressable style={styles.shareButton}>
              <Text style={styles.shareText}>{t('graduate.share')}</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => router.back()}
            >
              <Text style={styles.deleteText}>{t('graduate.delete')}</Text>
            </Pressable>
          </View>
        </GlassCard>

        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: {
    fontSize: 42, fontWeight: '800', color: '#fff',
    letterSpacing: -1, textAlign: 'center',
  },
  subtitle: {
    fontSize: 18, color: 'rgba(255,255,255,0.8)',
    marginTop: 8, textAlign: 'center',
  },
  message: {
    fontSize: 16, color: 'rgba(255,255,255,0.9)',
    lineHeight: 24, textAlign: 'center',
    marginTop: 24, marginBottom: 40, paddingHorizontal: 16,
  },
  buttonsCard: { width: '100%' },
  buttons: { gap: 12, width: '100%' },
  shareButton: {
    backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  shareText: { fontSize: 17, fontWeight: '700', color: '#E8435A' },
  deleteButton: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  deleteText: { fontSize: 17, fontWeight: '600', color: '#fff' },
  closeButton: { marginTop: 32, paddingVertical: 12 },
  closeText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
});
