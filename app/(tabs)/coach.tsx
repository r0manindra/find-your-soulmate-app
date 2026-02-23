import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useProgressStore } from '@/src/store/progress-store';
import type { ChatMessage } from '@/src/core/entities/types';

export default function CoachScreen() {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  const incrementChatCount = useProgressStore((s) => s.incrementChatCount);

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

    // Simulate AI response — replace with actual API call to backend proxy
    setTimeout(() => {
      const responses = [
        "Good question. Here's the thing — confidence isn't about knowing all the answers. It's about being comfortable not knowing. That's what makes someone magnetic.",
        "Listen, I get it. Approaching someone feels like defusing a bomb. But here's the secret: they're probably just as nervous. Start with something genuine — comment on something real in the moment.",
        "The biggest mistake I see? Trying to be someone you're not. The right person will love the real you — weird quirks, awkward pauses, and all. Authenticity is the ultimate cheat code.",
        "Let me be real with you — rejection isn't about you. It's about timing, circumstances, chemistry. Don't take it personally. The best players in the game have the most strikeouts. Keep swinging.",
        "Here's what separates the amateurs from the naturals: listening. Most people are just waiting for their turn to talk. Actually listen. Ask follow-up questions. Make them feel seen.",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];

      const aiMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, [input, isLoading, incrementChatCount]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && <Text style={styles.avatar}>😎</Text>}
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
            <Text style={styles.headerEmoji}>😎</Text>
            <View>
              <Text style={styles.headerTitle}>{t('coach.title')}</Text>
              <Text style={styles.headerSubtitle}>{t('coach.subtitle')}</Text>
            </View>
          </LinearGradient>
        </View>

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
                <Text style={styles.avatar}>😎</Text>
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
            <Text style={styles.sendIcon}>↑</Text>
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
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  messageList: { paddingHorizontal: 20, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  messageRowUser: { justifyContent: 'flex-end' },
  avatar: { fontSize: 24, marginBottom: 4 },
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
  sendIcon: { fontSize: 20, fontWeight: '700', color: '#fff' },
});
