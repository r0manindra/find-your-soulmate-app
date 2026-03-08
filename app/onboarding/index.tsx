import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { GlassButton } from '@/src/presentation/components/ui/glass-button';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { OptionCard } from '@/src/presentation/components/onboarding/option-card';
import { ProgressDots } from '@/src/presentation/components/onboarding/progress-dots';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { useSettingsStore } from '@/src/store/settings-store';
import i18n from '@/src/i18n/config';
import { getPersonalization } from '@/src/core/personalization';
import { getCharacter } from '@/src/data/content/coach-characters';
import { chapters, phases } from '@/src/data/content/chapters';
import type { SkillLevel, Goal, UserGender } from '@/src/store/user-profile-store';

const TOTAL_PAGES = 6;

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
    userGender, skillLevel, goal,
    setUserGender, setSkillLevel, setGoal,
    completeOnboarding, skipOnboarding,
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

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipOnboarding();
    router.replace('/(tabs)');
  }, [skipOnboarding, router]);

  const handleComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const personalization = getPersonalization({ userGender, socialEnergy: null, ageGroup: null, basicsLevel: null, skillLevel, goal });
    const currentCharacterId = useSettingsStore.getState().selectedCharacterId;
    if (currentCharacterId === 'charismo' || currentCharacterId === 'bestfriend') {
      setCharacterId(personalization.recommendedCharacterId);
    }
    completeOnboarding();
    router.replace('/(tabs)');
  }, [userGender, skillLevel, goal, completeOnboarding, setCharacterId, router]);

  const personalization = useMemo(
    () => getPersonalization({ userGender, socialEnergy: null, ageGroup: null, basicsLevel: null, skillLevel, goal }),
    [userGender, skillLevel, goal],
  );

  const recommendedCharacter = useMemo(
    () => getCharacter(personalization.recommendedCharacterId),
    [personalization.recommendedCharacterId],
  );

  // Key chapters to highlight on summary page
  const highlightChapters = useMemo(() => {
    const ids = [21, 1, 5, 10]; // Foundation, Mirror, The Approach, Digital Game
    return ids.map((id) => chapters.find((c) => c.id === id)).filter((c): c is typeof chapters[number] => !!c);
  }, []);

  const handleLanguageSelect = useCallback((lang: 'en' | 'de') => {
    setLocale(lang);
    i18n.changeLanguage(lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(advance, 400);
  }, [setLocale, advance]);

  const renderPage = useCallback(({ item }: { item: number }) => {
    switch (item) {
      case 0: return <LanguagePage locale={locale} onSelect={handleLanguageSelect} isDark={isDark} width={width} />;
      case 1: return <WelcomePage locale={locale} t={t} onAdvance={advance} onSkip={handleSkip} isDark={isDark} />;
      case 2: return (
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
      case 3: return (
        <QuestionPage
          locale={locale}
          isDark={isDark}
          title={t('onboarding.skillLevel.title')}
          subtitle={t('onboarding.skillLevel.subtitle')}
          options={[
            { emoji: '🐣', label: t(`onboarding.skillLevel.${g}.beginner`), note: t(`onboarding.skillLevel.${g}.beginnerNote`), value: 'beginner' as const },
            { emoji: '📈', label: t(`onboarding.skillLevel.${g}.intermediate`), note: t(`onboarding.skillLevel.${g}.intermediateNote`), value: 'intermediate' as const },
            { emoji: '🎯', label: t(`onboarding.skillLevel.${g}.advanced`), note: t(`onboarding.skillLevel.${g}.advancedNote`), value: 'advanced' as const },
            { emoji: '🔥', label: t(`onboarding.skillLevel.${g}.expert`), note: t(`onboarding.skillLevel.${g}.expertNote`), value: 'expert' as const },
          ]}
          selected={skillLevel}
          onSelect={(value) => {
            setSkillLevel(value as SkillLevel);
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
      case 4: return (
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
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
      case 5: return (
        <SummaryPage
          locale={locale}
          isDark={isDark}
          t={t}
          recommendedCharacter={recommendedCharacter}
          highlightChapters={highlightChapters}
          skillLevel={skillLevel}
          goal={goal}
          onComplete={handleComplete}
        />
      );
      default: return null;
    }
  }, [
    locale, t, width, g, isDark, userGender, skillLevel, goal,
    recommendedCharacter, highlightChapters,
    advance, handleSkip, handleComplete, handleLanguageSelect,
    setUserGender, setSkillLevel, setGoal,
  ]);

  const pages = useMemo(() => [0, 1, 2, 3, 4, 5], []);

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

/* ---------- Welcome Page ---------- */

function WelcomePage({
  locale,
  t,
  onAdvance,
  onSkip,
  isDark,
}: {
  locale: string;
  t: any;
  onAdvance: () => void;
  onSkip: () => void;
  isDark: boolean;
}) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.welcomeHero}>
          <View style={styles.welcomeIconContainer}>
            <LinearGradient
              colors={['#E8435A', '#FF7854']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeIcon}
            >
              <Text style={styles.welcomeEmoji}>🏕️</Text>
            </LinearGradient>
          </View>
          <Text style={[styles.welcomeTitle, isDark && styles.textLight]}>{t('onboarding.welcome.title')}</Text>
          <Text style={[styles.welcomeBody, isDark && styles.textMutedDark]}>{t('onboarding.welcome.body')}</Text>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={[styles.bottomActions, isDark && styles.bottomActionsDark]}>
        <BrandButton title={t('onboarding.welcome.cta')} onPress={onAdvance} />
        <GlassButton title={t('onboarding.welcome.skip')} onPress={onSkip} />
      </Animated.View>
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

/* ---------- Summary Page ---------- */

function SummaryPage({
  locale,
  isDark,
  t,
  recommendedCharacter,
  highlightChapters,
  skillLevel,
  goal,
  onComplete,
}: {
  locale: string;
  isDark: boolean;
  t: any;
  recommendedCharacter: ReturnType<typeof getCharacter>;
  highlightChapters: (typeof chapters[number])[];
  skillLevel: string | null;
  goal: string | null;
  onComplete: () => void;
}) {
  const { width } = useWindowDimensions();

  const skillLabel = skillLevel
    ? t(`onboarding.profile.labels.${skillLevel}`)
    : '—';
  const goalLabel = goal
    ? t(`onboarding.profile.labels.${goal}`)
    : '—';

  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.revealHeader}>
          <Text style={[styles.revealTitle, isDark && styles.textLight]}>{t('onboarding.profileReveal.title')}</Text>
          <Text style={[styles.revealSubtitle, isDark && styles.textMutedDark]}>{t('onboarding.profileReveal.subtitle')}</Text>
        </Animated.View>

        {/* Your Coach */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <GlassCard style={styles.revealCard}>
            <Text style={styles.revealCardTitle}>
              {locale === 'de' ? 'DEIN COACH' : 'YOUR COACH'}
            </Text>
            <View style={styles.coachRow}>
              <View style={[styles.coachIcon, { backgroundColor: `${recommendedCharacter.color}15` }]}>
                <Ionicons name={recommendedCharacter.icon as any} size={28} color={recommendedCharacter.color} />
              </View>
              <View style={styles.coachInfo}>
                <Text style={[styles.coachName, isDark && styles.textLight]}>{recommendedCharacter.name}</Text>
                <Text style={[styles.coachSub, isDark && styles.textMutedDark]}>{recommendedCharacter.subtitle[locale as 'en' | 'de']}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Your Journey */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <GlassCard style={styles.revealCard}>
            <Text style={styles.revealCardTitle}>
              {locale === 'de' ? 'DEINE REISE' : 'YOUR JOURNEY'}
            </Text>
            {highlightChapters.map((ch, idx) => (
              <View key={ch!.id} style={[styles.chapterRow, isDark && styles.chapterRowDark, idx === 0 && { borderTopWidth: 0 }]}>
                <View style={[styles.chapterNumBadge, idx === 0 && { backgroundColor: '#E8435A' }]}>
                  <Text style={[styles.chapterNum, idx === 0 && { color: '#fff' }]}>
                    {ch!.phase === 0 ? '0' : ch!.id}
                  </Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={[styles.chapterTitle, isDark && styles.textLight]}>{ch!.title[locale as 'en' | 'de']}</Text>
                  <Text style={styles.chapterPhase}>
                    {phases.find((p) => p.id === ch!.phase)?.title[locale as 'en' | 'de']}
                  </Text>
                </View>
                {idx === 0 && (
                  <View style={styles.startBadge}>
                    <Text style={styles.startBadgeText}>{locale === 'de' ? 'START' : 'START'}</Text>
                  </View>
                )}
              </View>
            ))}
            <Text style={[styles.journeyNote, isDark && styles.textMutedDark]}>
              {locale === 'de'
                ? '20 Kapitel, 5 Phasen — von den Basics bis zur Meisterschaft'
                : '20 chapters, 5 phases — from the basics to mastery'}
            </Text>
          </GlassCard>
        </Animated.View>

        <Text style={styles.settingsNote}>{t('onboarding.profileReveal.settingsNote')}</Text>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={[styles.bottomActions, isDark && styles.bottomActionsDark]}>
        <BrandButton title={t('onboarding.profileReveal.cta')} onPress={onComplete} />
      </Animated.View>
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

  /* Welcome */
  welcomeHero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeIconContainer: {
    marginBottom: 32,
  },
  welcomeIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#171717',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 16,
    lineHeight: 38,
  },
  welcomeBody: {
    fontSize: 17,
    lineHeight: 26,
    color: '#525252',
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  /* Bottom Actions */
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 10,
    backgroundColor: 'rgba(250,250,250,0.9)',
  },
  bottomActionsDark: {
    backgroundColor: 'rgba(23,23,23,0.9)',
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

  /* Summary / Reveal */
  revealHeader: {
    marginBottom: 20,
  },
  revealTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  revealSubtitle: {
    fontSize: 16,
    color: '#737373',
    marginTop: 6,
    lineHeight: 22,
  },
  revealCard: {
    marginBottom: 14,
  },
  revealCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8435A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  /* Coach row */
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  coachIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  coachSub: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },

  /* Chapter rows */
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  chapterRowDark: {
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  chapterNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E8435A',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    letterSpacing: -0.2,
  },
  chapterPhase: {
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 1,
  },
  startBadge: {
    backgroundColor: '#E8435A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  startBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  journeyNote: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },

  settingsNote: {
    fontSize: 12,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
