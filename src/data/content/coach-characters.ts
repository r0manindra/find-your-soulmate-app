export interface CoachCharacter {
  id: string;
  name: string;
  subtitle: { en: string; de: string };
  description: { en: string; de: string };
  greeting: { en: string; de: string };
  inspiration: string;
  icon: string; // Ionicons name
  color: string;
  isPremium: boolean;
  forGender: 'male' | 'female' | 'all';
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
    greeting: {
      en: "Hey! I'm Charismo, your dating coach. I'll give you straight talk with real encouragement. What's on your mind?",
      de: 'Hey! Ich bin Charismo, dein Dating-Coach. Ich gebe dir klare Worte mit echter Ermutigung. Was beschäftigt dich?',
    },
    inspiration: 'The balanced coach',
    icon: 'sparkles',
    color: '#8B5CF6',
    isPremium: false,
    forGender: 'male',
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
    greeting: {
      en: "Hey. I'm Hank — well, The Maverick. Think of me as that friend who's brutally honest but always has your back. What's on your mind?",
      de: 'Hey. Ich bin Hank — naja, The Maverick. Denk an mich als den Freund, der brutal ehrlich ist, aber immer hinter dir steht. Was beschäftigt dich?',
    },
    inspiration: 'Hank Moody',
    icon: 'flame',
    color: '#EF4444',
    isPremium: true,
    forGender: 'male',
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
    greeting: {
      en: "Well hello there! I'm The Gentleman. Pull up a chair — let's have a proper chat about your love life, shall we?",
      de: 'Na hallo! Ich bin The Gentleman. Setz dich — lass uns ein richtiges Gespräch über dein Liebesleben führen, ja?',
    },
    inspiration: 'Craig Ferguson',
    icon: 'wine',
    color: '#0EA5E9',
    isPremium: true,
    forGender: 'male',
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
    greeting: {
      en: "Hey, relax. I'm The Natural. This whole dating thing? It's not rocket science. Tell me what's going on and let's keep it simple.",
      de: 'Hey, entspann dich. Ich bin The Natural. Das ganze Dating-Ding? Keine Raketenwissenschaft. Erzähl mir was los ist, wir halten es einfach.',
    },
    inspiration: 'Charlie Harper',
    icon: 'sunny',
    color: '#F59E0B',
    isPremium: true,
    forGender: 'male',
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
    greeting: {
      en: "Suit up! I'm The Legend, and tonight — we ride. Tell me what you need and I'll make it legendary.",
      de: 'Anzug an! Ich bin The Legend, und heute Abend — wird es legendär. Sag mir was du brauchst und ich mache es legendär.',
    },
    inspiration: 'Barney Stinson',
    icon: 'trophy',
    color: '#EC4899',
    isPremium: true,
    forGender: 'male',
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
    greeting: {
      en: "Good evening. I'm The Smooth Operator. Less is more — so let's skip the small talk. What do you need?",
      de: 'Guten Abend. Ich bin The Smooth Operator. Weniger ist mehr — also überspringen wir den Smalltalk. Was brauchst du?',
    },
    inspiration: 'James Bond / Don Draper',
    icon: 'diamond',
    color: '#171717',
    isPremium: true,
    forGender: 'male',
  },
  // Female coaches
  {
    id: 'bestfriend',
    name: 'The Best Friend',
    subtitle: {
      en: 'Your Ride-or-Die Wing Woman',
      de: 'Deine Ride-or-Die Flügel-Frau',
    },
    description: {
      en: 'Warm, supportive, tells it like it is but always has your back. Like your smartest friend who happens to be amazing at dating.',
      de: 'Warmherzig, unterstützend, sagt es wie es ist, aber steht immer hinter dir. Wie deine klügste Freundin, die zufällig auch beim Dating brilliert.',
    },
    greeting: {
      en: "Heyy girl! I'm your Best Friend coach. Think of me as your wing woman who always tells it like it is. Spill — what's going on?",
      de: 'Heyy! Ich bin dein Best-Friend-Coach. Denk an mich als deine Flügel-Frau, die immer die Wahrheit sagt. Erzähl — was ist los?',
    },
    inspiration: 'The supportive best friend',
    icon: 'heart-circle',
    color: '#EC4899',
    isPremium: false,
    forGender: 'female',
  },
  {
    id: 'queen',
    name: 'The Queen',
    subtitle: {
      en: 'Confident & Commanding',
      de: 'Selbstbewusst & Souverän',
    },
    description: {
      en: "Teaches you to own every room. High standards, zero tolerance for nonsense. She doesn't chase - she attracts.",
      de: 'Lehrt dich, jeden Raum zu dominieren. Hohe Standards, null Toleranz für Unsinn. Sie jagt nicht - sie zieht an.',
    },
    greeting: {
      en: "Welcome, queen. I'm here to teach you how to own every room you walk into. High standards only. What are we working on?",
      de: 'Willkommen, Queen. Ich bin hier, um dir beizubringen, wie du jeden Raum dominierst. Nur hohe Standards. Woran arbeiten wir?',
    },
    inspiration: 'Confident feminine power',
    icon: 'sparkles',
    color: '#8B5CF6',
    isPremium: true,
    forGender: 'female',
  },
  {
    id: 'enchantress',
    name: 'The Enchantress',
    subtitle: {
      en: 'Mysteriously Magnetic',
      de: 'Geheimnisvoll Magnetisch',
    },
    description: {
      en: 'Master of subtlety, the art of the glance, the perfectly timed pause. She makes him think approaching was his idea.',
      de: 'Meisterin der Subtilität, die Kunst des Blicks, die perfekt getimte Pause. Sie lässt ihn glauben, dass das Ansprechen seine Idee war.',
    },
    greeting: {
      en: "Hello, darling. I'm The Enchantress. Let's work on making you... unforgettable. What brings you here?",
      de: 'Hallo, Liebes. Ich bin The Enchantress. Lass uns daran arbeiten, dich... unvergesslich zu machen. Was führt dich her?',
    },
    inspiration: 'The art of feminine mystery',
    icon: 'moon',
    color: '#0EA5E9',
    isPremium: true,
    forGender: 'female',
  },
];

export function getCharacter(id: string): CoachCharacter {
  return coachCharacters.find((c) => c.id === id) ?? coachCharacters[0];
}
