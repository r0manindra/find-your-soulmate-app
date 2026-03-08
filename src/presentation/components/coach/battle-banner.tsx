import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useUIStore } from '@/src/store/ui-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { getBattleCharacter } from '@/src/data/content/battle-characters';

interface BattleBannerProps {
  onEndBattle: () => void;
}

export function BattleBanner({ onEndBattle }: BattleBannerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const locale = useSettingsStore((s) => s.locale);
  const characterId = useUIStore((s) => s.activeBattleCharacterId);
  const messageCount = useUIStore((s) => s.battleMessageCount);

  if (!characterId) return null;

  const character = getBattleCharacter(characterId);
  if (!character) return null;

  const handleEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onEndBattle();
  };

  return (
    <View style={[styles.banner, { backgroundColor: `${character.color}12` }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${character.color}20` }]}>
        <Ionicons name={character.icon as any} size={16} color={character.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>
          {character.name}
        </Text>
        <Text style={[styles.counter, { color: character.color }]}>
          {locale === 'de' ? `Nachricht ${messageCount}/10` : `Message ${messageCount}/10`}
        </Text>
      </View>
      <Pressable onPress={handleEnd} style={[styles.endButton, { borderColor: character.color }]}>
        <Text style={[styles.endButtonText, { color: character.color }]}>
          {locale === 'de' ? 'Score' : 'End & Score'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  nameDark: {
    color: '#F5F5F5',
  },
  counter: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  endButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  endButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
