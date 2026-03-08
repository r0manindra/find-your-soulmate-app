export interface BattleCharacter {
  id: string;
  name: string;
  subtitle: { en: string; de: string };
  description: { en: string; de: string };
  greeting: { en: string; de: string };
  icon: string;
  color: string;
  isPremium: boolean;
  forGender: 'male' | 'female';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const battleCharacters: BattleCharacter[] = [
  // Female opponents (for male users)
  {
    id: 'battle_girl_nextdoor',
    name: 'Sophie',
    subtitle: { en: 'The Girl Next Door', de: 'Das Mädchen von nebenan' },
    description: {
      en: 'Warm, genuine, and approachable. Values substance over flashy lines. Met at a friend\'s birthday party.',
      de: 'Warmherzig, echt und zugänglich. Schätzt Substanz statt flotter Sprüche. Getroffen auf einer Geburtstagsparty.',
    },
    greeting: {
      en: "Oh hey! Sorry, I almost spilled my drink on you. 😅 I'm Sophie — do you know the birthday girl or are you a plus-one too?",
      de: 'Oh hey! Sorry, ich hätte fast mein Getränk über dich geschüttet. 😅 Ich bin Sophie — kennst du das Geburtstagskind oder bist du auch ein Plus-Eins?',
    },
    icon: 'sunny',
    color: '#F59E0B',
    isPremium: false,
    forGender: 'male',
    difficulty: 'easy',
  },
  {
    id: 'battle_confident',
    name: 'Mia',
    subtitle: { en: 'The Confident One', de: 'Die Selbstbewusste' },
    description: {
      en: 'Bold, direct, not easily impressed. You need to bring your A-game. Met at a rooftop bar.',
      de: 'Mutig, direkt, nicht leicht zu beeindrucken. Du brauchst dein bestes Game. Getroffen auf einer Rooftop-Bar.',
    },
    greeting: {
      en: "*glances over* Bold move coming over here. Most guys just stare. Alright, you've got my attention — for now.",
      de: '*schaut rüber* Mutiger Zug, herzukommen. Die meisten Jungs starren nur. Okay, du hast meine Aufmerksamkeit — vorerst.',
    },
    icon: 'flame',
    color: '#EF4444',
    isPremium: true,
    forGender: 'male',
    difficulty: 'medium',
  },
  {
    id: 'battle_bookworm',
    name: 'Lena',
    subtitle: { en: 'The Bookworm', de: 'Der Bücherwurm' },
    description: {
      en: 'Intellectual, witty, loves wordplay and clever references. Met at a bookstore café.',
      de: 'Intellektuell, geistreich, liebt Wortspiele und clevere Referenzen. Getroffen in einem Buchcafé.',
    },
    greeting: {
      en: "*looks up from book* Oh — sorry, I was lost in this chapter. You need something, or did you just come over to judge my book choice?",
      de: '*schaut vom Buch auf* Oh — sorry, ich war vertieft. Brauchst du was, oder bist du nur hier, um meine Buchwahl zu beurteilen?',
    },
    icon: 'book',
    color: '#8B5CF6',
    isPremium: true,
    forGender: 'male',
    difficulty: 'medium',
  },
  {
    id: 'battle_party_girl',
    name: 'Jess',
    subtitle: { en: 'The Life of the Party', de: 'Die Party-Queen' },
    description: {
      en: 'High-energy, playful, lives for banter. Boring people need not apply. Met on the dance floor.',
      de: 'Voller Energie, verspielt, lebt für Schlagfertigkeit. Langweiler unerwünscht. Getroffen auf der Tanzfläche.',
    },
    greeting: {
      en: "Heyy you just stepped on my foot! 😂 You owe me a drink now. Or at least a really good excuse. What's your name?",
      de: 'Heyy du bist mir gerade auf den Fuß getreten! 😂 Du schuldest mir jetzt einen Drink. Oder zumindest eine richtig gute Ausrede. Wie heißt du?',
    },
    icon: 'musical-notes',
    color: '#EC4899',
    isPremium: true,
    forGender: 'male',
    difficulty: 'hard',
  },
  {
    id: 'battle_mysterious',
    name: 'Aria',
    subtitle: { en: 'The Enigma', de: 'Das Rätsel' },
    description: {
      en: 'Mysterious, short answers, makes you work for every word. The ultimate challenge. Met at a cocktail bar.',
      de: 'Geheimnisvoll, kurze Antworten, jedes Wort muss erarbeitet werden. Die ultimative Herausforderung. Getroffen an einer Cocktailbar.',
    },
    greeting: {
      en: '*takes a sip, glances at you* ...Hi.',
      de: '*nimmt einen Schluck, schaut dich an* ...Hi.',
    },
    icon: 'moon',
    color: '#171717',
    isPremium: true,
    forGender: 'male',
    difficulty: 'hard',
  },

  // Male opponents (for female users)
  {
    id: 'battle_boy_nextdoor',
    name: 'Max',
    subtitle: { en: 'The Boy Next Door', de: 'Der Junge von nebenan' },
    description: {
      en: 'Warm, genuine, a bit awkward in an endearing way. Met at a casual house party.',
      de: 'Warmherzig, echt, etwas tollpatschig auf charmante Art. Getroffen auf einer lockeren Hausparty.',
    },
    greeting: {
      en: "Oh hey! I was just trying to figure out this playlist situation. Do you know if there's a way to — wait, sorry, I'm Max. Hi. 😊 Do we know each other?",
      de: 'Oh hey! Ich hab gerade versucht, diese Playlist-Situation zu klären. Weißt du ob es eine Möglichkeit gibt — warte, sorry, ich bin Max. Hi. 😊 Kennen wir uns?',
    },
    icon: 'sunny',
    color: '#0EA5E9',
    isPremium: false,
    forGender: 'female',
    difficulty: 'easy',
  },
  {
    id: 'battle_bad_boy',
    name: 'Jake',
    subtitle: { en: 'The Bad Boy', de: 'Der Bad Boy' },
    description: {
      en: 'Confident, teasing, unpredictable. He doesn\'t chase — can you make him interested? Met at a crowded bar.',
      de: 'Selbstbewusst, neckisch, unberechenbar. Er jagt nicht — kannst du sein Interesse wecken? Getroffen in einer vollen Bar.',
    },
    greeting: {
      en: "*leans back, smirks* You've been looking over here for a while. Gonna say something, or just keep staring?",
      de: '*lehnt sich zurück, grinst* Du schaust schon eine Weile rüber. Sagst du was, oder starrst du einfach weiter?',
    },
    icon: 'skull',
    color: '#171717',
    isPremium: true,
    forGender: 'female',
    difficulty: 'hard',
  },
];

export function getBattleCharacter(id: string): BattleCharacter | undefined {
  return battleCharacters.find((c) => c.id === id);
}

export function getBattleCharactersForGender(gender: 'male' | 'female' | 'diverse' | null): BattleCharacter[] {
  if (!gender || gender === 'diverse') return battleCharacters;
  return battleCharacters.filter((c) => c.forGender !== gender);
}
