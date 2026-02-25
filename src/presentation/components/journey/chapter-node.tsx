import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import type { Chapter } from '@/src/core/entities/types';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NodeStatus = 'completed' | 'active' | 'locked';

interface ChapterNodeProps {
  chapter: Chapter;
  status: NodeStatus;
  locale: 'en' | 'de';
  position: 'left' | 'center' | 'right';
  isExpanded: boolean;
  isDark?: boolean;
  onPress: () => void;
  onAction: () => void;
}

export function ChapterNode({
  chapter,
  status,
  locale,
  position,
  isExpanded,
  isDark = false,
  onPress,
  onAction,
}: ChapterNodeProps) {
  const scale = useSharedValue(1);
  const nodeSize = status === 'active' ? 64 : 56;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (status === 'locked') return;
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (status === 'locked') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const alignment =
    position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';

  return (
    <View style={[styles.wrapper, { alignItems: alignment }]}>
      <View style={styles.nodeColumn}>
        <AnimatedPressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={[animatedStyle, styles.nodeContainer]}
        >
          {status === 'active' && (
            <LinearGradient
              colors={['#E8435A', '#FF7854']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.glowRing,
                { width: nodeSize + 8, height: nodeSize + 8, borderRadius: (nodeSize + 8) / 2 },
              ]}
            />
          )}
          <View
            style={[
              styles.node,
              isDark && styles.nodeDark,
              { width: nodeSize, height: nodeSize, borderRadius: nodeSize / 2 },
              status === 'completed' && styles.nodeCompleted,
              status === 'active' && styles.nodeActive,
              status === 'locked' && styles.nodeLocked,
              status === 'locked' && isDark && styles.nodeLockedDark,
            ]}
          >
            {status === 'completed' ? (
              <Ionicons name="checkmark" size={24} color="#fff" />
            ) : status === 'locked' ? (
              <Ionicons name="lock-closed" size={20} color="#A3A3A3" />
            ) : (
              <Ionicons name={chapter.ionicon as any} size={24} color={status === 'active' ? '#E8435A' : '#525252'} />
            )}
          </View>
        </AnimatedPressable>

        <Text
          style={[
            styles.nodeLabel,
            isDark && styles.nodeLabelDark,
            status === 'locked' && styles.nodeLabelLocked,
            status === 'active' && styles.nodeLabelActive,
          ]}
          numberOfLines={2}
        >
          {chapter.title[locale]}
        </Text>
      </View>

      {isExpanded && status !== 'locked' && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.expandedCardWrapper}
        >
          <GlassCard style={styles.expandedCard} borderRadius={16} padding={16}>
            <Text style={[styles.expandedChapter, isDark && styles.expandedChapterDark]}>
              {locale === 'de' ? 'Kapitel' : 'Chapter'} {chapter.id}
            </Text>
            <Text style={[styles.expandedTitle, isDark && styles.expandedTitleDark]}>{chapter.title[locale]}</Text>
            <Text style={[styles.expandedSubtitle, isDark && styles.expandedSubtitleDark]}>{chapter.subtitle[locale]}</Text>
            <Text style={[styles.expandedSummary, isDark && styles.expandedSummaryDark]} numberOfLines={3}>
              {chapter.summary[locale]}
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onAction();
              }}
              style={[
                styles.actionButton,
                status === 'completed' && styles.actionButtonCompleted,
              ]}
            >
              <Text style={[styles.actionText, status === 'completed' && styles.actionTextCompleted]}>
                {status === 'completed'
                  ? locale === 'de' ? 'Nochmal lesen' : 'Read Again'
                  : locale === 'de' ? 'Kapitel öffnen' : 'Open Chapter'}
              </Text>
            </Pressable>
          </GlassCard>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  nodeColumn: {
    alignItems: 'center',
    width: 100,
  },
  nodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  nodeDark: {
    backgroundColor: '#262626',
    borderColor: '#404040',
  },
  nodeCompleted: {
    backgroundColor: '#E8435A',
    borderColor: '#E8435A',
  },
  nodeActive: {
    borderColor: '#E8435A',
    backgroundColor: '#fff',
  },
  nodeLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
    opacity: 0.6,
  },
  nodeLockedDark: {
    backgroundColor: '#1C1C1C',
    borderColor: '#404040',
  },
  nodeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#525252',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  nodeLabelDark: {
    color: '#A3A3A3',
  },
  nodeLabelLocked: {
    color: '#A3A3A3',
  },
  nodeLabelActive: {
    color: '#E8435A',
    fontWeight: '700',
  },
  expandedCardWrapper: {
    marginTop: 12,
    width: 280,
  },
  expandedCard: {},
  expandedChapter: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A3A3A3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  expandedChapterDark: {
    color: '#737373',
  },
  expandedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  expandedTitleDark: {
    color: '#F5F5F5',
  },
  expandedSubtitle: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 8,
  },
  expandedSubtitleDark: {
    color: '#A3A3A3',
  },
  expandedSummary: {
    fontSize: 14,
    color: '#525252',
    lineHeight: 20,
    marginBottom: 12,
  },
  expandedSummaryDark: {
    color: '#D4D4D4',
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(232,67,90,0.08)',
  },
  actionButtonCompleted: {
    backgroundColor: 'rgba(232,67,90,0.04)',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E8435A',
  },
  actionTextCompleted: {
    color: '#A3A3A3',
  },
});
