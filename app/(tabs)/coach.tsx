import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, ScrollView, Modal, StyleSheet, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUIStore } from '@/src/store/ui-store';
import { useHabitStore } from '@/src/store/habit-store';
import { coachCharacters, getCharacter } from '@/src/data/content/coach-characters';
import { chapters } from '@/src/data/content/chapters';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { getPersonalization } from '@/src/core/personalization';
import * as api from '@/src/services/api';
import type { JourneyContext } from '@/src/services/api';
import type { ChatMessage } from '@/src/core/entities/types';

const FALLBACK_RESPONSES = [
  "Good question. Here's the thing — confidence isn't about knowing all the answers. It's about being comfortable not knowing. That's what makes someone magnetic.",
  "Listen, I get it. Approaching someone feels like defusing a bomb. But here's the secret: they're probably just as nervous. Start with something genuine — comment on something real in the moment.",
  "The biggest mistake I see? Trying to be someone you're not. The right person will love the real you — weird quirks, awkward pauses, and all. Authenticity is the ultimate cheat code.",
  "Let me be real with you — rejection isn't about you. It's about timing, circumstances, chemistry. Don't take it personally. The best players in the game have the most strikeouts. Keep swinging.",
  "Here's what separates the amateurs from the naturals: listening. Most people are just waiting for their turn to talk. Actually listen. Ask follow-up questions. Make them feel seen.",
];

