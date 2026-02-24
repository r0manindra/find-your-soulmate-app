import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { getCharacterPrompt } from './characters';

const anthropic = new Anthropic({
  apiKey: env.anthropicApiKey,
});

export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getCoachResponse(
  messages: CoachMessage[],
  userMessage: string,
  characterId: string = 'charismo'
): Promise<string> {
  const conversationHistory = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  conversationHistory.push({ role: 'user', content: userMessage });

  const systemPrompt = getCharacterPrompt(characterId);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: conversationHistory,
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  return textBlock?.text ?? "Sorry, I couldn't come up with a response. Try asking again.";
}
