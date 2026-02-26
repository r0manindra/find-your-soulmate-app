import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { getPersonalization } from '@/src/core/personalization';
import { chapters, phases } from '@/src/data/content/chapters';
import { PhaseHeader } from './phase-header';
import { ChapterNode } from './chapter-node';


const ZIGZAG_PATTERN: ('left' | 'center' | 'right')[] = [
  'center',
  'right',
  'center',
  'left',
];

function getNodePosition(indexInPhase: number): 'left' | 'center' | 'right' {
  return ZIGZAG_PATTERN[indexInPhase % ZIGZAG_PATTERN.length];
}

function getChapterStatus(
  chapterId: number,
  completedChapters: number[]
): 'completed' | 'active' {
  if (completedChapters.includes(chapterId)) return 'completed';
  return 'active';
}

export function JourneyPath() {
  const { t } = useTranslation();
  const { completedChapters } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);
  const userProfile = useUserProfileStore();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const suggestedStart = useMemo(() => {
    if (!userProfile.hasCompletedOnboarding || !userProfile.skillLevel) return 1;
    return getPersonalization(userProfile).suggestedStartChapter;
  }, [userProfile]);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleAction = useCallback(
    (id: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push(`/chapter/${id}`);
    },
    [router]
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, isDark && styles.titleDark]}>{t('guide.title')}</Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{t('guide.subtitle')}</Text>
          </View>
        </View>

        {phases.map((phase) => {
          const phaseChapters = chapters.filter((c) => c.phase === phase.id);
          const completedInPhase = phaseChapters.filter((c) =>
            completedChapters.includes(c.id)
          ).length;

          return (
            <View key={phase.id} style={styles.phaseSection}>
              <PhaseHeader
                phase={phase}
                locale={locale}
                completedCount={completedInPhase}
                totalCount={phaseChapters.length}
                isDark={isDark}
              />

              <View style={styles.nodesContainer}>
                {phaseChapters.map((chapter, idx) => {
                  const status = getChapterStatus(chapter.id, completedChapters);
                  const position = getNodePosition(idx);
                  const isStartHere = chapter.id === suggestedStart && completedChapters.length === 0;
                  const isSkippable = chapter.id < suggestedStart && completedChapters.length === 0 && suggestedStart > 1;

                  return (
                    <View key={chapter.id}>
                      {idx > 0 && (
                        <View
                          style={[
                            styles.connector,
                            isDark && styles.connectorDark,
                            completedChapters.includes(chapter.id) && styles.connectorCompleted,
                          ]}
                        />
                      )}
                      {isStartHere && (
                        <View style={styles.startHereBadge}>
                          <Text style={styles.startHereText}>
                            {locale === 'de' ? 'Starte hier' : 'Start here'} →
                          </Text>
                        </View>
                      )}
                      <View style={isSkippable ? styles.skippableContainer : undefined}>
                        <ChapterNode
                          chapter={chapter}
                          status={status}
                          locale={locale}
                          position={position}
                          isExpanded={expandedId === chapter.id}
                          isDark={isDark}
                          onPress={() => toggleExpand(chapter.id)}
                          onAction={() => handleAction(chapter.id)}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeAreaDark: {
    backgroundColor: '#171717',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTextContainer: {},
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: '#171717',
  },
  titleDark: {
    color: '#F5F5F5',
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginTop: 4,
  },
  subtitleDark: {
    color: '#A3A3A3',
  },
  phaseSection: {
    marginBottom: 8,
  },
  nodesContainer: {
    paddingVertical: 8,
  },
  connector: {
    width: 2.5,
    height: 20,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    borderRadius: 1,
  },
  connectorDark: {
    backgroundColor: '#404040',
  },
  connectorCompleted: {
    backgroundColor: '#E8435A',
  },
  startHereBadge: {
    alignSelf: 'center',
    backgroundColor: '#E8435A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
  },
  startHereText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  skippableContainer: {
    opacity: 0.45,
  },
});
