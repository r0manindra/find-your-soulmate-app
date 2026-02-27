export type ExerciseModeId =
  | 'opening_line_lab'
  | 'conversation_ping_pong'
  | 'rejection_gym'
  | 'date_simulator'
  | 'flirty_banter';

export interface ExerciseMode {
  id: ExerciseModeId;
  name: { en: string; de: string };
  description: { en: string; de: string };
  icon: string;
  color: string;
  isPremium: boolean;
}

export const exerciseModes: ExerciseMode[] = [
  {
    id: 'opening_line_lab',
    name: { en: 'Opening Line Lab', de: 'Ansprech-Labor' },
    description: {
      en: 'Practice openers in realistic scenarios. AI rates your lines 1-10.',
      de: 'Übe Ansprachen in realistischen Szenarien. KI bewertet deine Lines 1-10.',
    },
    icon: 'chatbubble-ellipses',
    color: '#8B5CF6',
    isPremium: false,
  },
  {
    id: 'conversation_ping_pong',
    name: { en: 'Conversation Ping-Pong', de: 'Gesprächs-Ping-Pong' },
    description: {
      en: 'Keep a conversation flowing for 5+ exchanges with different personality types.',
      de: 'Halte ein Gespräch mit verschiedenen Persönlichkeitstypen über 5+ Runden am Laufen.',
    },
    icon: 'swap-horizontal',
    color: '#0EA5E9',
    isPremium: true,
  },
  {
    id: 'rejection_gym',
    name: { en: 'Rejection Gym', de: 'Abfuhr-Gym' },
    description: {
      en: 'Practice handling rejections with grace and confidence.',
      de: 'Übe, Abfuhren mit Anstand und Selbstbewusstsein zu meistern.',
    },
    icon: 'shield',
    color: '#EF4444',
    isPremium: true,
  },
  {
    id: 'date_simulator',
    name: { en: 'Date Simulator', de: 'Date-Simulator' },
    description: {
      en: 'Full first-date roleplay with a detailed debrief at the end.',
      de: 'Komplettes First-Date-Rollenspiel mit ausführlichem Feedback am Ende.',
    },
    icon: 'restaurant',
    color: '#F59E0B',
    isPremium: true,
  },
  {
    id: 'flirty_banter',
    name: { en: 'Flirty Banter', de: 'Flirt-Battle' },
    description: {
      en: 'Witty back-and-forth. AI scores your creativity, humor, and flirtiness.',
      de: 'Schlagfertiger Flirt. KI bewertet deine Kreativität, Humor und Flirtfaktor.',
    },
    icon: 'sparkles',
    color: '#EC4899',
    isPremium: true,
  },
];

export function getExerciseMode(id: ExerciseModeId): ExerciseMode {
  return exerciseModes.find((m) => m.id === id)!;
}
