import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useProgressStore } from '@/src/store/progress-store';
import { useAuthStore } from '@/src/store/auth-store';
import * as api from '@/src/services/api';
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
    }).catch(() => { /* offline or no backend — use local only */ });
  }, [isLoggedIn]);

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
        // Use backend API (Claude-powered)
        const data = await api.sendCoachMessage(userMessage.content);
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
        // Offline fallback
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
        ? (t('coach.limitReached'))
        : (t('coach.errorMessage'));
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
  }, [input, isLoading, incrementChatCount, isLoggedIn, t]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="glasses-outline" size={18} color="#8B5CF6" />
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons name="glasses-outline" size={32} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{t('coach.title')}</Text>
              <Text style={styles.headerSubtitle}>{t('coach.subtitle')}</Text>
            </View>
            {!isPremium && messagesLimit && (
              <View style={styles.limitBadge}>
                <Text style={styles.limitText}>
                  {messagesUsed}/{messagesLimit}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Upgrade banner for non-logged-in or free users */}
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
                <View style={styles.avatarContainer}>
                  <Ionicons name="glasses-outline" size={18} color="#8B5CF6" />
                </View>
                <View style={styles.aiBubble}>
                  <Text style={styles.loadingText}>{t('coach.sending')}</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
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
          />
          <Pressable
            onPress={sendMessage}
            style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 20,
  },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  limitBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  limitText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: 'rgba(232,67,90,0.06)',
    borderRadius: 12,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#E8435A' },
  messageList: { paddingHorizontal: 20, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  messageRowUser: { justifyContent: 'flex-end' },
  avatarContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(139,92,246,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%', padding: 14, borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#E8435A',
    borderBottomRightRadius: 4,
  },
  messageText: { fontSize: 16, lineHeight: 22, color: '#171717' },
  userText: { color: '#fff' },
  loadingText: { fontSize: 14, color: '#A3A3A3', fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 16, color: '#171717',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8435A',
    alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
});
