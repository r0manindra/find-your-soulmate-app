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
import { useSettingsStore, type ThemeMode } from '@/src/store/settings-store';
import { useProgressStore } from '@/src/store/progress-store';
import { getPersonalization } from '@/src/core/personalization';
import { getCharacter } from '@/src/data/content/coach-characters';
import { chapters } from '@/src/data/content/chapters';
import type { SocialEnergy, AgeGroup, BasicsLevel, SkillLevel, Goal, UserGender } from '@/src/store/user-profile-store';

const TOTAL_PAGES = 9;

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
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setCharacterId = useSettingsStore((s) => s.setCharacterId);

  const {
    userGender, socialEnergy, ageGroup, basicsLevel, skillLevel, goal,
    setUserGender, setSocialEnergy, setAgeGroup, setBasicsLevel, setSkillLevel, setGoal,
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
    const personalization = getPersonalization({ userGender, socialEnergy, ageGroup, basicsLevel, skillLevel, goal });
    const currentCharacterId = useSettingsStore.getState().selectedCharacterId;
    if (currentCharacterId === 'charismo' || currentCharacterId === 'bestfriend') {
      setCharacterId(personalization.recommendedCharacterId);
    }
    completeOnboarding();
    router.replace('/(tabs)');
  }, [userGender, socialEnergy, ageGroup, basicsLevel, skillLevel, goal, completeOnboarding, setCharacterId, router]);

  const personalization = useMemo(
    () => getPersonalization({ userGender, socialEnergy, ageGroup, basicsLevel, skillLevel, goal }),
    [userGender, socialEnergy, ageGroup, basicsLevel, skillLevel, goal],
  );

  const recommendedCharacter = useMemo(
    () => getCharacter(personalization.recommendedCharacterId),
    [personalization.recommendedCharacterId],
  );

  const suggestedChapter = useMemo(
    () => chapters.find((c) => c.id === personalization.suggestedStartChapter),
    [personalization.suggestedStartChapter],
  );

  const renderPage = useCallback(({ item }: { item: number }) => {
    switch (item) {
      case 0: return <WelcomePage locale={locale} t={t} onAdvance={advance} onSkip={handleSkip} isDark={isDark} />;
      case 1: return (
        <AppearancePage
          isDark={isDark}
          t={t}
          themeMode={themeMode}
          onSelect={(mode) => {
            setThemeMode(mode);
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
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
          title={t('onboarding.socialEnergy.title')}
          subtitle={t('onboarding.socialEnergy.subtitle')}
          footnote={t('onboarding.socialEnergy.footnote')}
          options={[
            { emoji: '🛋️', label: t('onboarding.socialEnergy.introvert'), value: 'introvert' as const },
            { emoji: '⚖️', label: t('onboarding.socialEnergy.ambivert'), value: 'ambivert' as const },
            { emoji: '🎉', label: t('onboarding.socialEnergy.extrovert'), value: 'extrovert' as const },
            { emoji: '🏠', label: t('onboarding.socialEnergy.deepIntrovert'), value: 'deep_introvert' as const },
          ]}
          selected={socialEnergy}
          onSelect={(value) => {
            setSocialEnergy(value as SocialEnergy);
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
      case 4: return (
        <QuestionPage
          locale={locale}
          isDark={isDark}
          title={t('onboarding.ageGroup.title')}
          subtitle={t('onboarding.ageGroup.subtitle')}
          options={[
            { emoji: '📱', label: t('onboarding.ageGroup.age_18_24'), value: 'age_18_24' as const },
            { emoji: '💔', label: t('onboarding.ageGroup.age_25_34'), value: 'age_25_34' as const },
            { emoji: '💼', label: t('onboarding.ageGroup.age_35_44'), value: 'age_35_44' as const },
            { emoji: '🎩', label: t('onboarding.ageGroup.age_45_plus'), value: 'age_45_plus' as const },
          ]}
          selected={ageGroup}
          onSelect={(value) => {
            setAgeGroup(value as AgeGroup);
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
      case 5: return (
        <QuestionPage
          locale={locale}
          isDark={isDark}
          title={t(`onboarding.basics.${g}.title`)}
          subtitle={t(`onboarding.basics.${g}.subtitle`)}
          options={[
            { emoji: '🧼', label: t(`onboarding.basics.${g}.none`), value: 'basics_none' as const },
            { emoji: '🚿', label: t(`onboarding.basics.${g}.some`), value: 'basics_some' as const },
            { emoji: '💅', label: t(`onboarding.basics.${g}.solid`), value: 'basics_solid' as const },
            { emoji: '👑', label: t(`onboarding.basics.${g}.mastered`), value: 'basics_mastered' as const },
          ]}
          selected={basicsLevel}
          onSelect={(value) => {
            setBasicsLevel(value as BasicsLevel);
            setTimeout(advance, 400);
          }}
          width={width}
        />
      );
      case 6: return (
        <QuestionPage
          locale={locale}
          isDark={isDark}
          title={t('onboarding.skillLevel.title')}
          subtitle={t('onboarding.skillLevel.subtitle')}
          question={t('onboarding.skillLevel.question')}
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
      case 7: return (
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
      case 8: return (
        <ProfileRevealPage
          locale={locale}
          isDark={isDark}
          t={t}
          personalization={personalization}
          recommendedCharacter={recommendedCharacter}
          suggestedChapter={suggestedChapter}
          socialEnergy={socialEnergy}
          basicsLevel={basicsLevel}
          skillLevel={skillLevel}
          goal={goal}
          onComplete={handleComplete}
        />
      );
      default: return null;
    }
  }, [
    locale, t, width, g, isDark, themeMode, userGender, socialEnergy, ageGroup, basicsLevel, skillLevel, goal,
    personalization, recommendedCharacter, suggestedChapter,
    advance, handleSkip, handleComplete,
    setUserGender, setSocialEnergy, setAgeGroup, setBasicsLevel, setSkillLevel, setGoal, setThemeMode,
  ]);

  const pages = useMemo(() => [0, 1, 2, 3, 4, 5, 6, 7, 8], []);

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

/* ---------- Appearance Page ---------- */

const APPEARANCE_OPTIONS: { mode: ThemeMode; icon: string; emoji: string }[] = [
  { mode: 'light', icon: 'sunny', emoji: '☀️' },
  { mode: 'dark', icon: 'moon', emoji: '🌙' },
  { mode: 'system', icon: 'phone-portrait', emoji: '📱' },
];

function AppearancePage({
  isDark,
  t,
  themeMode,
  onSelect,
  width,
}: {
  isDark: boolean;
  t: any;
  themeMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
  width: number;
}) {
  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.questionHeader}>
          <Text style={[styles.questionTitle, isDark && styles.textLight]}>{t('onboarding.appearance.title')}</Text>
          <Text style={[styles.questionSubtitle, isDark && styles.textMutedDark]}>{t('onboarding.appearance.subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.optionsList}>
          {APPEARANCE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.mode}
              emoji={opt.emoji}
              label={t(`onboarding.appearance.${opt.mode}`)}
              note={t(`onboarding.appearance.${opt.mode}Note`)}
              selected={themeMode === opt.mode}
              onSelect={() => onSelect(opt.mode)}
            />
          ))}
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
          {options.map((opt, i) => (
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

/* ---------- Profile Reveal Page ---------- */

function ProfileRevealPage({
  locale,
  isDark,
  t,
  personalization,
  recommendedCharacter,
  suggestedChapter,
  socialEnergy,
  basicsLevel,
  skillLevel,
  goal,
  onComplete,
}: {
  locale: string;
  isDark: boolean;
  t: any;
  personalization: ReturnType<typeof getPersonalization>;
  recommendedCharacter: ReturnType<typeof getCharacter>;
  suggestedChapter: typeof chapters[number] | undefined;
  socialEnergy: string | null;
  basicsLevel: string | null;
  skillLevel: string | null;
  goal: string | null;
  onComplete: () => void;
}) {
  const { width } = useWindowDimensions();
  const showSkipNote = skillLevel === 'advanced' || skillLevel === 'expert';
  const startsAtBasics = personalization.suggestedStartChapter === 21;

  const socialLabel = socialEnergy
    ? t(`onboarding.profile.labels.${socialEnergy}`)
    : '—';
  const basicsLabel = basicsLevel
    ? t(`onboarding.profile.labels.${basicsLevel}`)
    : '—';
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

        {/* Profile Summary Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <GlassCard style={styles.revealCard}>
            <Text style={styles.revealCardTitle}>{t('onboarding.profileReveal.profileTitle')}</Text>
            <View style={styles.revealGrid}>
              <View style={styles.revealStat}>
                <Text style={styles.revealStatEmoji}>⚡</Text>
                <Text style={[styles.revealStatValue, isDark && styles.textLight]}>{socialLabel}</Text>
              </View>
              <View style={styles.revealStat}>
                <Text style={styles.revealStatEmoji}>🧼</Text>
                <Text style={[styles.revealStatValue, isDark && styles.textLight]}>{basicsLabel}</Text>
              </View>
              <View style={styles.revealStat}>
                <Text style={styles.revealStatEmoji}>📊</Text>
                <Text style={[styles.revealStatValue, isDark && styles.textLight]}>{skillLabel}</Text>
              </View>
              <View style={styles.revealStat}>
                <Text style={styles.revealStatEmoji}>🎯</Text>
                <Text style={[styles.revealStatValue, isDark && styles.textLight]}>{goalLabel}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Plan Card */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <GlassCard style={styles.revealCard}>
            <Text style={styles.revealCardTitle}>{t('onboarding.profileReveal.planTitle')}</Text>

            {/* Coach */}
            <View style={[styles.planRow, isDark && styles.planRowDark]}>
              <View style={[styles.planIcon, { backgroundColor: `${recommendedCharacter.color}15` }]}>
                <Ionicons name={recommendedCharacter.icon as any} size={22} color={recommendedCharacter.color} />
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planLabel}>{t('onboarding.profileReveal.coach')}</Text>
                <Text style={[styles.planValue, isDark && styles.textLight]}>{recommendedCharacter.name}</Text>
                <Text style={[styles.planSub, isDark && styles.textMutedDark]}>{recommendedCharacter.subtitle[locale as 'en' | 'de']}</Text>
              </View>
            </View>

            {/* Starting Chapter */}
            {suggestedChapter && (
              <View style={[styles.planRow, isDark && styles.planRowDark]}>
                <View style={styles.planIcon}>
                  <Ionicons name={suggestedChapter.ionicon as any} size={22} color="#E8435A" />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planLabel}>{t('onboarding.profileReveal.startingChapter')}</Text>
                  <Text style={[styles.planValue, isDark && styles.textLight]}>
                    {suggestedChapter.phase === 0
                      ? suggestedChapter.title[locale as 'en' | 'de']
                      : `${locale === 'de' ? 'Kapitel' : 'Chapter'} ${suggestedChapter.id}: ${suggestedChapter.title[locale as 'en' | 'de']}`}
                  </Text>
                  {showSkipNote && (
                    <Text style={styles.planSkipNote}>{t('onboarding.profileReveal.skipNote')}</Text>
                  )}
                  {startsAtBasics && (
                    <Text style={styles.planSkipNote}>{t('onboarding.profileReveal.basicsNote')}</Text>
                  )}
                </View>
              </View>
            )}
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

  /* Profile Reveal */
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
  revealGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  revealStat: {
    alignItems: 'center',
    gap: 6,
  },
  revealStatEmoji: {
    fontSize: 24,
  },
  revealStatValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
    textAlign: 'center',
  },

  /* Plan rows */
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  planRowDark: {
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A3A3A3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  planSub: {
    fontSize: 13,
    color: '#737373',
    marginTop: 1,
  },
  planSkipNote: {
    fontSize: 12,
    color: '#E8435A',
    fontWeight: '600',
    marginTop: 3,
  },
  settingsNote: {
    fontSize: 12,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
