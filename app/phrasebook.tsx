import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/components/useColorScheme';
import { useSettingsStore } from '@/src/store/settings-store';
import { useAuthStore } from '@/src/store/auth-store';
import { usePhrasebookStore } from '@/src/store/phrasebook-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { CategoryCard } from '@/src/presentation/components/phrasebook/category-card';
import { PhraseCard } from '@/src/presentation/components/phrasebook/phrase-card';
import {
  phraseCategories,
  phrases,
  getPhrasesForCategory,
  getFreePhraseCount,
  getTotalPhraseCount,
  type PhraseCategory,
  type PhraseCategoryId,
} from '@/src/data/content/phrasebook';

export default function PhrasebookScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const locale = useSettingsStore((s) => s.locale);
  const isPremium = useAuthStore((s) => s.isPremium);
  const userGender = useUserProfileStore((s) => s.userGender);
  const { savedPhraseIds } = usePhrasebookStore();

  const [selectedCategory, setSelectedCategory] = useState<PhraseCategoryId | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredPhrases = useMemo(() => {
    let result = selectedCategory
      ? getPhrasesForCategory(selectedCategory)
      : phrases;

    // Filter by gender (diverse sees all phrases)
    const gender = userGender ?? 'male';
    if (gender !== 'diverse') {
      result = result.filter((p) => p.forGender === 'all' || p.forGender === gender);
    }

    // Filter by saved
    if (showSavedOnly) {
      result = result.filter((p) => savedPhraseIds.includes(p.id));
    }

    return result;
  }, [selectedCategory, userGender, showSavedOnly, savedPhraseIds]);

  const activeCategory = selectedCategory
    ? phraseCategories.find((c) => c.id === selectedCategory)
    : null;

  if (selectedCategory && activeCategory) {
    return (
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
        {/* Category detail header */}
        <View style={styles.detailHeader}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedCategory(null);
              setShowSavedOnly(false);
            }}
            style={[styles.backButton, isDark && styles.backButtonDark]}
          >
            <Ionicons name="chevron-back" size={22} color={isDark ? '#F5F5F5' : '#171717'} />
          </Pressable>
          <View style={styles.detailHeaderText}>
            <Text style={[styles.detailTitle, isDark && styles.detailTitleDark]}>
              {activeCategory.name[locale]}
            </Text>
            <Text style={[styles.detailSubtitle, isDark && styles.detailSubtitleDark]}>
              {filteredPhrases.length} {locale === 'de' ? 'Sprüche' : 'phrases'}
            </Text>
          </View>
        </View>

        {/* Saved filter toggle */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowSavedOnly(!showSavedOnly);
            }}
            style={[
              styles.filterChip,
              isDark && styles.filterChipDark,
              showSavedOnly && styles.filterChipActive,
            ]}
          >
            <Ionicons
              name={showSavedOnly ? 'bookmark' : 'bookmark-outline'}
              size={14}
              color={showSavedOnly ? '#fff' : (isDark ? '#A3A3A3' : '#737373')}
            />
            <Text style={[
              styles.filterChipText,
              isDark && styles.filterChipTextDark,
              showSavedOnly && styles.filterChipTextActive,
            ]}>
              {locale === 'de' ? 'Gespeichert' : 'Saved'}
            </Text>
          </Pressable>
        </View>

        {/* Phrase list */}
        <FlatList
          data={filteredPhrases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.phraseList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 30).duration(300)}>
              <PhraseCard
                phrase={item}
                locale={locale}
                accentColor={activeCategory.color}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={48} color="#A3A3A3" />
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                {locale === 'de' ? 'Keine gespeicherten Sprüche' : 'No saved phrases'}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  // Landing view - category grid
  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={[styles.backButton, isDark && styles.backButtonDark]}
          >
            <Ionicons name="chevron-back" size={22} color={isDark ? '#F5F5F5' : '#171717'} />
          </Pressable>
        </View>

        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('phrasebook.title')}
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            {t('phrasebook.subtitle')}
          </Text>
        </Animated.View>

        {/* Saved phrases quick access */}
        {savedPhraseIds.length > 0 && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSavedOnly(true);
                setSelectedCategory(phraseCategories[0].id);
              }}
              style={[styles.savedBanner, isDark && styles.savedBannerDark]}
            >
              <Ionicons name="bookmark" size={18} color="#E8435A" />
              <Text style={[styles.savedBannerText, isDark && styles.savedBannerTextDark]}>
                {savedPhraseIds.length} {locale === 'de' ? 'gespeicherte Sprüche' : 'saved phrases'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#A3A3A3" />
            </Pressable>
          </Animated.View>
        )}

        {/* Category grid */}
        <View style={styles.grid}>
          {phraseCategories.map((category, index) => (
            <Animated.View
              key={category.id}
              style={styles.gridItem}
              entering={FadeInDown.delay(100 + index * 50).duration(400)}
            >
              <CategoryCard
                category={category}
                phraseCount={getTotalPhraseCount(category.id)}
                freeCount={getFreePhraseCount(category.id)}
                locale={locale}
                onPress={() => setSelectedCategory(category.id)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  content: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 8 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: '#171717',
    marginBottom: 4,
  },
  titleDark: { color: '#F5F5F5' },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 24,
  },
  subtitleDark: { color: '#A3A3A3' },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(232,67,90,0.06)',
    borderRadius: 14,
    marginBottom: 20,
  },
  savedBannerDark: {
    backgroundColor: 'rgba(232,67,90,0.12)',
  },
  savedBannerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  savedBannerTextDark: { color: '#F5F5F5' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },

  // Detail view
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  detailHeaderText: { flex: 1 },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.3,
  },
  detailTitleDark: { color: '#F5F5F5' },
  detailSubtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },
  detailSubtitleDark: { color: '#A3A3A3' },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  filterChipDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterChipActive: {
    backgroundColor: '#E8435A',
    borderColor: '#E8435A',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#525252',
  },
  filterChipTextDark: { color: '#D4D4D4' },
  filterChipTextActive: { color: '#fff' },
  phraseList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
  },
  emptyTextDark: { color: '#A3A3A3' },
});
