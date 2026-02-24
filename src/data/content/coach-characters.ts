export interface CoachCharacter {
  id: string;
  name: string;
  subtitle: { en: string; de: string };
  description: { en: string; de: string };
  inspiration: string;
  icon: string; // Ionicons name
  color: string;
  isPremium: boolean;
}

export const coachCharacters: CoachCharacter[] = [
  {
    id: 'charismo',
    name: 'Charismo',
    subtitle: {
      en: 'Your Dating Coach',
      de: 'Dein Dating-Coach',
    },
    description: {
      en: 'Balanced, confident, and supportive. Gives you straight talk with encouragement. The perfect all-rounder.',
      de: 'Ausgewogen, selbstbewusst und unterstützend. Gibt dir klare Worte mit Ermutigung. Der perfekte Allrounder.',
    },
    inspiration: 'The balanced coach',
    icon: 'sparkles',
    color: '#8B5CF6',
    isPremium: false,
  },
  {
    id: 'maverick',
    name: 'The Maverick',
    subtitle: {
      en: 'Bold & Unfiltered',
      de: 'Mutig & Ungefiltert',
    },
    description: {
      en: 'Brutally honest, literary, and irreverent. Doesn\'t sugarcoat anything. Tells you what you need to hear, not what you want to hear.',
      de: 'Brutal ehrlich, literarisch und respektlos. Beschönigt nichts. Sagt dir, was du hören musst, nicht was du hören willst.',
    },
    inspiration: 'Hank Moody',
    icon: 'flame',
    color: '#EF4444',
    isPremium: true,
  },
  {
    id: 'gentleman',
    name: 'The Gentleman',
    subtitle: {
      en: 'Witty & Warm',
      de: 'Geistreich & Herzlich',
    },
    description: {
      en: 'Self-deprecating humor, storytelling charm, and genuine warmth. Makes tough advice feel like a conversation with your wittiest friend.',
      de: 'Selbstironischer Humor, erzählerischer Charme und echte Wärme. Macht harte Ratschläge zu einem Gespräch mit deinem witzigsten Freund.',
    },
    inspiration: 'Craig Ferguson',
    icon: 'wine',
    color: '#0EA5E9',
    isPremium: true,
  },
  {
    id: 'playboy',
    name: 'The Natural',
    subtitle: {
      en: 'Effortlessly Cool',
      de: 'Mühelos Cool',
    },
    description: {
      en: 'Laid-back, keeps it simple, never overthinks. His motto: "Relax. This isn\'t rocket science." Makes everything feel easy.',
      de: 'Entspannt, hält es einfach, überdenkt nie. Sein Motto: "Relax. Das ist keine Raketenwissenschaft." Macht alles leicht.',
    },
    inspiration: 'Charlie Harper',
    icon: 'sunny',
    color: '#F59E0B',
    isPremium: true,
  },
  {
    id: 'hypeman',
    name: 'The Legend',
    subtitle: {
      en: 'Legendary Confidence',
      de: 'Legendäres Selbstbewusstsein',
    },
    description: {
      en: 'Over-the-top energy, catchphrases, and unshakeable confidence. Will hype you up until you believe you can conquer the world.',
      de: 'Übertriebene Energie, Sprüche und unerschütterliches Selbstbewusstsein. Pusht dich, bis du glaubst, die Welt erobern zu können.',
    },
    inspiration: 'Barney Stinson',
    icon: 'trophy',
    color: '#EC4899',
    isPremium: true,
  },
  {
    id: 'smooth',
    name: 'The Smooth Operator',
    subtitle: {
      en: 'Suave & Sophisticated',
      de: 'Elegant & Raffiniert',
    },
    description: {
      en: 'Calm, measured, and impossibly cool. Quality over quantity. Every word counts. Think less "try hard," more "effortless magnetism."',
      de: 'Ruhig, bedacht und unglaublich cool. Qualität statt Quantität. Jedes Wort zählt. Weniger "sich anstrengen," mehr "mühelose Anziehung."',
    },
    inspiration: 'James Bond / Don Draper',
    icon: 'diamond',
    color: '#171717',
    isPremium: true,
  },
];

export function getCharacter(id: string): CoachCharacter {
  return coachCharacters.find((c) => c.id === id) ?? coachCharacters[0];
}
