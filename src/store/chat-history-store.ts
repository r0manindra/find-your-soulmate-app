import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChatMessage } from '@/src/core/entities/types';

const MAX_CONVERSATIONS = 50;

export interface Conversation {
  id: string;
  title: string;
  characterId: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

interface ChatHistoryStore {
  conversations: Conversation[];
  activeConversationId: string | null;

  createConversation: (characterId: string, greeting: string) => string;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  deleteConversation: (id: string) => void;
  getActiveConversation: () => Conversation | undefined;
}

export const useChatHistoryStore = create<ChatHistoryStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (characterId, greeting) => {
        const id = String(Date.now());
        const greetingMsg: ChatMessage = {
          id: '0',
          role: 'assistant',
          content: greeting,
          timestamp: Date.now(),
        };
        const conversation: Conversation = {
          id,
          title: '',
          characterId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [greetingMsg],
        };

        set((state) => {
          let convs = [conversation, ...state.conversations];
          if (convs.length > MAX_CONVERSATIONS) {
            convs = convs.slice(0, MAX_CONVERSATIONS);
          }
          return { conversations: convs, activeConversationId: id };
        });

        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        set((state) => {
          const convs = state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const updated = {
              ...c,
              messages: [...c.messages, message],
              updatedAt: Date.now(),
            };
            // Auto-title from first user message
            if (!c.title && message.role === 'user') {
              updated.title = message.content.slice(0, 40);
            }
            return updated;
          });
          return { conversations: convs };
        });
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const activeId = state.activeConversationId === id
            ? (filtered[0]?.id ?? null)
            : state.activeConversationId;
          return { conversations: filtered, activeConversationId: activeId };
        });
      },

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.activeConversationId);
      },
    }),
    {
      name: 'chat-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
