import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, ScrollView, Modal, StyleSheet, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUIStore } from '@/src/store/ui-store';
import { useHabitStore } from '@/src/store/habit-store';
import { useChatHistoryStore } from '@/src/store/chat-history-store';
import { coachCharacters, getCharacter } from '@/src/data/content/coach-characters';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { getPersonalization } from '@/src/core/personalization';
import * as api from '@/src/services/api';
import type { JourneyContext } from '@/src/services/api';
import type { ChatMessage } from '@/src/core/entities/types';
import { ExerciseBanner } from '@/src/presentation/components/coach/exercise-banner';
import { getExerciseMode } from '@/src/data/content/exercise-modes';
import { ExerciseModeModal } from '@/src/presentation/components/coach/exercise-mode-modal';
import { ChatHistoryModal } from '@/src/presentation/components/coach/chat-history-modal';
import { OutOfHeartsModal } from '@/src/presentation/components/ui/out-of-hearts-modal';
import { BattleBanner } from '@/src/presentation/components/coach/battle-banner';
import { BattleCharacterModal } from '@/src/presentation/components/coach/battle-character-modal';
import { getBattleCharacter, type BattleCharacter } from '@/src/data/content/battle-characters';
import { useHeartsStore } from '@/src/store/hearts-store';
import { HEART_COSTS } from '@/src/config/heart-costs';

