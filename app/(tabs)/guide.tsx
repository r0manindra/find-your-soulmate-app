import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { chapters } from '@/src/data/content/chapters';

export default function GuideScreen() {
  const { t } = useTranslation();
  const { completedChapters, completeChapter, uncompleteChapter } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);

  const toggleChapter = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (completedChapters.includes(id)) {
      uncompleteChapter(id);
    } else {
      completeChapter(id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={chapters}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('guide.title')}</Text>
            <Text style={styles.subtitle}>{t('guide.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isCompleted = completedChapters.includes(item.id);
          return (
            <Pressable onPress={() => toggleChapter(item.id)}>
              <GlassCard style={[styles.card, isCompleted && styles.cardCompleted]}>
                <View style={styles.cardRow}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{item.icon}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.chapterHeader}>
                      <Text style={styles.chapterNumber}>
                        {t('guide.chapter')} {item.id}
                      </Text>
                      {isCompleted && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedBadgeText}>{t('guide.completed')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.chapterTitle}>{item.title[locale]}</Text>
                    <Text style={styles.chapterSubtitle}>{item.subtitle[locale]}</Text>
                    <Text style={styles.chapterSummary} numberOfLines={2}>
                      {item.summary[locale]}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => toggleChapter(item.id)}
                  style={[styles.actionButton, isCompleted && styles.actionButtonCompleted]}
                >
                  <Text style={[styles.actionText, isCompleted && styles.actionTextCompleted]}>
                    {isCompleted ? t('guide.completed') : t('guide.markComplete')}
                  </Text>
                </Pressable>
              </GlassCard>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  list: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: '#171717' },
  subtitle: { fontSize: 15, color: '#737373', marginTop: 4 },
  card: { marginBottom: 12 },
  cardCompleted: { opacity: 0.7 },
  cardRow: { flexDirection: 'row', gap: 14 },
  iconContainer: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  cardContent: { flex: 1 },
  chapterHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  chapterNumber: { fontSize: 12, fontWeight: '600', color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.5 },
  completedBadge: { backgroundColor: '#E8435A', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  completedBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  chapterTitle: { fontSize: 18, fontWeight: '600', color: '#171717', letterSpacing: -0.3 },
  chapterSubtitle: { fontSize: 14, color: '#737373', marginTop: 2 },
  chapterSummary: { fontSize: 14, color: '#525252', marginTop: 6, lineHeight: 20 },
  actionButton: {
    marginTop: 12, paddingVertical: 10,
    borderRadius: 12, alignItems: 'center',
    backgroundColor: 'rgba(232,67,90,0.08)',
  },
  actionButtonCompleted: { backgroundColor: 'rgba(232,67,90,0.04)' },
  actionText: { fontSize: 15, fontWeight: '600', color: '#E8435A' },
  actionTextCompleted: { color: '#A3A3A3' },
});
