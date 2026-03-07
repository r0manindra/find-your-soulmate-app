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
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useUIStore } from '@/src/store/ui-store';
import { useHabitStore } from '@/src/store/habit-store';
import { useChatHistoryStore } from '@/src/store/chat-history-store';
import { coachCharacters, getCharacter } from '@/src/data/content/coach-characters';
import { chapters } from '@/src/data/content/chapters';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { getPersonalization } from '@/src/core/personalization';
import * as api from '@/src/services/api';
import type { JourneyContext } from '@/src/services/api';
import type { ChatMessage } from '@/src/core/entities/types';
import { ExerciseBanner } from '@/src/presentation/components/coach/exercise-banner';
import { getExerciseMode } from '@/src/data/content/exercise-modes';
import { VoiceCoachModal } from '@/src/presentation/components/voice/voice-coach-modal';
import { ExerciseModeModal } from '@/src/presentation/components/coach/exercise-mode-modal';
import { ChatHistoryModal } from '@/src/presentation/components/coach/chat-history-modal';
import { HeartCounter } from '@/src/presentation/components/ui/heart-counter';
import { OutOfHeartsModal } from '@/src/presentation/components/ui/out-of-hearts-modal';
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
  const isProPlus = useAuthStore((s) => s.isProPlus);
  const locale = useSettingsStore((s) => s.locale);
  const selectedCharacterId = useSettingsStore((s) => s.selectedCharacterId);
  const setCharacterId = useSettingsStore((s) => s.setCharacterId);

  const userProfile = useUserProfileStore();
  const progressStore = useProgressStore();
  const habitStore = useHabitStore();
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

  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showExerciseModeModal, setShowExerciseModeModal] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [voiceCoachVisible, setVoiceCoachVisible] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canSpend = useHeartsStore((s) => s.canSpend);
  const spendHearts = useHeartsStore((s) => s.spendHearts);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeConvCharacterId = activeConversation?.characterId ?? selectedCharacterId;
  const activeCharacter = getCharacter(activeConvCharacterId);
  const insets = useSafeAreaInsets();
  const setChatInputFocused = useUIStore((s) => s.setChatInputFocused);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Tab bar height for when it's visible
  const tabBarHeight = 64 + insets.bottom + 12;

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
    const target = (isInputFocused && keyboardVisible) ? (insets.bottom || 4) : tabBarHeight;
    inputBottomPaddingValue.value = withTiming(target, { duration: 250 });
  }, [isInputFocused, keyboardVisible, tabBarHeight, insets.bottom]);

  const animatedInputWrapperStyle = useAnimatedStyle(() => ({
    marginBottom: inputBottomPaddingValue.value,
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
      router.push('/paywall');
      setShowCharacterPicker(false);
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

    setShowCharacterPicker(false);
  };

  const handleNewChat = useCallback((charId?: string) => {
    const id = charId ?? activeConvCharacterId;
    const char = getCharacter(id);
    chatStore.createConversation(id, char.greeting[locale]);
    if (charId) setCharacterId(charId);
  }, [activeConvCharacterId, locale, setCharacterId]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText ?? input;
    if (!text.trim() || isLoading) return;

    const convId = chatStore.activeConversationId;
    if (!convId) return;

    // Hearts check for logged-in users
    if (isLoggedIn && !canSpend(HEART_COSTS.AI_MESSAGE)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setShowOutOfHearts(true);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
        const data = await api.sendCoachMessage(
          userMessage.content,
          activeConvCharacterId,
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
  }, [input, isLoading, incrementChatCount, isLoggedIn, activeConvCharacterId, locale, t, buildJourneyContext, activeExerciseMode, chatStore, canSpend, spendHearts]);

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

  // Exercise mode hint
  const hasSeenHint = useSettingsStore((s) => s.hasSeenExerciseModeHint);
  const setHasSeenHint = useSettingsStore((s) => s.setHasSeenExerciseModeHint);
  const showHintDot = isLoggedIn && !hasSeenHint && !activeExerciseMode;
  const hintPulse = useSharedValue(1);
  useEffect(() => {
    if (showHintDot) {
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    }
  }, [showHintDot]);
  const hintPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintPulse.value }],
  }));

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
          {!isUser && (
            showAvatar ? (
              <View style={[styles.avatarContainer, { backgroundColor: `${activeCharacter.color}15` }]}>
                <Ionicons name={activeCharacter.icon as any} size={14} color={activeCharacter.color} />
              </View>
            ) : (
              <View style={styles.avatarSpacer} />
            )
          )}
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
        keyboardVerticalOffset={0}
      >
        {/* Header with character selector */}
        <Pressable onPress={() => setShowCharacterPicker(true)} style={styles.header}>
          <LinearGradient
            colors={[activeCharacter.color, `${activeCharacter.color}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons name={activeCharacter.icon as any} size={26} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{activeCharacter.name}</Text>
              <Text style={styles.headerSubtitle}>{activeCharacter.subtitle[locale]}</Text>
            </View>
            <View style={styles.headerRight}>
              {isLoggedIn && (
                <HeartCounter compact />
              )}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (!isProPlus) {
                    router.push('/paywall');
                  } else {
                    setVoiceCoachVisible(true);
                  }
                }}
                style={styles.voiceCallBtn}
                hitSlop={8}
              >
                <Ionicons name="mic" size={18} color="#fff" />
                {!isProPlus && (
                  <View style={styles.voiceCallLockBadge}>
                    <Ionicons name="lock-closed" size={7} color="#fff" />
                  </View>
                )}
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowChatHistory(true);
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
            <Ionicons name="heart" size={16} color="#E8435A" />
            <Text style={styles.upgradeBannerText}>
              {locale === 'de' ? 'Upgrade für mehr Herzen' : 'Upgrade for more hearts'}
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#E8435A" />
          </Pressable>
        )}

        {/* Active exercise banner */}
        {activeExerciseMode && (
          <ExerciseBanner
            onEndExercise={() => {
              const debriefMsg = locale === 'de'
                ? 'Bitte gib mir ein abschließendes Feedback und eine Zusammenfassung der Übung.'
                : 'Please give me a final debrief and summary of this exercise.';
              sendMessage(debriefMsg);
              setExerciseMode(null);
            }}
          />
        )}

        {/* Messages — inverted FlatList for WhatsApp-like chat behavior */}
        <FlatList
          ref={flatListRef}
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
            isLoading ? (
              <View style={styles.messageRow}>
                <View style={[styles.avatarContainer, { backgroundColor: `${activeCharacter.color}15` }]}>
                  <Ionicons name={activeCharacter.icon as any} size={14} color={activeCharacter.color} />
                </View>
                <View style={[styles.aiBubble, isDark && styles.aiBubbleDark]}>
                  <Text style={styles.loadingText}>{t('coach.sending', { name: activeCharacter.name })}</Text>
                </View>
              </View>
            ) : null
          }
          ListFooterComponent={
            messages.length <= 1 ? (
              <View style={[styles.welcomeCard, isDark && styles.welcomeCardDark]}>
                <Ionicons name="sparkles" size={20} color={activeCharacter.color} />
                <Text style={[styles.welcomeTitle, isDark && styles.welcomeTitleDark]}>
                  {t('coach.welcomeTitle')}
                </Text>
                <Text style={[styles.welcomeDesc, isDark && styles.welcomeDescDark]}>
                  {t('coach.welcomeDesc')}
                </Text>
              </View>
            ) : null
          }
        />

        {/* Scroll-to-bottom FAB */}
        {showScrollFab && (
          <Pressable
            onPress={scrollToBottom}
            style={[styles.scrollFab, isDark && styles.scrollFabDark]}
            hitSlop={8}
          >
            <Ionicons name="chevron-down" size={20} color={isDark ? '#F5F5F5' : '#525252'} />
          </Pressable>
        )}

        {/* Floating Glass Input */}
        <Animated.View style={[styles.floatingInputWrapper, animatedInputWrapperStyle]}>
          <View style={styles.floatingInputOuter}>
            <BlurView
              intensity={isDark ? 40 : 80}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.floatingInputOverlay, isDark && styles.floatingInputOverlayDark]} />
            <View style={styles.floatingInputContent}>
              {/* Exercise mode toggle button */}
              {isLoggedIn && (
                <View>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (!hasSeenHint) setHasSeenHint(true);
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
                      name={(exerciseModeForButton?.icon ?? 'flash') as any}
                      size={18}
                      color={exerciseModeForButton?.color ?? (isDark ? '#A3A3A3' : '#737373')}
                    />
                  </Pressable>
                  {showHintDot && (
                    <Animated.View style={[styles.hintDot, hintPulseStyle]} />
                  )}
                </View>
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

        {/* Voice Coach Modal */}
        <VoiceCoachModal
          visible={voiceCoachVisible}
          onClose={() => setVoiceCoachVisible(false)}
          characterId={activeConvCharacterId}
          locale={locale}
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

        {/* Chat History Modal */}
        <ChatHistoryModal
          visible={showChatHistory}
          onClose={() => setShowChatHistory(false)}
          onNewChat={handleNewChat}
        />

        {/* Character Picker Modal */}
        <Modal
          visible={showCharacterPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCharacterPicker(false)}
        >
          <SafeAreaView style={[styles.modalSafeArea, isDark && styles.modalSafeAreaDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                {locale === 'de' ? 'Wähle deinen Coach' : 'Choose Your Coach'}
              </Text>
              <Pressable onPress={() => setShowCharacterPicker(false)} style={[styles.modalClose, isDark && styles.modalCloseDark]}>
                <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#737373'} />
              </Pressable>
            </View>
            <Text style={[styles.modalSubtitle, isDark && styles.modalSubtitleDark]}>
              {locale === 'de'
                ? 'Jeder Coach hat seinen eigenen Stil. Finde den, der zu dir passt.'
                : 'Each coach has their own style. Find the one that fits you.'}
            </Text>
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
  voiceCallLockBadge: {
    position: 'absolute', top: -2, right: -2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#E8435A',
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
  messageList: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4, flexGrow: 1 },
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
    position: 'absolute', bottom: 80, right: 20, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)',
  },
  scrollFabDark: {
    backgroundColor: '#333',
    borderColor: 'rgba(255,255,255,0.1)',
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
  hintDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8435A',
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
