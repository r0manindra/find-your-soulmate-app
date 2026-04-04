import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { OptionCard } from '@/src/presentation/components/onboarding/option-card';
import { ProgressDots } from '@/src/presentation/components/onboarding/progress-dots';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { useSettingsStore } from '@/src/store/settings-store';
import i18n from '@/src/i18n/config';
import { getPersonalization } from '@/src/core/personalization';
import type { Goal, UserGender } from '@/src/store/user-profile-store';

const TOTAL_PAGES = 3;

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const setCharacterId = useSettingsStore((s) => s.setCharacterId);

  const {
    userGender, goal,
    setUserGender, setGoal,
    completeOnboarding,
  } = useUserProfileStore();

  const g = userGender ?? 'male';

  const goToPage = useCallback((page: number) => {
    flatListRef.current?.scrollToIndex({ index: page, animated: true });
    setCurrentPage(page);
  }, []);

  const advance = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const goBack = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const handleComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const personalization = getPersonalization({ userGender, socialEnergy: null, ageGroup: null, basicsLevel: null, skillLevel: 'beginner', goal });
    const currentCharacterId = useSettingsStore.getState().selectedCharacterId;
    if (currentCharacterId === 'charismo' || currentCharacterId === 'bestfriend') {
      setCharacterId(personalization.recommendedCharacterId);
    }
    completeOnboarding();
    router.replace('/(tabs)');
  }, [userGender, goal, completeOnboarding, setCharacterId, router]);

  const handleLanguageSelect = useCallback((lang: 'en' | 'de') => {
    setLocale(lang);
    i18n.changeLanguage(lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(advance, 400);
  }, [setLocale, advance]);

  const renderPage = useCallback(({ item }: { item: number }) => {
    switch (item) {
      case 0: return <LanguagePage locale={locale} onSelect={handleLanguageSelect} isDark={isDark} width={width} />;
      case 1: return (
        <QuestionPage
          locale={locale}
          isDark={isDark}
          title={t('onboarding.gender.title')}
          subtitle={t('onboarding.gender.subtitle')}
          footnote={t('onboarding.gender.footnote')}
          options={[
            { emoji: '🚀', label: t('onboarding.gender.male'), note: t('onboarding.gender.maleNote'), value: 'male' as const },
            { emoji: '✨', label: t('onboarding.gender.female'), note: t('onboarding.gender.femaleNote'), value: 'female' as const },
            { emoji: '🌈', label: t('onboarding.gender.diverse'), note: t('onboarding.gender.diverseNote'), value: 'diverse' as const },
          ]}
          selected={userGender}
          onSelect={(value) => {
            setUserGender(value as UserGender);
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
      case 2: return (
        <QuestionPage
          locale={locale}
          isDark={isDark}
          title={t('onboarding.goal.title')}
          subtitle={t('onboarding.goal.subtitle')}
          options={[
            { emoji: '🗣️', label: t(`onboarding.goal.${g}.socialConfidence`), value: 'social_confidence' as const },
            { emoji: '📅', label: t(`onboarding.goal.${g}.getDates`), value: 'get_dates' as const },
            { emoji: '💕', label: t(`onboarding.goal.${g}.findPartner`), value: 'find_partner' as const },
            { emoji: '✨', label: t(`onboarding.goal.${g}.socialMagnetism`), value: 'social_magnetism' as const },
            { emoji: '👑', label: t(`onboarding.goal.${g}.ambitious`), note: t(`onboarding.goal.${g}.ambitiousNote`), value: 'ambitious' as const },
          ]}
          selected={goal}
          onSelect={(value) => {
            setGoal(value as Goal);
            setTimeout(() => handleComplete(), 400);
          }}
          width={width}
        />
      );
      default: return null;
    }
  }, [
    locale, t, width, g, isDark, userGender, goal,
    advance, handleComplete, handleLanguageSelect,
    setUserGender, setGoal,
  ]);

  const pages = useMemo(() => [0, 1, 2], []);

  return (
    <View style={[styles.screen, isDark && styles.screenDark, { paddingTop: insets.top }]}>
      <View style={styles.navRow}>
        {currentPage > 0 ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              goBack();
            }}
            style={[styles.backButton, isDark && styles.backButtonDark]}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color={isDark ? '#A3A3A3' : '#737373'} />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <View style={styles.dotsContainer}>
          <ProgressDots total={TOTAL_PAGES} current={currentPage} />
        </View>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(item) => String(item)}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

/* ---------- Language Page ---------- */

function LanguagePage({
  locale,
  onSelect,
  isDark,
  width,
}: {
  locale: string;
  onSelect: (lang: 'en' | 'de') => void;
  isDark: boolean;
  width: number;
}) {
  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.questionHeader}>
          <Text style={[styles.questionTitle, isDark && styles.textLight]}>Choose your language</Text>
          <Text style={[styles.questionSubtitle, isDark && styles.textMutedDark]}>Wähle deine Sprache</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.optionsList}>
          <OptionCard
            emoji="🇬🇧"
            label="English"
            selected={locale === 'en'}
            onSelect={() => onSelect('en')}
          />
          <OptionCard
            emoji="🇩🇪"
            label="Deutsch"
            selected={locale === 'de'}
            onSelect={() => onSelect('de')}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

/* ---------- Question Page ---------- */

interface QuestionOption {
  emoji: string;
  label: string;
  note?: string;
  value: string;
}

function QuestionPage({
  locale,
  isDark,
  title,
  subtitle,
  question,
  footnote,
  options,
  selected,
  onSelect,
  width,
}: {
  locale: string;
  isDark: boolean;
  title: string;
  subtitle: string;
  question?: string;
  footnote?: string;
  options: QuestionOption[];
  selected: string | null;
  onSelect: (value: string) => void;
  width: number;
}) {
  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.questionHeader}>
          <Text style={[styles.questionTitle, isDark && styles.textLight]}>{title}</Text>
          <Text style={[styles.questionSubtitle, isDark && styles.textMutedDark]}>{subtitle}</Text>
          {question && <Text style={[styles.questionExtra, isDark && styles.textSecondaryDark]}>{question}</Text>}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.optionsList}>
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              emoji={opt.emoji}
              label={opt.label}
              note={opt.note}
              selected={selected === opt.value}
              onSelect={() => onSelect(opt.value)}
            />
          ))}
        </Animated.View>

        {footnote && (
          <Text style={styles.footnote}>{footnote}</Text>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  screenDark: {
    backgroundColor: '#171717',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
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
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  dotsContainer: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
  },

  /* Dark mode text helpers */
  textLight: {
    color: '#F5F5F5',
  },
  textMutedDark: {
    color: '#A3A3A3',
  },
  textSecondaryDark: {
    color: '#D4D4D4',
  },

  /* Page */
  page: {
    flex: 1,
  },
  pageContent: {
    padding: 24,
    paddingBottom: 140,
    flexGrow: 1,
  },

  /* Question Pages */
  questionHeader: {
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#737373',
    marginTop: 6,
    lineHeight: 22,
  },
  questionExtra: {
    fontSize: 16,
    color: '#525252',
    marginTop: 12,
    fontWeight: '500',
  },
  optionsList: {
    gap: 10,
  },
  footnote: {
    fontSize: 13,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },

});
