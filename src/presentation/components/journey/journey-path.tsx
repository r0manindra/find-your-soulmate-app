import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useProgressStore } from '@/src/store/progress-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { chapters, phases } from '@/src/data/content/chapters';
import { PhaseHeader } from './phase-header';
import { ChapterNode } from './chapter-node';

const FREE_CHAPTERS = 4;

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
): 'completed' | 'active' | 'locked' {
  if (completedChapters.includes(chapterId)) return 'completed';
  if (chapterId === 1) return 'active';
  if (completedChapters.includes(chapterId - 1)) return 'active';
  return 'locked';
}

export function JourneyPath() {
  const { t } = useTranslation();
  const { completedChapters } = useProgressStore();
  const locale = useSettingsStore((s) => s.locale);
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleAction = useCallback(
    (id: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // TODO: check subscription status for premium chapters
      if (id > FREE_CHAPTERS) {
        router.push('/paywall');
        return;
      }
      router.push(`/chapter/${id}`);
    },
    [router]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t('guide.title')}</Text>
            <Text style={styles.subtitle}>{t('guide.subtitle')}</Text>
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
              />

              <View style={styles.nodesContainer}>
                {phaseChapters.map((chapter, idx) => {
                  const status = getChapterStatus(chapter.id, completedChapters);
                  const position = getNodePosition(idx);

                  return (
                    <View key={chapter.id}>
                      {idx > 0 && (
                        <View
                          style={[
                            styles.connector,
                            completedChapters.includes(chapter.id) && styles.connectorCompleted,
                          ]}
                        />
                      )}
                      <ChapterNode
                        chapter={chapter}
                        status={status}
                        locale={locale}
                        position={position}
                        isExpanded={expandedId === chapter.id}
                        onPress={() => toggleExpand(chapter.id)}
                        onAction={() => handleAction(chapter.id)}
                      />
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
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginTop: 4,
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
  connectorCompleted: {
    backgroundColor: '#E8435A',
  },
});
