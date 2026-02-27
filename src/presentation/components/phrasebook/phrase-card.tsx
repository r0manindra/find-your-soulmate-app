import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/src/store/auth-store';
import { usePhrasebookStore } from '@/src/store/phrasebook-store';
import type { Phrase } from '@/src/data/content/phrasebook';

interface PhraseCardProps {
  phrase: Phrase;
  locale: 'en' | 'de';
  accentColor: string;
}

export function PhraseCard({ phrase, locale, accentColor }: PhraseCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isPremium = useAuthStore((s) => s.isPremium);
  const { isSaved, toggleSaved } = usePhrasebookStore();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLocked = phrase.isPremium && !isPremium;
  const isVocab = phrase.categoryId === 'smart_vocabulary';
  const saved = isSaved(phrase.id);

  const handleCopy = async () => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(phrase.text[locale]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaved(phrase.id);
  };

  const handleExpand = () => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }
    setExpanded(!expanded);
  };

  // For locked vocabulary, hide the word entirely — only show the situation tag as teaser
  const displayText = isLocked && isVocab
    ? '••••••••• — ••••• •••••• •••• ••••• ••• •••••'
    : isLocked
      ? blurText(phrase.text[locale])
      : phrase.text[locale];

  return (
    <Pressable
      onPress={handleExpand}
      style={[styles.card, isDark && styles.cardDark]}
    >
      {/* Situation tag */}
      <View style={[styles.situationTag, { backgroundColor: `${accentColor}12` }]}>
        <Text style={[styles.situationText, { color: accentColor }]}>
          {phrase.situation[locale]}
        </Text>
      </View>

      {/* Phrase text */}
      <Text style={[styles.phraseText, isDark && styles.phraseTextDark, isLocked && styles.phraseTextLocked]}>
        {displayText}
      </Text>

      {/* Lock overlay for premium */}
      {isLocked && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed" size={14} color="#E8435A" />
          <Text style={styles.lockText}>PRO</Text>
        </View>
      )}

      {/* Expandable explanation — truncated for vocabulary */}
      {expanded && !isLocked && (
        <View style={[styles.explanationContainer, isDark && styles.explanationContainerDark]}>
          <Ionicons name="bulb-outline" size={14} color={accentColor} />
          <Text style={[styles.explanationText, isDark && styles.explanationTextDark]} numberOfLines={isVocab ? 2 : undefined}>
            {phrase.explanation[locale]}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable onPress={handleSave} style={styles.actionButton}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={saved ? accentColor : (isDark ? '#A3A3A3' : '#737373')}
          />
        </Pressable>
        <Pressable onPress={handleCopy} style={styles.actionButton}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={18}
            color={copied ? '#10B981' : (isDark ? '#A3A3A3' : '#737373')}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

function blurText(text: string): string {
  const words = text.split(' ');
  const visibleCount = Math.min(4, Math.ceil(words.length * 0.3));
  return words.slice(0, visibleCount).join(' ') + ' ••• •••• •••';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  cardDark: {
    backgroundColor: '#252525',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  situationTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  situationText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  phraseText: {
    fontSize: 16,
    lineHeight: 23,
    color: '#171717',
    fontWeight: '500',
  },
  phraseTextDark: {
    color: '#F5F5F5',
  },
  phraseTextLocked: {
    opacity: 0.4,
  },
  lockOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E8435A',
  },
  explanationContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  explanationContainerDark: {
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  explanationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#525252',
  },
  explanationTextDark: {
    color: '#A3A3A3',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});
