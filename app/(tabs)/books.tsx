import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { books } from '@/src/data/content/books';

export default function BooksScreen() {
  const { t } = useTranslation();
  const { completedBooks, completeBook, uncompleteBook } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);

  const toggleBook = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (completedBooks.includes(id)) {
      uncompleteBook(id);
    } else {
      completeBook(id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('booksScreen.title')}</Text>
            <Text style={styles.subtitle}>{t('booksScreen.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isRead = completedBooks.includes(item.id);
          return (
            <GlassCard style={[styles.card, isRead && styles.cardRead]}>
              <View style={styles.cardRow}>
                <View style={styles.emojiContainer}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <Text style={styles.bookAuthor}>{t('booksScreen.by')} {item.author}</Text>
                  <Text style={styles.bookDesc} numberOfLines={2}>
                    {item.description[locale]}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => toggleBook(item.id)}
                style={[styles.readButton, isRead && styles.readButtonDone]}
              >
                <Text style={[styles.readButtonText, isRead && styles.readButtonTextDone]}>
                  {isRead ? `✓ ${t('booksScreen.read')}` : t('booksScreen.markRead')}
                </Text>
              </Pressable>
            </GlassCard>
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
  cardRead: { opacity: 0.65 },
  cardRow: { flexDirection: 'row', gap: 14 },
  emojiContainer: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  cardContent: { flex: 1 },
  bookTitle: { fontSize: 17, fontWeight: '600', color: '#171717', letterSpacing: -0.2 },
  bookAuthor: { fontSize: 14, fontWeight: '500', color: '#E8435A', marginTop: 2 },
  bookDesc: { fontSize: 14, color: '#525252', marginTop: 6, lineHeight: 20 },
  readButton: {
    marginTop: 12, paddingVertical: 10,
    borderRadius: 12, alignItems: 'center',
    backgroundColor: 'rgba(232,67,90,0.08)',
  },
  readButtonDone: { backgroundColor: 'rgba(232,67,90,0.04)' },
  readButtonText: { fontSize: 15, fontWeight: '600', color: '#E8435A' },
  readButtonTextDone: { color: '#A3A3A3' },
});
