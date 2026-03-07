import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from 'react-i18next';
import { useChatHistoryStore, type Conversation } from '@/src/store/chat-history-store';
import { coachCharacters, getCharacter } from '@/src/data/content/coach-characters';
import { useUserProfileStore } from '@/src/store/user-profile-store';

interface ChatHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onNewChat: (characterId?: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

export function ChatHistoryModal({ visible, onClose, onNewChat }: ChatHistoryModalProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const conversations = useChatHistoryStore((s) => s.conversations);
  const activeConversationId = useChatHistoryStore((s) => s.activeConversationId);
  const setActiveConversation = useChatHistoryStore((s) => s.setActiveConversation);
  const deleteConversation = useChatHistoryStore((s) => s.deleteConversation);
  const userGender = useUserProfileStore((s) => s.userGender);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

  const filteredCharacters = coachCharacters.filter((c) => {
    const gender = userGender ?? 'male';
    if (gender === 'diverse') return true;
    return c.forGender === gender || c.forGender === 'all';
  });

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveConversation(id);
    onClose();
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteConversation(id);
  };

  const handleNewChatPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCharacterSelect((prev) => !prev);
  };

  const handleCharacterSelect = (characterId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCharacterSelect(false);
    onNewChat(characterId);
    onClose();
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const isActive = item.id === activeConversationId;
    const character = getCharacter(item.characterId);
    const lastMessage = item.messages[item.messages.length - 1];
    const preview = lastMessage?.content.slice(0, 60) ?? '';
    const title = item.title || t('coach.newChat');

    return (
      <Pressable
        onPress={() => handleSelect(item.id)}
        style={[
          styles.row,
          isDark && styles.rowDark,
          isActive && styles.rowActive,
          isActive && isDark && styles.rowActiveDark,
        ]}
      >
        <View style={[styles.rowIcon, { backgroundColor: `${character.color}15` }]}>
          <Ionicons name={character.icon as any} size={18} color={character.color} />
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowTop}>
            <Text style={[styles.rowTitle, isDark && styles.rowTitleDark]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.rowTime}>{formatRelativeTime(item.updatedAt)}</Text>
          </View>
          <View style={styles.characterBadge}>
            <Ionicons name={character.icon as any} size={10} color={character.color} />
            <Text style={[styles.characterBadgeText, { color: character.color }]}>
              {character.name}
            </Text>
          </View>
          <Text style={[styles.rowPreview, isDark && styles.rowPreviewDark]} numberOfLines={1}>
            {preview}
          </Text>
        </View>
        <Pressable
          onPress={() => handleDelete(item.id)}
          style={styles.deleteBtn}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color={isDark ? '#525252' : '#A3A3A3'} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('coach.chatHistory')}
          </Text>
          <Pressable onPress={onClose} style={[styles.closeBtn, isDark && styles.closeBtnDark]}>
            <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
          </Pressable>
        </View>

        <Pressable onPress={handleNewChatPress} style={styles.newChatBtn}>
          <LinearGradient
            colors={['#E8435A', '#FF7854']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.newChatGradient}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.newChatText}>{t('coach.startNewChat')}</Text>
          </LinearGradient>
        </Pressable>

        {showCharacterSelect && (
          <View style={styles.characterSelectContainer}>
            <Text style={[styles.characterSelectLabel, isDark && styles.characterSelectLabelDark]}>
              {t('coach.selectCharacter')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.characterSelectRow}>
              {filteredCharacters.map((char) => (
                <Pressable
                  key={char.id}
                  onPress={() => handleCharacterSelect(char.id)}
                  style={styles.characterSelectItem}
                >
                  <View style={[styles.characterSelectCircle, { backgroundColor: `${char.color}15`, borderColor: char.color }]}>
                    <Ionicons name={char.icon as any} size={22} color={char.color} />
                  </View>
                  <Text style={[styles.characterSelectName, isDark && styles.characterSelectNameDark]} numberOfLines={1}>
                    {char.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={40} color={isDark ? '#525252' : '#D4D4D4'} />
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                {t('coach.noChatsYet')}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  titleDark: { color: '#F5F5F5' },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  newChatBtn: { marginHorizontal: 20, marginTop: 16, marginBottom: 12 },
  newChatGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14,
  },
  newChatText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  characterSelectContainer: {
    paddingHorizontal: 20, marginBottom: 12,
  },
  characterSelectLabel: {
    fontSize: 13, color: '#737373', marginBottom: 10,
  },
  characterSelectLabelDark: { color: '#A3A3A3' },
  characterSelectRow: {
    gap: 14, paddingBottom: 4,
  },
  characterSelectItem: {
    alignItems: 'center', width: 60,
  },
  characterSelectCircle: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  characterSelectName: {
    fontSize: 11, fontWeight: '500', color: '#525252',
    marginTop: 4, textAlign: 'center',
  },
  characterSelectNameDark: { color: '#A3A3A3' },
  characterBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1,
  },
  characterBadgeText: {
    fontSize: 12, fontWeight: '500',
  },
  list: { paddingHorizontal: 20, gap: 2 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    borderRadius: 14,
  },
  rowDark: {},
  rowActive: { backgroundColor: 'rgba(232,67,90,0.06)' },
  rowActiveDark: { backgroundColor: 'rgba(232,67,90,0.12)' },
  rowIcon: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#171717', flex: 1, marginRight: 8 },
  rowTitleDark: { color: '#F5F5F5' },
  rowTime: { fontSize: 12, color: '#A3A3A3' },
  rowPreview: { fontSize: 13, color: '#737373', marginTop: 2 },
  rowPreviewDark: { color: '#525252' },
  deleteBtn: { padding: 4 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#A3A3A3' },
  emptyTextDark: { color: '#525252' },
});