function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return time;
  if (isYesterday) return `Yesterday ${time}`;
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`;
}

const FALLBACK_RESPONSE = {
  en: "Hey! I'd love to chat with you properly, but I need you to create a free account first so I can remember our conversations and give you personalized advice. Sign up above — it only takes a few seconds!",
  de: "Hey! Ich würde mich gerne richtig mit dir unterhalten, aber dafür brauchst du einen kostenlosen Account, damit ich mir unsere Gespräche merken und dir persönliche Tipps geben kann. Melde dich oben an — dauert nur ein paar Sekunden!",
};

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
  const hasSeenCoachIntro = useSettingsStore((s) => s.hasSeenCoachIntro);
  const setHasSeenCoachIntro = useSettingsStore((s) => s.setHasSeenCoachIntro);

  const userProfile = useUserProfileStore();
  const recommendedCharacterId = userProfile.hasCompletedOnboarding
    ? getPersonalization(userProfile).recommendedCharacterId
    : null;

  // Chat history store
  const chatStore = useChatHistoryStore();
  const activeConversation = chatStore.getActiveConversation();
  const messages = activeConversation?.messages ?? [];

  // Chapter order from phases — used to determine current chapter
  const chapterOrder = React.useMemo(
    () => [21, 22, 23, 24, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    []
  );

  const buildJourneyContext = useCallback((): JourneyContext => {
    // Read fresh state directly from the store to avoid stale closures
    const freshProgress = useProgressStore.getState();
    const completed = freshProgress.completedChapters;
    const currentChapterId = chapterOrder.find((id) => !completed.includes(id)) ?? null;
    const freshHabits = useHabitStore.getState();
    const activeHabits = freshHabits.getActiveHabits();
    const activeWithStreaks = activeHabits.map((h) => ({
      name: h.title[locale] || h.title.en,
      currentStreak: freshHabits.getStreak(h.id).current,
    }));
    const freshProfile = useUserProfileStore.getState();

    return {
      profile: {
        gender: freshProfile.userGender,
        ageGroup: freshProfile.ageGroup,
        skillLevel: freshProfile.skillLevel,
        socialEnergy: freshProfile.socialEnergy,
        basicsLevel: freshProfile.basicsLevel,
        goal: freshProfile.goal,
      },
      progress: {
        completedChapters: completed,
        currentChapterId,
        streak: freshProgress.streak,
        graduated: freshProgress.graduated,
      },
      habits: {
        active: activeWithStreaks,
        todayCompleted: freshHabits.getTodayCompletedCount(),
        todayTotal: freshHabits.getTodayTotalCount(),
        weeklyCompletionRate: freshHabits.getWeeklyCompletionRate(),
      },
      locale,
    };
  }, [locale, chapterOrder]);

  const activeExerciseMode = useUIStore((s) => s.activeExerciseMode);
  const setExerciseMode = useUIStore((s) => s.setExerciseMode);

  const [showCoachesHistoryModal, setShowCoachesHistoryModal] = useState(false);
  const [coachesHistoryTab, setCoachesHistoryTab] = useState<'coaches' | 'history'>('coaches');
  const [showExerciseModeModal, setShowExerciseModeModal] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Battle mode state
  const activeBattleCharacterId = useUIStore((s) => s.activeBattleCharacterId);
  const setBattleCharacter = useUIStore((s) => s.setBattleCharacter);
  const incrementBattleMessageCount = useUIStore((s) => s.incrementBattleMessageCount);
  const resetBattle = useUIStore((s) => s.resetBattle);
  const isBattleActive = !!activeBattleCharacterId;

  const canSpend = useHeartsStore((s) => s.canSpend);
  const spendHearts = useHeartsStore((s) => s.spendHearts);
  const heartsAvailable = useHeartsStore((s) => s.dailyHearts + s.bonusHearts);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeConvCharacterId = activeConversation?.characterId ?? selectedCharacterId;
  const activeCharacter = getCharacter(activeConvCharacterId);
  // Lock chat if active conversation uses a premium character the user no longer has access to
  const isConvLocked = activeCharacter.isPremium && !isPremium;
  const insets = useSafeAreaInsets();
  const setChatInputFocused = useUIStore((s) => s.setChatInputFocused);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Floating pill tab bar: 56px tabs + 16px padding + 1px border = 73px pill
  // Wrapper adds insets.bottom + 12px below the pill
  // Total from screen bottom to pill top = insets.bottom + 85
  // Add 4px gap so input doesn't touch the pill
  const tabBarHeight = 89 + insets.bottom;

  // Track keyboard visibility & scroll chat to bottom when keyboard opens
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
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

  // Animated bottom padding — smooth transition when keyboard opens/closes
  const inputBottomPaddingValue = useSharedValue(tabBarHeight);
  useEffect(() => {
    // When keyboard is open: small bottom padding so input sits snug against keyboard
    // When keyboard is closed: push input above the floating tab bar pill
    const target = keyboardVisible ? 4 : tabBarHeight;
    inputBottomPaddingValue.value = withTiming(target, { duration: 250 });
  }, [keyboardVisible, tabBarHeight]);

  const animatedInputWrapperStyle = useAnimatedStyle(() => ({
    marginBottom: inputBottomPaddingValue.value,
  }));

  const animatedScrollFabStyle = useAnimatedStyle(() => ({
    bottom: inputBottomPaddingValue.value + 60,
  }));

  // Ensure active conversation always exists
  const activeConvId = useChatHistoryStore((s) => s.activeConversationId);
  useEffect(() => {
    if (!activeConvId || !chatStore.getActiveConversation()) {
      const charId = selectedCharacterId;
      const char = getCharacter(charId);
      chatStore.createConversation(charId, char.greeting[locale]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId]);

  // One-time migration: import from backend if logged in and store is empty
  useEffect(() => {
    if (!isLoggedIn) return;
    if (chatStore.conversations.length > 1) return; // already has history
    api.getCoachHistory().then(({ messages: history }) => {
      if (history.length > 0) {
        const conv = chatStore.getActiveConversation();
        if (!conv) return;
        const mapped: ChatMessage[] = history.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.createdAt).getTime(),
        }));
        mapped.forEach((msg) => chatStore.addMessage(conv.id, msg));
      }
    }).catch(() => {});
  }, [isLoggedIn]);

  const handleSelectCharacter = (id: string) => {
    const char = getCharacter(id);
    if (char.isPremium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall?trigger=character');
      setShowCoachesHistoryModal(false);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCharacterId(id);

    // Find existing conversation for this character, or create one
    const existing = chatStore.getLatestConversationForCharacter(id);
    if (existing) {
      chatStore.setActiveConversation(existing.id);
    } else {
      chatStore.createConversation(id, char.greeting[locale]);
    }

    setShowCoachesHistoryModal(false);
  };

  const handleNewChat = useCallback(() => {
    const char = getCharacter(activeConvCharacterId);
    chatStore.createConversation(activeConvCharacterId, char.greeting[locale]);
  }, [activeConvCharacterId, locale]);

  const handleStartBattle = useCallback((character: BattleCharacter) => {
    // Create a new conversation with battle character greeting
    chatStore.createConversation(character.id, character.greeting[locale]);
    setBattleCharacter(character.id);
    setExerciseMode('flirting_battle');
  }, [locale, chatStore, setBattleCharacter, setExerciseMode]);

  const handleEndBattle = useCallback(() => {
    // Send a score request before resetting
    const scoreMsg = locale === 'de'
      ? 'Gib mir bitte meine Bewertung. [BATTLE_SCORE_NOW]'
      : 'Give me my score please. [BATTLE_SCORE_NOW]';
    sendBattleScoreMessage(scoreMsg);
  }, [locale]);

  const sendBattleScoreMessage = useCallback(async (text: string) => {
    const convId = chatStore.activeConversationId;
    if (!convId || !isLoggedIn) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      // Strip the signal from the displayed message
      content: text.replace(' [BATTLE_SCORE_NOW]', '').replace('[BATTLE_SCORE_NOW]', ''),
      timestamp: Date.now(),
    };
    chatStore.addMessage(convId, userMessage);
    setIsLoading(true);

    try {
      const shouldSpend = canSpend(HEART_COSTS.AI_MESSAGE);
      if (shouldSpend) spendHearts(HEART_COSTS.AI_MESSAGE);
      const context = buildJourneyContext();
      const data = await api.sendCoachMessage(
        text,
        activeBattleCharacterId ?? 'charismo',
        context,
        'flirting_battle',
        convId,
      );
      const aiMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      };
      chatStore.addMessage(convId, aiMessage);
    } catch {
      // Refund hearts on error
      useHeartsStore.getState().addBonusHearts(HEART_COSTS.AI_MESSAGE);
    } finally {
      setIsLoading(false);
      resetBattle();
    }
  }, [chatStore, isLoggedIn, activeBattleCharacterId, buildJourneyContext, canSpend, spendHearts, resetBattle]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText ?? input;
    if (!text.trim() || isLoading || isConvLocked) return;

    const convId = chatStore.activeConversationId;
    if (!convId) return;

    // Hearts check for logged-in users
    if (isLoggedIn && !canSpend(HEART_COSTS.AI_MESSAGE)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setShowOutOfHearts(true);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Battle mode: track message count and auto-score on 10th
    const currentBattleCharId = useUIStore.getState().activeBattleCharacterId;
    const isBattleMsg = !!currentBattleCharId;
    let apiMessage = text.trim();
    let newBattleCount = 0;

    if (isBattleMsg) {
      incrementBattleMessageCount();
      newBattleCount = useUIStore.getState().battleMessageCount;
      if (newBattleCount >= 10) {
        apiMessage = `${apiMessage} [BATTLE_SCORE_NOW]`;
      }
    }

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    chatStore.addMessage(convId, userMessage);
    setInput('');
    setIsLoading(true);
    incrementChatCount();

    try {
      if (isLoggedIn) {
        // Spend heart on send
        spendHearts(HEART_COSTS.AI_MESSAGE);

        const context = buildJourneyContext();
        // In battle mode, use the battle character ID
        const characterForApi = isBattleMsg ? currentBattleCharId : activeConvCharacterId;
        const data = await api.sendCoachMessage(
          apiMessage,
          characterForApi,
          context,
          activeExerciseMode ?? undefined,
          convId,
        );

        const aiMessage: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
        };
        chatStore.addMessage(convId, aiMessage);

        // Auto-reset battle after scorecard (10th message)
        if (isBattleMsg && newBattleCount >= 10) {
          resetBattle();
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const response = locale === 'de' ? FALLBACK_RESPONSE.de : FALLBACK_RESPONSE.en;
        const aiMessage: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };
        chatStore.addMessage(convId, aiMessage);
      }
    } catch (err: any) {
      // Auto-logout on expired token
      if (err?.status === 401) {
        useAuthStore.getState().logout();
      }
      // Refund hearts on error — backend no longer deducts on failure either
      if (isLoggedIn && err?.status !== 429) {
        useHeartsStore.getState().addBonusHearts(HEART_COSTS.AI_MESSAGE);
      }
      const errorMsg = err?.status === 429
        ? t('coach.limitReached')
        : err?.status === 403
          ? (locale === 'de' ? 'Premium erforderlich für diesen Charakter' : 'Premium required for this character')
          : err?.status === 401
            ? (locale === 'de' ? 'Sitzung abgelaufen. Bitte erneut anmelden.' : 'Session expired. Please sign in again.')
            : t('coach.errorMessage');
      const aiMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: errorMsg,
        timestamp: Date.now(),
      };
      chatStore.addMessage(convId, aiMessage);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isConvLocked, incrementChatCount, isLoggedIn, activeConvCharacterId, locale, t, buildJourneyContext, activeExerciseMode, chatStore, canSpend, spendHearts, incrementBattleMessageCount, resetBattle]);

  // Inverted list data — newest messages at top of reversed array (rendered at bottom visually)
  const invertedMessages = useMemo(() => [...messages].reverse(), [messages]);

  // Auto-scroll to bottom (offset 0 in inverted list) when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);
    }
  }, [messages.length]);

  // Exercise mode button state
  const exerciseModeForButton = activeExerciseMode ? getExerciseMode(activeExerciseMode) : null;


  // Scroll-to-bottom FAB
  const [showScrollFab, setShowScrollFab] = useState(false);
  const handleScroll = useCallback((event: any) => {
    setShowScrollFab(event.nativeEvent.contentOffset.y > 200);
  }, []);
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isUser = item.role === 'user';
    const prevMsg = invertedMessages[index + 1]; // above on screen (older)
    const nextMsg = invertedMessages[index - 1]; // below on screen (newer)
    const isFirstInGroup = !prevMsg || prevMsg.role !== item.role;
    const isLastInGroup = !nextMsg || nextMsg.role !== item.role;

    // Tighter spacing for grouped messages
    const spacing = isLastInGroup ? 8 : 2;

    // Timestamp separator: show when 5+ minute gap with message above
    const showTimestamp = prevMsg && prevMsg.timestamp && item.timestamp &&
      (item.timestamp - prevMsg.timestamp > 5 * 60 * 1000);

    // Grouped bubble radii
    const bubbleStyle: any = {};
    if (isUser) {
      if (!isFirstInGroup) bubbleStyle.borderTopRightRadius = 4;
      if (!isLastInGroup) bubbleStyle.borderBottomRightRadius = 4;
    } else {
      if (!isFirstInGroup) bubbleStyle.borderTopLeftRadius = 4;
      if (!isLastInGroup) bubbleStyle.borderBottomLeftRadius = 4;
    }

    // Show avatar only on last message in AI group
    const showAvatar = !isUser && isLastInGroup;

    return (
      <>
        {showTimestamp && (
          <View style={styles.timestampContainer}>
            <Text style={[styles.timestampText, isDark && styles.timestampTextDark]}>
              {formatMessageTime(item.timestamp)}
            </Text>
          </View>
        )}
        <View style={[styles.messageRow, isUser && styles.messageRowUser, { marginBottom: spacing }]}>
          {!isUser && (() => {
            const bChar = isBattleActive ? getBattleCharacter(activeBattleCharacterId!) : null;
            const avatarColor = bChar?.color ?? activeCharacter.color;
            const avatarIcon = bChar?.icon ?? activeCharacter.icon;
            return showAvatar ? (
              <View style={[styles.avatarContainer, { backgroundColor: `${avatarColor}15` }]}>
                <Ionicons name={avatarIcon as any} size={14} color={avatarColor} />
              </View>
            ) : (
              <View style={styles.avatarSpacer} />
            );
          })()}
          <View style={[
            styles.messageBubble,
            isUser ? styles.userBubble : [styles.aiBubble, isDark && styles.aiBubbleDark],
            bubbleStyle,
          ]}>
            <Text style={[styles.messageText, isDark && !isUser && styles.messageTextDark, isUser && styles.userText]}>
              {item.content}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={[styles.safeArea, isDark && styles.safeAreaDark, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        {/* Header with character selector */}
        <Pressable onPress={() => { if (!isBattleActive) { setCoachesHistoryTab('coaches'); setShowCoachesHistoryModal(true); } }} style={styles.header}>
          <LinearGradient
            colors={isBattleActive
              ? ['#E8435A', '#FF7854']
              : [activeCharacter.color, `${activeCharacter.color}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {(() => {
              const battleChar = isBattleActive ? getBattleCharacter(activeBattleCharacterId!) : null;
              return (
                <>
                  <Ionicons name={(battleChar?.icon ?? activeCharacter.icon) as any} size={26} color="#fff" />
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>
                      {battleChar ? battleChar.name : activeCharacter.name}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {battleChar ? battleChar.subtitle[locale] : activeCharacter.subtitle[locale]}
                    </Text>
                  </View>
                </>
              );
            })()}
            <View style={styles.headerRight}>
              {isLoggedIn && (
                <View style={styles.limitBadge}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name="heart" size={11} color="#fff" />
                    <Text style={styles.limitText}>
                      {heartsAvailable}
                    </Text>
                  </View>
                </View>
              )}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCoachesHistoryTab('history');
                  setShowCoachesHistoryModal(true);
                }}
                style={styles.voiceCallBtn}
                hitSlop={8}
              >
                <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
              </Pressable>
              <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.7)" />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Single banner — priority: sign-in > battle > exercise > upgrade */}
        {!isLoggedIn ? (
          <Pressable onPress={() => router.push('/auth/register')} style={styles.upgradeBanner}>
            <Ionicons name="sparkles" size={16} color="#E8435A" />
            <Text style={styles.upgradeBannerText}>{t('coach.signInForAI')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#E8435A" />
          </Pressable>
        ) : isBattleActive ? (
          <BattleBanner onEndBattle={handleEndBattle} />
        ) : activeExerciseMode ? (
          <ExerciseBanner
            onEndExercise={() => {
              const debriefMsg = locale === 'de'
                ? 'Bitte gib mir ein abschließendes Feedback und eine Zusammenfassung der Übung.'
                : 'Please give me a final debrief and summary of this exercise.';
              sendMessage(debriefMsg);
              setExerciseMode(null);
            }}
          />
        ) : null}

        {/* Messages — inverted FlatList for WhatsApp-like chat behavior */}
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          data={invertedMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={100}
          ListHeaderComponent={
            isLoading ? (() => {
              const bChar = isBattleActive ? getBattleCharacter(activeBattleCharacterId!) : null;
              const loadColor = bChar?.color ?? activeCharacter.color;
              const loadIcon = bChar?.icon ?? activeCharacter.icon;
              const loadName = bChar?.name ?? activeCharacter.name;
              return (
                <View style={styles.messageRow}>
                  <View style={[styles.avatarContainer, { backgroundColor: `${loadColor}15` }]}>
                    <Ionicons name={loadIcon as any} size={14} color={loadColor} />
                  </View>
                  <View style={[styles.aiBubble, isDark && styles.aiBubbleDark]}>
                    <Text style={styles.loadingText}>{t('coach.sending', { name: loadName })}</Text>
                  </View>
                </View>
              );
            })() : null
          }
          ListFooterComponent={
            messages.length <= 1 ? (
              !hasSeenCoachIntro ? (
                <View style={[styles.introCard, isDark && styles.introCardDark]}>
                  <Ionicons name="sparkles" size={24} color={activeCharacter.color} />
                  <Text style={[styles.introTitle, isDark && styles.introTitleDark]}>
                    {locale === 'de' ? 'Willkommen bei Charismo!' : 'Welcome to Charismo!'}
                  </Text>
                  <Text style={[styles.introDesc, isDark && styles.introDescDark]}>
                    {locale === 'de'
                      ? 'Dein persönlicher Flirt- & Social-Skills-Coach.'
                      : 'Your personal flirting & social skills coach.'}
                  </Text>
                  <View style={styles.introFeatures}>
                    <View style={styles.introFeatureRow}>
                      <View style={[styles.introFeatureIcon, { backgroundColor: 'rgba(232,67,90,0.1)' }]}>
                        <Ionicons name="heart" size={14} color="#E8435A" />
                      </View>
                      <Text style={[styles.introFeatureText, isDark && styles.introFeatureTextDark]}>
                        {locale === 'de' ? '1 Nachricht = 1 Herz' : '1 message = 1 heart'}
                      </Text>
                    </View>
                    <View style={styles.introFeatureRow}>
                      <View style={[styles.introFeatureIcon, { backgroundColor: 'rgba(139,92,246,0.1)' }]}>
                        <Ionicons name="people" size={14} color="#8B5CF6" />
                      </View>
                      <Text style={[styles.introFeatureText, isDark && styles.introFeatureTextDark]}>
                        {locale === 'de' ? '6 Coaches mit einzigartigen Stilen' : '6 coaches with unique styles'}
                      </Text>
                    </View>
                    <View style={styles.introFeatureRow}>
                      <View style={[styles.introFeatureIcon, { backgroundColor: 'rgba(14,165,233,0.1)' }]}>
                        <Ionicons name="game-controller" size={14} color="#0EA5E9" />
                      </View>
                      <Text style={[styles.introFeatureText, isDark && styles.introFeatureTextDark]}>
                        {locale === 'de' ? 'Übungsmodi & Flirt-Battles' : 'Practice modes & flirt battles'}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setHasSeenCoachIntro(true);
                    }}
                    style={[styles.introGotIt, { backgroundColor: `${activeCharacter.color}15` }]}
                  >
                    <Text style={[styles.introGotItText, { color: activeCharacter.color }]}>
                      {locale === 'de' ? 'Verstanden!' : 'Got it!'}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={[styles.welcomeCard, isDark && styles.welcomeCardDark]}>
                  <Ionicons name="sparkles" size={20} color={activeCharacter.color} />
                  <Text style={[styles.welcomeTitle, isDark && styles.welcomeTitleDark]}>
                    {t('coach.welcomeTitle')}
                  </Text>
                  <Text style={[styles.welcomeDesc, isDark && styles.welcomeDescDark]}>
                    {t('coach.welcomeDesc')}
                  </Text>
                </View>
              )
            ) : null
          }
        />

        {/* Scroll-to-bottom FAB */}
        {showScrollFab && (
          <Animated.View style={[styles.scrollFab, isDark && styles.scrollFabDark, animatedScrollFabStyle]}>
            <Pressable
              onPress={scrollToBottom}
              hitSlop={8}
              style={styles.scrollFabInner}
            >
              <Ionicons name="chevron-down" size={20} color={isDark ? '#F5F5F5' : '#525252'} />
            </Pressable>
          </Animated.View>
        )}

        {/* Floating Glass Input — or locked banner */}
        {isConvLocked ? (
          <Animated.View style={[styles.floatingInputWrapper, animatedInputWrapperStyle]}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/paywall?trigger=character');
              }}
              style={[styles.lockedBanner, isDark && styles.lockedBannerDark]}
            >
              <Ionicons name="lock-closed" size={16} color="#E8435A" />
              <Text style={styles.lockedBannerText}>
                {locale === 'de'
                  ? `${activeCharacter.name} ist ein Premium-Coach`
                  : `${activeCharacter.name} is a Premium coach`}
              </Text>
              <View style={styles.lockedUpgradeBtn}>
                <Text style={styles.lockedUpgradeBtnText}>
                  {locale === 'de' ? 'Upgrade' : 'Upgrade'}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.floatingInputWrapper, animatedInputWrapperStyle]}>
            <View style={styles.floatingInputOuter}>
              <BlurView
                intensity={isDark ? 40 : 80}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.floatingInputOverlay, isDark && styles.floatingInputOverlayDark]} />
              <View style={styles.floatingInputContent}>
                {/* Exercise mode overflow button */}
                {isLoggedIn && (
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowExerciseModeModal(true);
                    }}
                    style={[
                      styles.exerciseModeBtn,
                      exerciseModeForButton
                        ? { backgroundColor: `${exerciseModeForButton.color}20` }
                        : isDark ? styles.exerciseModeBtnDark : {},
                    ]}
                  >
                    <Ionicons
                      name={(exerciseModeForButton?.icon ?? 'ellipsis-horizontal') as any}
                      size={18}
                      color={exerciseModeForButton?.color ?? (isDark ? '#A3A3A3' : '#737373')}
                    />
                  </Pressable>
                )}
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={input}
                  onChangeText={setInput}
                  placeholder={t('coach.placeholder', { name: activeCharacter.name })}
                  placeholderTextColor="#A3A3A3"
                  multiline
                  maxLength={500}
                  onSubmitEditing={() => sendMessage()}
                  returnKeyType="send"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <Pressable
                  onPress={() => sendMessage()}
                  style={[styles.sendButton, { backgroundColor: activeCharacter.color }, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
                  disabled={!input.trim() || isLoading}
                >
                  <Ionicons name="arrow-up" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Battle Character Modal */}
        <BattleCharacterModal
          visible={showBattleModal}
          onClose={() => setShowBattleModal(false)}
          onSelectCharacter={handleStartBattle}
        />

        {/* Exercise Mode Modal */}
        <ExerciseModeModal
          visible={showExerciseModeModal}
          onClose={() => setShowExerciseModeModal(false)}
          onOutOfHearts={() => setShowOutOfHearts(true)}
        />

        {/* Out of Hearts Modal */}
        <OutOfHeartsModal
          visible={showOutOfHearts}
          onClose={() => setShowOutOfHearts(false)}
        />

        {/* Coaches + History Modal (merged) */}
        <Modal
          visible={showCoachesHistoryModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCoachesHistoryModal(false)}
        >
          <SafeAreaView style={[styles.modalSafeArea, isDark && styles.modalSafeAreaDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                {coachesHistoryTab === 'coaches'
                  ? (locale === 'de' ? 'Coaches' : 'Coaches')
                  : (locale === 'de' ? 'Chatverlauf' : 'Chat History')}
              </Text>
              <Pressable onPress={() => setShowCoachesHistoryModal(false)} style={[styles.modalClose, isDark && styles.modalCloseDark]}>
                <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
              </Pressable>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
              <Pressable
                onPress={() => setCoachesHistoryTab('coaches')}
                style={[styles.tab, coachesHistoryTab === 'coaches' && styles.tabActive]}
              >
                <Text style={[styles.tabText, coachesHistoryTab === 'coaches' && styles.tabTextActive]}>
                  {locale === 'de' ? 'Coaches' : 'Coaches'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setCoachesHistoryTab('history')}
                style={[styles.tab, coachesHistoryTab === 'history' && styles.tabActive]}
              >
                <Text style={[styles.tabText, coachesHistoryTab === 'history' && styles.tabTextActive]}>
                  {locale === 'de' ? 'Verlauf' : 'History'}
                </Text>
              </Pressable>
            </View>

            {coachesHistoryTab === 'coaches' ? (
              <ScrollView contentContainerStyle={styles.characterList} showsVerticalScrollIndicator={false}>
                {coachCharacters.filter((c) => {
                  const gender = userProfile.userGender ?? 'male';
                  if (gender === 'diverse') return true;
                  return c.forGender === gender || c.forGender === 'all';
                }).map((char) => {
                  const isSelected = char.id === activeConvCharacterId;
                  const isLocked = char.isPremium && !isPremium;

                  return (
                    <Pressable
                      key={char.id}
                      onPress={() => handleSelectCharacter(char.id)}
                      style={[
                        styles.characterCard,
                        isDark && styles.characterCardDark,
                        isSelected && { borderColor: char.color, borderWidth: 2 },
                      ]}
                    >
                      <View style={styles.characterCardHeader}>
                        <View style={[styles.characterIcon, { backgroundColor: `${char.color}15` }]}>
                          <Ionicons name={char.icon as any} size={24} color={char.color} />
                        </View>
                        <View style={styles.characterInfo}>
                          <View style={styles.characterNameRow}>
                            <Text style={[styles.characterName, isDark && styles.characterNameDark]}>{char.name}</Text>
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
                          <Text style={[styles.characterSubtitle, isDark && styles.characterSubtitleDark]}>{char.subtitle[locale]}</Text>
                        </View>
                      </View>
                      <Text style={[styles.characterDescription, isDark && styles.characterDescriptionDark]}>{char.description[locale]}</Text>
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
            ) : (
              <ChatHistoryModal
                visible={true}
                onClose={() => setShowCoachesHistoryModal(false)}
                onNewChat={handleNewChat}
                embedded
              />
            )}
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  headerGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16,
  },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voiceCallBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  limitBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  limitText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 16, marginBottom: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(232,67,90,0.06)', borderRadius: 10,
  },
  upgradeBannerText: { flex: 1, fontSize: 12, fontWeight: '600', color: '#E8435A' },
  messageList: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 20, flexGrow: 1 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 8 },
  messageRowUser: { justifyContent: 'flex-end' },
  avatarContainer: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    borderBottomLeftRadius: 4,
  },
  aiBubbleDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  userBubble: { backgroundColor: '#E8435A', borderBottomRightRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 21, color: '#171717' },
  messageTextDark: { color: '#F5F5F5' },
  userText: { color: '#fff' },
  loadingText: { fontSize: 13, color: '#A3A3A3', fontStyle: 'italic' },
  avatarSpacer: { width: 22 },
  timestampContainer: {
    alignItems: 'center', paddingVertical: 10,
  },
  timestampText: { fontSize: 11, color: '#A3A3A3', fontWeight: '500' },
  timestampTextDark: { color: '#737373' },
  scrollFab: {
    position: 'absolute', right: 20, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)',
  },
  scrollFabDark: {
    backgroundColor: '#333',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scrollFabInner: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },

  // Welcome card
  welcomeCard: {
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20,
    marginBottom: 8, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  welcomeCardDark: { backgroundColor: 'rgba(255,255,255,0.03)' },
  welcomeTitle: {
    fontSize: 15, fontWeight: '700', color: '#171717',
    letterSpacing: -0.2, marginTop: 6,
  },
  welcomeTitleDark: { color: '#F5F5F5' },
  welcomeDesc: {
    fontSize: 13, color: '#737373', textAlign: 'center',
    lineHeight: 18, marginTop: 3,
  },
  welcomeDescDark: { color: '#A3A3A3' },

  // First-time intro card
  introCard: {
    alignItems: 'center', paddingVertical: 20, paddingHorizontal: 24,
    marginBottom: 8, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  introCardDark: { backgroundColor: 'rgba(255,255,255,0.03)' },
  introTitle: {
    fontSize: 18, fontWeight: '700', color: '#171717',
    letterSpacing: -0.3, marginTop: 10,
  },
  introTitleDark: { color: '#F5F5F5' },
  introDesc: {
    fontSize: 14, color: '#737373', textAlign: 'center',
    lineHeight: 20, marginTop: 4, marginBottom: 16,
  },
  introDescDark: { color: '#A3A3A3' },
  introFeatures: {
    width: '100%', gap: 10, marginBottom: 16,
  },
  introFeatureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  introFeatureIcon: {
    width: 30, height: 30, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  introFeatureText: {
    fontSize: 14, fontWeight: '500', color: '#404040',
  },
  introFeatureTextDark: { color: '#D4D4D4' },
  introGotIt: {
    paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12,
  },
  introGotItText: {
    fontSize: 15, fontWeight: '700',
  },

  // Locked conversation banner
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: 'rgba(232,67,90,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,67,90,0.15)',
  },
  lockedBannerDark: {
    backgroundColor: 'rgba(232,67,90,0.1)',
    borderColor: 'rgba(232,67,90,0.2)',
  },
  lockedBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#E8435A',
  },
  lockedUpgradeBtn: {
    backgroundColor: '#E8435A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  lockedUpgradeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  // Floating glass input bar
  floatingInputWrapper: {
    paddingHorizontal: 14,
  },
  floatingInputOuter: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  floatingInputOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  floatingInputOverlayDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  floatingInputContent: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 6,
    paddingHorizontal: 8, paddingVertical: 6,
  },
  exerciseModeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 1,
  },
  exerciseModeBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1, minHeight: 32, maxHeight: 100,
    paddingHorizontal: 6, paddingVertical: 6,
    fontSize: 15, color: '#171717',
    backgroundColor: 'transparent',
  },
  inputDark: {
    color: '#F5F5F5',
  },
  sendButton: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 1,
  },
  sendButtonDisabled: { opacity: 0.4 },

  // Character picker modal
  modalSafeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  modalSafeAreaDark: { backgroundColor: '#171717' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4,
  },
  modalTitle: { fontSize: 28, fontWeight: '700', color: '#171717', letterSpacing: -0.5 },
  modalTitleDark: { color: '#F5F5F5' },
  modalClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCloseDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modalSubtitle: {
    fontSize: 15, color: '#737373', paddingHorizontal: 20, marginTop: 4, marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row', paddingHorizontal: 20, gap: 4, marginBottom: 16,
  },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)',
  },
  tabActive: {
    backgroundColor: '#E8435A',
  },
  tabText: {
    fontSize: 14, fontWeight: '600', color: '#737373',
  },
  tabTextActive: {
    color: '#fff',
  },
  modalSubtitleDark: { color: '#A3A3A3' },
  characterList: { paddingHorizontal: 20, gap: 12 },
  characterCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  characterCardDark: {
    backgroundColor: '#252525',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  characterCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  characterIcon: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  characterInfo: { flex: 1 },
  characterNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  characterName: { fontSize: 18, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  characterNameDark: { color: '#F5F5F5' },
  characterSubtitle: { fontSize: 13, color: '#737373', marginTop: 2 },
  characterSubtitleDark: { color: '#A3A3A3' },
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
  characterDescriptionDark: { color: '#A3A3A3' },
  characterInspiration: {
    fontSize: 12, color: '#A3A3A3', fontStyle: 'italic', marginTop: 8,
  },
});