export default function CoachScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const incrementChatCount = useProgressStore((s) => s.incrementChatCount);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isPremium = useAuthStore((s) => s.isPremium);
  const locale = useSettingsStore((s) => s.locale);
  const selectedCharacterId = useSettingsStore((s) => s.selectedCharacterId);
  const setCharacterId = useSettingsStore((s) => s.setCharacterId);

  const userProfile = useUserProfileStore();
  const progressStore = useProgressStore();
  const habitStore = useHabitStore();
  const recommendedCharacterId = userProfile.hasCompletedOnboarding
    ? getPersonalization(userProfile).recommendedCharacterId
    : null;

  // Chapter order from phases — used to determine current chapter
  const chapterOrder = React.useMemo(
    () => [21, 22, 23, 24, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    []
  );

  const buildJourneyContext = useCallback((): JourneyContext => {
    const completed = progressStore.completedChapters;
    const currentChapterId = chapterOrder.find((id) => !completed.includes(id)) ?? null;
    const activeHabits = habitStore.getActiveHabits();
    const activeWithStreaks = activeHabits.map((h) => ({
      name: h.title[locale] || h.title.en,
      currentStreak: habitStore.getStreak(h.id).current,
    }));

    return {
      profile: {
        gender: userProfile.userGender,
        ageGroup: userProfile.ageGroup,
        skillLevel: userProfile.skillLevel,
        socialEnergy: userProfile.socialEnergy,
        basicsLevel: userProfile.basicsLevel,
        goal: userProfile.goal,
      },
      progress: {
        completedChapters: completed,
        currentChapterId,
        streak: progressStore.streak,
        graduated: progressStore.graduated,
      },
      habits: {
        active: activeWithStreaks,
        todayCompleted: habitStore.getTodayCompletedCount(),
        todayTotal: habitStore.getTodayTotalCount(),
        weeklyCompletionRate: habitStore.getWeeklyCompletionRate(),
      },
      locale,
    };
  }, [progressStore, habitStore, userProfile, locale, chapterOrder]);

  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: t('coach.greeting'),
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [messagesLimit, setMessagesLimit] = useState<number | null>(5);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeCharacter = getCharacter(selectedCharacterId);
  const insets = useSafeAreaInsets();
  const setChatInputFocused = useUIStore((s) => s.setChatInputFocused);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Tab bar height for when it's visible
  const tabBarHeight = 64 + insets.bottom + 12;

  // Track keyboard visibility
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    setChatInputFocused(true);
  }, [setChatInputFocused]);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    setChatInputFocused(false);
  }, [setChatInputFocused]);

  // When tab bar is hidden (input focused + keyboard visible), use minimal bottom padding
  const inputBottomPadding = (isInputFocused && keyboardVisible) ? insets.bottom : tabBarHeight + 8;

  // Load chat history from backend if logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    api.getCoachHistory().then(({ messages: history }) => {
      if (history.length > 0) {
        const mapped: ChatMessage[] = history.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.createdAt).getTime(),
        }));
        setMessages([
          { id: '0', role: 'assistant', content: t('coach.greeting'), timestamp: 0 },
          ...mapped,
        ]);
      }
    }).catch(() => {});
  }, [isLoggedIn]);

  const handleSelectCharacter = (id: string) => {
    const char = getCharacter(id);
    if (char.isPremium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      setShowCharacterPicker(false);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCharacterId(id);
    setShowCharacterPicker(false);
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    incrementChatCount();

    try {
      if (isLoggedIn) {
        const context = buildJourneyContext();
        const data = await api.sendCoachMessage(userMessage.content, selectedCharacterId, context);
        setMessagesUsed(data.messagesUsed);
        setMessagesLimit(data.messagesLimit);

        const aiMessage: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        const aiMessage: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err: any) {
      const errorMsg = err?.status === 429
        ? t('coach.limitReached')
        : err?.status === 403
          ? (locale === 'de' ? 'Premium erforderlich für diesen Charakter' : 'Premium required for this character')
          : t('coach.errorMessage');
      const aiMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: errorMsg,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, incrementChatCount, isLoggedIn, selectedCharacterId, locale, t, buildJourneyContext]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: `${activeCharacter.color}15` }]}>
            <Ionicons name={activeCharacter.icon as any} size={18} color={activeCharacter.color} />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser && styles.userText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={isInputFocused ? 0 : 90}
      >
        {/* Header with character selector */}
        <Pressable onPress={() => setShowCharacterPicker(true)} style={styles.header}>
          <LinearGradient
            colors={[activeCharacter.color, `${activeCharacter.color}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons name={activeCharacter.icon as any} size={32} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{activeCharacter.name}</Text>
              <Text style={styles.headerSubtitle}>{activeCharacter.subtitle[locale]}</Text>
            </View>
            <View style={styles.headerRight}>
              {!isPremium && messagesLimit && (
                <View style={styles.limitBadge}>
                  <Text style={styles.limitText}>{messagesUsed}/{messagesLimit}</Text>
                </View>
              )}
              <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.7)" />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Upgrade banners */}
        {!isLoggedIn && (
          <Pressable onPress={() => router.push('/auth/register')} style={styles.upgradeBanner}>
            <Ionicons name="sparkles" size={16} color="#E8435A" />
            <Text style={styles.upgradeBannerText}>{t('coach.signInForAI')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#E8435A" />
          </Pressable>
        )}
        {isLoggedIn && !isPremium && (
          <Pressable onPress={() => router.push('/paywall')} style={styles.upgradeBanner}>
            <Ionicons name="diamond" size={16} color="#E8435A" />
            <Text style={styles.upgradeBannerText}>{t('coach.upgradeForUnlimited')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#E8435A" />
          </Pressable>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.messageRow}>
                <View style={[styles.avatarContainer, { backgroundColor: `${activeCharacter.color}15` }]}>
                  <Ionicons name={activeCharacter.icon as any} size={18} color={activeCharacter.color} />
                </View>
                <View style={styles.aiBubble}>
                  <Text style={styles.loadingText}>{t('coach.sending')}</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: inputBottomPadding }, isDark && styles.inputContainerDark]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t('coach.placeholder')}
            placeholderTextColor="#A3A3A3"
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <Pressable
            onPress={sendMessage}
            style={[styles.sendButton, { backgroundColor: activeCharacter.color }, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Character Picker Modal */}
        <Modal
          visible={showCharacterPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCharacterPicker(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {locale === 'de' ? 'Wähle deinen Coach' : 'Choose Your Coach'}
              </Text>
              <Pressable onPress={() => setShowCharacterPicker(false)} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#737373" />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>
              {locale === 'de'
                ? 'Jeder Coach hat seinen eigenen Stil. Finde den, der zu dir passt.'
                : 'Each coach has their own style. Find the one that fits you.'}
            </Text>
            <ScrollView contentContainerStyle={styles.characterList} showsVerticalScrollIndicator={false}>
              {coachCharacters.filter((c) => {
                const gender = userProfile.userGender ?? 'male';
                return c.forGender === gender || c.forGender === 'all';
              }).map((char) => {
                const isSelected = char.id === selectedCharacterId;
                const isLocked = char.isPremium && !isPremium;

                return (
                  <Pressable
                    key={char.id}
                    onPress={() => handleSelectCharacter(char.id)}
                    style={[
                      styles.characterCard,
                      isSelected && { borderColor: char.color, borderWidth: 2 },
                    ]}
                  >
                    <View style={styles.characterCardHeader}>
                      <View style={[styles.characterIcon, { backgroundColor: `${char.color}15` }]}>
                        <Ionicons name={char.icon as any} size={24} color={char.color} />
                      </View>
                      <View style={styles.characterInfo}>
                        <View style={styles.characterNameRow}>
                          <Text style={styles.characterName}>{char.name}</Text>
                          {char.id === recommendedCharacterId && !isSelected && (
                            <View style={styles.recommendedBadge}>
                              <Ionicons name="sparkles" size={10} color="#F59E0B" />
                              <Text style={styles.recommendedBadgeText}>
                                {locale === 'de' ? 'Empfohlen' : 'Recommended'}
                              </Text>
                            </View>
                          )}
                          {isLocked && (
                            <View style={styles.proBadge}>
                              <Ionicons name="lock-closed" size={10} color="#E8435A" />
                              <Text style={styles.proBadgeText}>PRO</Text>
                            </View>
                          )}
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={20} color={char.color} />
                          )}
                        </View>
                        <Text style={styles.characterSubtitle}>{char.subtitle[locale]}</Text>
                      </View>
                    </View>
                    <Text style={styles.characterDescription}>{char.description[locale]}</Text>
                    {char.inspiration && (
                      <Text style={styles.characterInspiration}>
                        {locale === 'de' ? 'Inspiriert von' : 'Inspired by'}: {char.inspiration}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 20,
  },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  limitBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  limitText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: 'rgba(232,67,90,0.06)', borderRadius: 12,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#E8435A' },
  messageList: { paddingHorizontal: 20, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  messageRowUser: { justifyContent: 'flex-end' },
  avatarContainer: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  messageBubble: { maxWidth: '75%', padding: 14, borderRadius: 20 },
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    borderBottomLeftRadius: 4,
  },
  userBubble: { backgroundColor: '#E8435A', borderBottomRightRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22, color: '#171717' },
  userText: { color: '#fff' },
  loadingText: { fontSize: 14, color: '#A3A3A3', fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(250,250,250,0.95)',
  },
  inputContainerDark: {
    backgroundColor: 'rgba(23,23,23,0.95)',
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 16, color: '#171717',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)',
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },

  // Character picker modal
  modalSafeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4,
  },
  modalTitle: { fontSize: 28, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  modalClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 15, color: '#737373', paddingHorizontal: 20, marginTop: 4, marginBottom: 20,
  },
  characterList: { paddingHorizontal: 20, gap: 12 },
  characterCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  characterCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  characterIcon: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  characterInfo: { flex: 1 },
  characterNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  characterName: { fontSize: 18, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  characterSubtitle: { fontSize: 13, color: '#737373', marginTop: 2 },
  recommendedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  recommendedBadgeText: { fontSize: 10, fontWeight: '700', color: '#F59E0B' },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(232,67,90,0.08)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  proBadgeText: { fontSize: 10, fontWeight: '800', color: '#E8435A' },
  characterDescription: { fontSize: 14, lineHeight: 20, color: '#525252' },
  characterInspiration: {
    fontSize: 12, color: '#A3A3A3', fontStyle: 'italic', marginTop: 8,
  },
});
