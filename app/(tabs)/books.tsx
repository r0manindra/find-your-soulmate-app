import React from 'react';
import { View, Text, FlatList, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { getPersonalization } from '@/src/core/personalization';
import { books } from '@/src/data/content/books';

export default function BooksScreen() {
  const { t } = useTranslation();
  const { completedBooks, completeBook, uncompleteBook } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);
  const userProfile = useUserProfileStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const sortedBooks = React.useMemo(() => {
    if (!userProfile.hasCompletedOnboarding || !userProfile.skillLevel) return books;
    const personalization = getPersonalization(userProfile);
    const priority = personalization.bookPriority;
    return [...books].sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id));
  }, [userProfile]);

  const recommendedBookIds = React.useMemo(() => {
    if (!userProfile.hasCompletedOnboarding || !userProfile.skillLevel) return new Set<number>();
    const personalization = getPersonalization(userProfile);
    return new Set(personalization.bookPriority.slice(0, 3));
  }, [userProfile]);

  const toggleBook = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (completedBooks.includes(id)) {
      uncompleteBook(id);
    } else {
      completeBook(id);
    }
  };

  const openAmazon = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <FlatList
        data={sortedBooks}
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
          const isRecommended = recommendedBookIds.has(item.id);
          return (
            <GlassCard style={[styles.card, isRead && styles.cardRead]}>
              <View style={styles.cardRow}>
                <View style={styles.emojiContainer}>
                  <Ionicons name={item.ionicon as any} size={24} color="#E8435A" />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.bookTitleRow}>
                    <Text style={[styles.bookTitle, { flex: 1 }]}>{item.title}</Text>
                    {isRecommended && !isRead && (
                      <View style={styles.recommendedBadge}>
                        <Ionicons name="sparkles" size={10} color="#F59E0B" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.bookAuthor}>{t('booksScreen.by')} {item.author}</Text>
                  <Text style={styles.bookDesc} numberOfLines={3}>
                    {item.description[locale]}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={() => toggleBook(item.id)}
                  style={[styles.readButton, isRead && styles.readButtonDone]}
                >
                  <Text style={[styles.readButtonText, isRead && styles.readButtonTextDone]}>
                    {isRead ? `✓ ${t('booksScreen.read')}` : t('booksScreen.markRead')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => openAmazon(item.amazonUrl)}
                  style={styles.amazonButton}
                >
                  <Ionicons name="cart-outline" size={16} color="#E8435A" />
                  <Text style={styles.amazonButtonText}>
                    {locale === 'de' ? 'Kaufen' : 'Buy'}
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
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
  cardContent: { flex: 1 },
  bookTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recommendedBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(245,158,11,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  bookTitle: { fontSize: 17, fontWeight: '600', color: '#171717', letterSpacing: -0.2 },
  bookAuthor: { fontSize: 14, fontWeight: '500', color: '#E8435A', marginTop: 2 },
  bookDesc: { fontSize: 14, color: '#525252', marginTop: 6, lineHeight: 20 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  readButton: {
    flex: 1, paddingVertical: 10,
    borderRadius: 12, alignItems: 'center',
    backgroundColor: 'rgba(232,67,90,0.08)',
  },
  readButtonDone: { backgroundColor: 'rgba(232,67,90,0.04)' },
  readButtonText: { fontSize: 15, fontWeight: '600', color: '#E8435A' },
  readButtonTextDone: { color: '#A3A3A3' },
  amazonButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, backgroundColor: 'rgba(232,67,90,0.08)',
  },
  amazonButtonText: { fontSize: 14, fontWeight: '600', color: '#E8435A' },
});
