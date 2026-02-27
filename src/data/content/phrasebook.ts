export type PhraseCategoryId =
  | 'opening_lines'
  | 'compliments'
  | 'conversation_deepeners'
  | 'witty_responses'
  | 'smart_vocabulary'
  | 'closing_lines';

export interface PhraseCategory {
  id: PhraseCategoryId;
  name: { en: string; de: string };
  icon: string;
  color: string;
}

export interface Phrase {
  id: string;
  categoryId: PhraseCategoryId;
  situation: { en: string; de: string };
  text: { en: string; de: string };
  explanation: { en: string; de: string };
  isPremium: boolean;
  forGender: 'male' | 'female' | 'all';
}

export const phraseCategories: PhraseCategory[] = [
  {
    id: 'opening_lines',
    name: { en: 'Opening Lines', de: 'Eröffnungssprüche' },
    icon: 'chatbubble-ellipses',
    color: '#8B5CF6',
  },
  {
    id: 'compliments',
    name: { en: 'Genuine Compliments', de: 'Ehrliche Komplimente' },
    icon: 'heart',
    color: '#EC4899',
  },
  {
    id: 'conversation_deepeners',
    name: { en: 'Conversation Deepeners', de: 'Gesprächsvertiefer' },
    icon: 'link',
    color: '#0EA5E9',
  },
  {
    id: 'witty_responses',
    name: { en: 'Witty Responses', de: 'Schlagfertige Antworten' },
    icon: 'flash',
    color: '#F59E0B',
  },
  {
    id: 'smart_vocabulary',
    name: { en: 'Smart Vocabulary', de: 'Clevere Ausdrücke' },
    icon: 'school',
    color: '#10B981',
  },
  {
    id: 'closing_lines',
    name: { en: 'Closing Lines', de: 'Abschluss-Sprüche' },
    icon: 'checkmark-circle',
    color: '#EF4444',
  },
];

export const phrases: Phrase[] = [
  // ═══════════════════════════════════════════════════════════════════
  // OPENING LINES
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'ol_1',
    categoryId: 'opening_lines',
    situation: { en: 'Coffee shop', de: 'Café' },
    text: {
      en: "Excuse me — what did you order? I've been staring at this menu for way too long.",
      de: 'Entschuldige — was hast du bestellt? Ich starre schon viel zu lange auf die Karte.',
    },
    explanation: {
      en: "Casual, situational, and gives them an easy way to respond. Doesn't feel forced.",
      de: 'Locker, situationsbezogen und gibt eine einfache Antwortmöglichkeit. Wirkt nicht erzwungen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'ol_2',
    categoryId: 'opening_lines',
    situation: { en: 'Bookstore / Library', de: 'Buchhandlung / Bibliothek' },
    text: {
      en: "That's a great pick. Have you read anything else by them?",
      de: 'Gute Wahl. Hast du noch was anderes von dem Autor gelesen?',
    },
    explanation: {
      en: 'Shows genuine interest in what they like. Opens a natural conversation thread.',
      de: 'Zeigt echtes Interesse. Eröffnet einen natürlichen Gesprächsfaden.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'ol_3',
    categoryId: 'opening_lines',
    situation: { en: 'At a party', de: 'Auf einer Party' },
    text: {
      en: "I don't think we've met yet. I'm [name]. How do you know the host?",
      de: 'Ich glaube, wir kennen uns noch nicht. Ich bin [Name]. Woher kennst du den Gastgeber?',
    },
    explanation: {
      en: 'Classic, confident, and gives you both something to talk about immediately.',
      de: 'Klassisch, selbstbewusst und gibt euch direkt ein Gesprächsthema.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'ol_4',
    categoryId: 'opening_lines',
    situation: { en: 'Gym', de: 'Fitnessstudio' },
    text: {
      en: 'Hey, mind if I work in between your sets? ...I promise I wipe down the bench.',
      de: 'Hey, darf ich zwischen deinen Sätzen ran? ...Ich wisch die Bank danach ab, versprochen.',
    },
    explanation: {
      en: 'Respectful of their space, adds a small joke to break tension. Low-pressure.',
      de: 'Respektiert den persönlichen Raum, kleiner Witz baut Spannung ab. Kein Druck.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium opening lines
  {
    id: 'ol_5',
    categoryId: 'opening_lines',
    situation: { en: 'Dog park', de: 'Hundepark' },
    text: {
      en: 'Your dog has better social skills than me. What breed is that?',
      de: 'Dein Hund hat bessere Social Skills als ich. Was für eine Rasse ist das?',
    },
    explanation: {
      en: 'Self-deprecating humor + genuine question. Dogs are the ultimate icebreaker.',
      de: 'Selbstironischer Humor + echte Frage. Hunde sind der ultimative Eisbrecher.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_6',
    categoryId: 'opening_lines',
    situation: { en: 'Concert / Event', de: 'Konzert / Event' },
    text: {
      en: 'Have you seen them live before? I need to know if I should be more excited.',
      de: 'Hast du die schon mal live gesehen? Ich muss wissen, ob ich noch aufgeregter sein sollte.',
    },
    explanation: {
      en: 'Shows enthusiasm and invites them to share their experience. Creates shared anticipation.',
      de: 'Zeigt Begeisterung und lädt ein, Erfahrungen zu teilen. Schafft gemeinsame Vorfreude.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_7',
    categoryId: 'opening_lines',
    situation: { en: 'Grocery store', de: 'Supermarkt' },
    text: {
      en: "You look like someone who knows their avocados. How do you pick a ripe one?",
      de: 'Du siehst aus wie jemand, der sich mit Avocados auskennt. Woran erkennst du eine reife?',
    },
    explanation: {
      en: 'Playful, unexpected in this setting. Asking for help is disarming and flattering.',
      de: 'Verspielt und unerwartet. Um Hilfe bitten entwaffnet und schmeichelt.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_8',
    categoryId: 'opening_lines',
    situation: { en: 'Waiting in line', de: 'In der Schlange' },
    text: {
      en: "At this rate we'll know each other's life stories before we get to the front.",
      de: 'Bei dem Tempo kennen wir unsere Lebensgeschichten, bevor wir dran sind.',
    },
    explanation: {
      en: 'Turns a boring shared experience into a bonding moment. Light and easy to laugh at.',
      de: 'Verwandelt eine langweilige Situation in einen gemeinsamen Moment. Leicht und witzig.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_9',
    categoryId: 'opening_lines',
    situation: { en: 'Bar / Lounge', de: 'Bar / Lounge' },
    text: {
      en: "I'm trying to branch out from my usual order. What are you drinking?",
      de: 'Ich will mal was Neues ausprobieren. Was trinkst du?',
    },
    explanation: {
      en: 'Asking for recommendations creates instant rapport. Simple, confident, not cheesy.',
      de: 'Nach Empfehlungen fragen schafft sofort Verbindung. Einfach, selbstbewusst, nicht kitschig.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_10',
    categoryId: 'opening_lines',
    situation: { en: 'Museum / Gallery', de: 'Museum / Galerie' },
    text: {
      en: "I've been staring at this piece for five minutes and I still don't get it. What do you see?",
      de: 'Ich starre seit fünf Minuten auf das Bild und kapier es immer noch nicht. Was siehst du?',
    },
    explanation: {
      en: "Vulnerable honesty + genuine curiosity. Shows you're comfortable not knowing everything.",
      de: 'Ehrliche Verletzlichkeit + echte Neugier. Zeigt, dass du okay bist, nicht alles zu wissen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_11',
    categoryId: 'opening_lines',
    situation: { en: 'Class / Workshop', de: 'Kurs / Workshop' },
    text: {
      en: "First time here? I'm brand new and pretending I know what I'm doing.",
      de: 'Erstes Mal hier? Ich bin komplett neu und tue so, als wüsste ich was ich tue.',
    },
    explanation: {
      en: 'Relatable vulnerability. Everyone feels like the new kid — admitting it is refreshing.',
      de: 'Nachvollziehbare Verletzlichkeit. Jeder fühlt sich als Neuling — es zuzugeben ist erfrischend.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_12',
    categoryId: 'opening_lines',
    situation: { en: 'Train / Public transit', de: 'Zug / ÖPNV' },
    text: {
      en: "Good book? I'm always looking for recommendations.",
      de: 'Gutes Buch? Ich suche immer nach Empfehlungen.',
    },
    explanation: {
      en: 'Only use if they actually have a book. Brief, non-intrusive, respects their space.',
      de: 'Nur nutzen, wenn sie tatsächlich ein Buch haben. Kurz, unaufdringlich, respektiert den Raum.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // GENUINE COMPLIMENTS
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'gc_1',
    categoryId: 'compliments',
    situation: { en: 'Noticing effort', de: 'Mühe anerkennen' },
    text: {
      en: 'You have really great energy. It makes people want to be around you.',
      de: 'Du hast eine richtig tolle Ausstrahlung. Man will einfach in deiner Nähe sein.',
    },
    explanation: {
      en: "Compliments their vibe, not just looks. Feels personal and hard to fake.",
      de: 'Kompliment für die Ausstrahlung, nicht nur das Aussehen. Fühlt sich persönlich an.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'gc_2',
    categoryId: 'compliments',
    situation: { en: 'Style / Fashion', de: 'Style / Mode' },
    text: {
      en: "That outfit is really well put together. You've got great taste.",
      de: 'Das Outfit ist echt gut zusammengestellt. Du hast einen super Geschmack.',
    },
    explanation: {
      en: 'Acknowledges their effort and choices rather than just their body.',
      de: 'Würdigt Mühe und Geschmack statt nur den Körper.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'gc_3',
    categoryId: 'compliments',
    situation: { en: 'After a good conversation', de: 'Nach einem guten Gespräch' },
    text: {
      en: "I really enjoy talking to you. You see things differently and I like that.",
      de: 'Ich unterhalte mich echt gern mit dir. Du siehst Dinge anders und das mag ich.',
    },
    explanation: {
      en: 'Compliments their mind, not their face. Creates intellectual connection.',
      de: 'Kompliment für den Geist, nicht das Gesicht. Schafft intellektuelle Verbindung.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium compliments
  {
    id: 'gc_4',
    categoryId: 'compliments',
    situation: { en: 'Their laugh', de: 'Ihr Lachen' },
    text: {
      en: "Your laugh is contagious. I keep trying to say funny things just to hear it again.",
      de: 'Dein Lachen ist ansteckend. Ich versuch immer wieder was Lustiges zu sagen, nur um es nochmal zu hören.',
    },
    explanation: {
      en: 'Specific, genuine, and a little vulnerable — you admit they affect you.',
      de: 'Spezifisch, ehrlich und ein bisschen verletzlich — du gibst zu, dass sie dich berühren.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_5',
    categoryId: 'compliments',
    situation: { en: 'Their passion', de: 'Ihre Leidenschaft' },
    text: {
      en: "The way you talk about [their interest] — your whole face lights up. It's really cool to see.",
      de: 'Wie du über [ihr Interesse] redest — dein ganzes Gesicht leuchtet dabei. Das ist echt toll zu sehen.',
    },
    explanation: {
      en: "Shows you're paying attention to them as a person, not just going through motions.",
      de: 'Zeigt, dass du sie als Person wahrnimmst, nicht nur Smalltalk machst.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_6',
    categoryId: 'compliments',
    situation: { en: 'Their smile', de: 'Ihr Lächeln' },
    text: {
      en: "You have one of those smiles that makes everything around you feel warmer.",
      de: 'Du hast so ein Lächeln, bei dem sich alles um dich herum wärmer anfühlt.',
    },
    explanation: {
      en: 'Poetic but grounded. Describes the effect they have rather than rating their appearance.',
      de: 'Poetisch aber bodenständig. Beschreibt die Wirkung statt das Aussehen zu bewerten.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_7',
    categoryId: 'compliments',
    situation: { en: 'Their confidence', de: 'Ihr Selbstbewusstsein' },
    text: {
      en: "I admire how comfortable you are being yourself. Not a lot of people have that.",
      de: 'Ich bewundere, wie wohl du dich in deiner Haut fühlst. Nicht viele haben das.',
    },
    explanation: {
      en: 'Compliments character trait. Makes them feel seen at a deeper level.',
      de: 'Kompliment für eine Charaktereigenschaft. Gibt ihnen das Gefühl, wirklich gesehen zu werden.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_8',
    categoryId: 'compliments',
    situation: { en: 'Their kindness', de: 'Ihre Freundlichkeit' },
    text: {
      en: "The way you treated that waiter just now — that says a lot about you. And all good things.",
      de: 'Wie du gerade den Kellner behandelt hast — das sagt viel über dich. Und nur Gutes.',
    },
    explanation: {
      en: 'Noticing how they treat others shows deep observation. Very powerful.',
      de: 'Zu bemerken, wie sie andere behandeln, zeigt tiefe Beobachtungsgabe. Sehr wirkungsvoll.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_9',
    categoryId: 'compliments',
    situation: { en: 'Their eyes', de: 'Ihre Augen' },
    text: {
      en: "You have really expressive eyes. I feel like I know what you're thinking before you say it.",
      de: 'Du hast richtig ausdrucksstarke Augen. Ich hab das Gefühl, ich weiß was du denkst, bevor du es sagst.',
    },
    explanation: {
      en: "Intimate but not creepy — focuses on expressiveness, not color. Shows you're engaged.",
      de: 'Intim aber nicht gruselig — fokussiert auf Ausdruck, nicht Farbe. Zeigt Engagement.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_10',
    categoryId: 'compliments',
    situation: { en: 'Their intelligence', de: 'Ihre Intelligenz' },
    text: {
      en: "I love how your mind works. You connect things in ways I wouldn't have thought of.",
      de: 'Ich mag wie du denkst. Du verbindest Dinge auf eine Art, an die ich nie gedacht hätte.',
    },
    explanation: {
      en: 'Celebrates how they think, not just what they know. Deeply flattering.',
      de: 'Würdigt wie sie denken, nicht nur was sie wissen. Zutiefst schmeichelnd.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONVERSATION DEEPENERS
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'cd_1',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Getting past small talk', de: 'Über Smalltalk hinaus' },
    text: {
      en: "What's something you're really excited about right now?",
      de: 'Worauf freust du dich gerade richtig?',
    },
    explanation: {
      en: 'Positive framing invites enthusiasm. People light up when talking about what excites them.',
      de: 'Positive Formulierung lädt zu Begeisterung ein. Menschen strahlen, wenn sie über ihre Freuden reden.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'cd_2',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Learning about them', de: 'Mehr erfahren' },
    text: {
      en: "If you could wake up tomorrow with any skill fully mastered, what would it be?",
      de: 'Wenn du morgen aufwachen könntest und eine Fähigkeit perfekt beherrschen würdest — welche wäre es?',
    },
    explanation: {
      en: 'Reveals their values and dreams. Much more interesting than "What do you do?"',
      de: 'Offenbart Werte und Träume. Viel interessanter als "Was machst du beruflich?"',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'cd_3',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Creating connection', de: 'Verbindung schaffen' },
    text: {
      en: "What's the best advice someone ever gave you?",
      de: 'Was ist der beste Rat, den dir jemand jemals gegeben hat?',
    },
    explanation: {
      en: 'Makes them reflect and share something meaningful. Shows you value depth.',
      de: 'Regt zur Reflexion an und teilt etwas Bedeutungsvolles. Zeigt, dass du Tiefe schätzt.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium conversation deepeners
  {
    id: 'cd_4',
    categoryId: 'conversation_deepeners',
    situation: { en: 'On a date', de: 'Beim Date' },
    text: {
      en: "What do you do when you need to recharge? Like your perfect lazy Sunday.",
      de: 'Was machst du, wenn du auftanken musst? So dein perfekter fauler Sonntag.',
    },
    explanation: {
      en: 'Reveals their comfort zone and lifestyle. Intimate without being intrusive.',
      de: 'Offenbart ihre Komfortzone und Lebensstil. Intim ohne aufdringlich zu sein.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_5',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Building rapport', de: 'Vertrauen aufbauen' },
    text: {
      en: "What's something you changed your mind about recently?",
      de: 'Worüber hast du in letzter Zeit deine Meinung geändert?',
    },
    explanation: {
      en: 'Shows intellectual flexibility. Creates space for vulnerable, real conversation.',
      de: 'Zeigt intellektuelle Flexibilität. Schafft Raum für echte, offene Gespräche.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_6',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Discovering values', de: 'Werte entdecken' },
    text: {
      en: "Who's had the biggest influence on who you are today?",
      de: 'Wer hat den größten Einfluss auf die Person, die du heute bist?',
    },
    explanation: {
      en: 'Gets them to share a meaningful relationship. Reveals what they value in people.',
      de: 'Bringt sie dazu, eine bedeutsame Beziehung zu teilen. Zeigt, was sie an Menschen schätzen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_7',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Getting philosophical', de: 'Philosophisch werden' },
    text: {
      en: "What would you do differently if nobody was watching or judging?",
      de: 'Was würdest du anders machen, wenn niemand zuschauen oder urteilen würde?',
    },
    explanation: {
      en: 'Opens the door to their authentic desires. Creates a judgment-free vibe.',
      de: 'Öffnet die Tür zu authentischen Wünschen. Schafft eine urteilsfreie Atmosphäre.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_8',
    categoryId: 'conversation_deepeners',
    situation: { en: 'After they share something', de: 'Nachdem sie etwas teilen' },
    text: {
      en: "That's really interesting. What made you feel that way?",
      de: 'Das ist echt spannend. Was hat dich dazu gebracht, so zu fühlen?',
    },
    explanation: {
      en: 'Follow-up questions show you actually listened. Most people never ask the second question.',
      de: 'Nachfragen zeigen, dass du wirklich zugehört hast. Die meisten stellen nie die zweite Frage.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_9',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Fun & playful depth', de: 'Spielerische Tiefe' },
    text: {
      en: "If you could have dinner with anyone, alive or dead, who would it be and what would you ask them?",
      de: 'Wenn du mit einer Person essen könntest, lebend oder tot, wer wäre es und was würdest du fragen?',
    },
    explanation: {
      en: 'Classic but effective. The "what would you ask" part makes it more interesting.',
      de: 'Klassisch aber effektiv. "Was würdest du fragen" macht es interessanter als die übliche Version.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_10',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Playful vulnerability', de: 'Spielerische Offenheit' },
    text: {
      en: "What's your most unpopular opinion? I promise I won't judge. Much.",
      de: 'Was ist deine unpopulärste Meinung? Ich verspreche, nicht zu urteilen. Nicht viel zumindest.',
    },
    explanation: {
      en: 'Creates playful tension and invites authenticity. The "much" softens it with humor.',
      de: 'Schafft spielerische Spannung und lädt zur Ehrlichkeit ein. "Nicht viel" mildert es mit Humor.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // WITTY RESPONSES
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'wr_1',
    categoryId: 'witty_responses',
    situation: { en: 'When they say "You\'re funny"', de: 'Wenn sie sagen "Du bist lustig"' },
    text: {
      en: "Thanks, I rehearse in the mirror every morning. You're seeing premium content.",
      de: 'Danke, ich übe jeden Morgen vor dem Spiegel. Du siehst gerade Premium-Content.',
    },
    explanation: {
      en: 'Self-aware humor. Shows confidence without taking yourself too seriously.',
      de: 'Selbstbewusster Humor. Zeigt Selbstvertrauen ohne sich zu ernst zu nehmen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'wr_2',
    categoryId: 'witty_responses',
    situation: { en: 'When they tease you', de: 'Wenn sie dich aufziehen' },
    text: {
      en: "Careful, I'm starting to think you actually like me.",
      de: 'Vorsicht, ich fange an zu glauben, dass du mich tatsächlich magst.',
    },
    explanation: {
      en: 'Flips the tease back on them. Creates playful tension and keeps the banter going.',
      de: 'Dreht den Spieß um. Erzeugt spielerische Spannung und hält den Flirt am Laufen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'wr_3',
    categoryId: 'witty_responses',
    situation: { en: 'When asked "What do you do?"', de: 'Wenn gefragt "Was machst du beruflich?"' },
    text: {
      en: 'Professionally? [Answer]. But what I really do is [passion/hobby]. That\'s the interesting part.',
      de: 'Beruflich? [Antwort]. Aber was ich wirklich mache ist [Leidenschaft/Hobby]. Das ist der spannende Teil.',
    },
    explanation: {
      en: 'Answers the boring question but pivots to what makes you unique.',
      de: 'Beantwortet die langweilige Frage, lenkt aber auf das, was dich einzigartig macht.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium witty responses
  {
    id: 'wr_4',
    categoryId: 'witty_responses',
    situation: { en: 'When they say "I never do this"', de: 'Wenn sie sagen "Ich mache das sonst nie"' },
    text: {
      en: "That's exactly what someone who always does this would say.",
      de: 'Das ist genau das, was jemand sagen würde, der das immer macht.',
    },
    explanation: {
      en: 'Playful call-out with a smile. Creates that "Did they just say that?" spark.',
      de: 'Spielerisches Entlarven mit einem Lächeln. Erzeugt den "Hat er das gerade echt gesagt?"-Funken.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_5',
    categoryId: 'witty_responses',
    situation: { en: 'When they compliment you', de: 'Wenn sie dir ein Kompliment machen' },
    text: {
      en: "Keep talking, I'm writing all of this down for my self-esteem journal.",
      de: 'Rede weiter, ich schreibe das alles in mein Selbstwertgefühl-Tagebuch.',
    },
    explanation: {
      en: 'Deflects with humor while still accepting the compliment gracefully.',
      de: 'Lenkt mit Humor ab, nimmt das Kompliment aber trotzdem an.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_6',
    categoryId: 'witty_responses',
    situation: { en: 'When there\'s an awkward silence', de: 'Bei peinlicher Stille' },
    text: {
      en: "Well, this is the part where I'd normally say something charming. Give me a second.",
      de: 'Okay, das ist der Teil, wo ich normalerweise was Charmantes sage. Gib mir eine Sekunde.',
    },
    explanation: {
      en: 'Acknowledging awkwardness kills it. Shows confidence and self-awareness.',
      de: 'Peinlichkeit anzuerkennen löst sie auf. Zeigt Selbstvertrauen und Selbstbewusstsein.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_7',
    categoryId: 'witty_responses',
    situation: { en: 'When they say "You seem different"', de: 'Wenn sie sagen "Du bist anders"' },
    text: {
      en: "Different good or different 'I should run'? Because I need to adjust my strategy.",
      de: "Anders gut oder anders 'ich sollte rennen'? Ich muss nämlich meine Strategie anpassen.",
    },
    explanation: {
      en: 'Shows you can laugh at yourself while also subtly asking for clarification.',
      de: 'Zeigt, dass du über dich selbst lachen kannst und fragst gleichzeitig subtil nach.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_8',
    categoryId: 'witty_responses',
    situation: { en: 'When they cancel plans', de: 'Wenn sie Pläne absagen' },
    text: {
      en: "No worries. My couch and I were about to get jealous anyway. Rain check?",
      de: 'Kein Ding. Mein Sofa und ich wären sowieso eifersüchtig geworden. Verschieben wir?',
    },
    explanation: {
      en: 'No guilt-tripping. Light humor + suggesting a reschedule shows maturity and interest.',
      de: 'Kein schlechtes Gewissen machen. Humor + Vorschlag zum Verschieben zeigt Reife und Interesse.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_9',
    categoryId: 'witty_responses',
    situation: { en: 'When asked about relationship status', de: 'Wenn nach Beziehungsstatus gefragt' },
    text: {
      en: "Currently accepting applications. The interview process is very rigorous though.",
      de: 'Aktuell nehme ich Bewerbungen entgegen. Das Bewerbungsverfahren ist aber sehr streng.',
    },
    explanation: {
      en: 'Signals availability with humor and high standards. Playful and confident.',
      de: 'Signalisiert Verfügbarkeit mit Humor und hohen Standards. Spielerisch und selbstbewusst.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_10',
    categoryId: 'witty_responses',
    situation: { en: 'When they ask for your number', de: 'Wenn sie nach deiner Nummer fragen' },
    text: {
      en: "Hmm... I don't usually give that out. But you've made a compelling case in the last [time].",
      de: 'Hmm... normalerweise gebe ich die nicht raus. Aber du hast in den letzten [Zeit] ein überzeugendes Argument gemacht.',
    },
    explanation: {
      en: 'Creates scarcity while still saying yes. Makes them feel like they earned it.',
      de: 'Erzeugt Knappheit und sagt trotzdem ja. Gibt ihnen das Gefühl, es verdient zu haben.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // SMART VOCABULARY
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'sv_1',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Italian — effortless charm', de: 'Italienisch — müheloser Charme' },
    text: {
      en: 'Sprezzatura — the art of making everything you do look effortless, as if you weren\'t even trying.',
      de: 'Sprezzatura — die Kunst, alles mühelos aussehen zu lassen, als würdest du es nicht einmal versuchen.',
    },
    explanation: {
      en: 'Coined by Castiglione in 1528. The most attractive people never look like they\'re performing.',
      de: 'Geprägt von Castiglione 1528. Die attraktivsten Menschen sehen nie so aus, als würden sie performen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'sv_2',
    categoryId: 'smart_vocabulary',
    situation: { en: 'French — electric chemistry', de: 'Französisch — elektrische Chemie' },
    text: {
      en: 'Frisson — that sudden shiver of excitement when chemistry hits. The electric moment before a first kiss.',
      de: 'Frisson — dieses plötzliche Schaudern der Aufregung, wenn die Chemie stimmt. Der elektrische Moment vor dem ersten Kuss.',
    },
    explanation: {
      en: 'Learning to notice and create these micro-moments is what separates good dates from unforgettable ones.',
      de: 'Diese Mikro-Momente zu erkennen und zu erzeugen unterscheidet gute Dates von unvergesslichen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'sv_3',
    categoryId: 'smart_vocabulary',
    situation: { en: 'English — magnetic storytelling', de: 'Englisch — magnetisches Erzählen' },
    text: {
      en: 'Raconteur — someone who tells stories with such flair that everyone leans in and forgets their phone exists.',
      de: 'Raconteur — jemand, der Geschichten so erzählt, dass alle sich vorbeugen und ihr Handy vergessen.',
    },
    explanation: {
      en: 'The person at the party everyone gravitates toward. A learnable skill, not a born talent.',
      de: 'Die Person auf der Party, zu der alle hingezogen werden. Eine erlernbare Fähigkeit.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium vocabulary
  {
    id: 'sv_4',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Portuguese — bittersweet longing', de: 'Portugiesisch — bittersüße Sehnsucht' },
    text: {
      en: 'Saudade — the deep, melancholic longing for someone or something absent. The beautiful ache of missing what once was.',
      de: 'Saudade — die tiefe, melancholische Sehnsucht nach jemandem oder etwas Abwesendem. Der schöne Schmerz des Vermissens.',
    },
    explanation: {
      en: 'Use it when you want to describe missing someone in a way that sounds poetic, not needy.',
      de: 'Benutze es, um Vermissen poetisch statt bedürftig klingen zu lassen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_5',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Psychology — obsessive infatuation', de: 'Psychologie — obsessive Verliebtheit' },
    text: {
      en: 'Limerence — the involuntary state of obsessive romantic infatuation. Not love, not a crush — a neurochemical storm.',
      de: 'Limerence — der unwillkürliche Zustand obsessiver romantischer Verliebtheit. Keine Liebe, kein Schwarm — ein neurochemischer Sturm.',
    },
    explanation: {
      en: 'Knowing this word helps you recognize when you\'re in it — and talk about it intelligently.',
      de: 'Dieses Wort zu kennen hilft dir zu erkennen, wenn du drin steckst — und darüber zu reden.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_6',
    categoryId: 'smart_vocabulary',
    situation: { en: 'French — cool nonchalance', de: 'Französisch — coole Lässigkeit' },
    text: {
      en: 'Insouciance — a carefree, almost reckless nonchalance. The vibe of someone who genuinely doesn\'t need your approval.',
      de: 'Insouciance — eine sorglose, fast verwegene Gelassenheit. Die Ausstrahlung von jemandem, der deine Anerkennung nicht braucht.',
    },
    explanation: {
      en: 'The opposite of trying too hard. Drop this in conversation and watch people lean in.',
      de: 'Das Gegenteil von sich zu sehr anstrengen. Lass es in ein Gespräch einfließen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_7',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Spanish — raw authentic presence', de: 'Spanisch — rohe authentische Präsenz' },
    text: {
      en: 'Duende — that raw, almost primal authenticity that moves people on a gut level. You can\'t fake it; you can only stop suppressing it.',
      de: 'Duende — diese rohe, fast ursprüngliche Authentizität, die Menschen auf einer tiefen Ebene berührt. Man kann es nicht vortäuschen; man kann nur aufhören, es zu unterdrücken.',
    },
    explanation: {
      en: 'Garcia Lorca said duende is the spirit of the earth. It\'s what makes someone unforgettable.',
      de: 'Garcia Lorca sagte, Duende ist der Geist der Erde. Es macht jemanden unvergesslich.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_8',
    categoryId: 'smart_vocabulary',
    situation: { en: 'French — social instinct', de: 'Französisch — sozialer Instinkt' },
    text: {
      en: 'Savoir-faire — the instinctive ability to say and do the right thing in any social situation, without thinking about it.',
      de: 'Savoir-faire — die instinktive Fähigkeit, in jeder sozialen Situation das Richtige zu sagen und zu tun, ohne darüber nachzudenken.',
    },
    explanation: {
      en: 'Beyond social skills — it\'s social elegance. The person who never has an awkward moment.',
      de: 'Mehr als Social Skills — es ist soziale Eleganz. Die Person, die nie einen peinlichen Moment hat.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_9',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Greek — soulful passion', de: 'Griechisch — seelenvolle Leidenschaft' },
    text: {
      en: 'Meraki — doing something with absolute soul and passion, pouring yourself completely into the moment.',
      de: 'Meraki — etwas mit absoluter Seele und Leidenschaft tun, sich komplett in den Moment hineingeben.',
    },
    explanation: {
      en: 'When you cook for someone with meraki, they taste the love. Apply it to everything.',
      de: 'Wenn du mit Meraki für jemanden kochst, schmeckt man die Liebe. Wende es auf alles an.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_10',
    categoryId: 'smart_vocabulary',
    situation: { en: 'English — devastating brevity', de: 'Englisch — vernichtende Kürze' },
    text: {
      en: 'Laconic — the art of saying more with less. A devastatingly brief response that lands harder than a paragraph ever could.',
      de: 'Lakonisch — die Kunst, mit weniger mehr zu sagen. Eine vernichtend kurze Antwort, die härter trifft als jeder Absatz.',
    },
    explanation: {
      en: 'Named after the Spartans of Laconia, famous for brutal one-liners in the face of threats.',
      de: 'Benannt nach den Spartanern aus Lakonien, berühmt für brutale Einzeiler angesichts von Drohungen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_11',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Japanese — imperfect beauty', de: 'Japanisch — unvollkommene Schönheit' },
    text: {
      en: 'Wabi-sabi — finding beauty in imperfection. The crack in the cup, the scar with a story, the awkward laugh that\'s more charming than a perfect smile.',
      de: 'Wabi-Sabi — Schönheit in der Unvollkommenheit finden. Der Riss in der Tasse, die Narbe mit Geschichte, das unbeholfene Lachen, das charmanter ist als ein perfektes Lächeln.',
    },
    explanation: {
      en: 'The antidote to trying to seem perfect. Your flaws, owned well, are your most attractive features.',
      de: 'Das Gegenmittel gegen den Drang, perfekt zu wirken. Deine Fehler, gut getragen, sind deine attraktivsten Eigenschaften.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_12',
    categoryId: 'smart_vocabulary',
    situation: { en: 'French — the joy of living', de: 'Französisch — Lebensfreude' },
    text: {
      en: 'Joie de vivre — an infectious, exuberant love of life that makes everyone around you feel more alive.',
      de: 'Joie de vivre — eine ansteckende, überschwängliche Lebensfreude, die alle um dich herum lebendiger fühlen lässt.',
    },
    explanation: {
      en: 'The single most attractive quality. People don\'t fall for perfection — they fall for aliveness.',
      de: 'Die attraktivste Eigenschaft überhaupt. Menschen verlieben sich nicht in Perfektion — sondern in Lebendigkeit.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CLOSING LINES
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'cl_1',
    categoryId: 'closing_lines',
    situation: { en: 'Getting their number', de: 'Nummer bekommen' },
    text: {
      en: "I've really enjoyed this. We should continue it — can I get your number?",
      de: 'Das hat mir echt Spaß gemacht. Wir sollten das fortsetzen — kann ich deine Nummer haben?',
    },
    explanation: {
      en: "Direct, honest, no games. Referencing the good time you just had makes it natural.",
      de: 'Direkt, ehrlich, keine Spielchen. Bezug auf die gute Zeit macht es natürlich.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'cl_2',
    categoryId: 'closing_lines',
    situation: { en: 'Suggesting a next date', de: 'Nächstes Date vorschlagen' },
    text: {
      en: "You mentioned you love [thing they said]. There's this great [related place] — want to check it out together this week?",
      de: 'Du hast erwähnt, dass du [was sie gesagt haben] liebst. Es gibt diesen tollen [verwandten Ort] — wollen wir uns das diese Woche zusammen anschauen?',
    },
    explanation: {
      en: "Shows you listened, gives a specific plan, and sets a timeframe. Don't leave it vague.",
      de: 'Zeigt, dass du zugehört hast, gibt einen konkreten Plan und Zeitrahmen. Nicht vage lassen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'cl_3',
    categoryId: 'closing_lines',
    situation: { en: 'Leaving with impact', de: 'Eindrucksvoll verabschieden' },
    text: {
      en: "I have to head out, but I'm really glad I came over and talked to you.",
      de: 'Ich muss los, aber ich bin echt froh, dass ich rübergekommen bin und dich angesprochen habe.',
    },
    explanation: {
      en: 'Leaves on a high note. Shows intentionality — you chose to approach and you\'re glad you did.',
      de: 'Geht auf einem Höhepunkt. Zeigt Absicht — du hast dich entschieden anzusprechen und bist froh darüber.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium closing lines
  {
    id: 'cl_4',
    categoryId: 'closing_lines',
    situation: { en: 'Confident number exchange', de: 'Selbstsicherer Nummerntausch' },
    text: {
      en: "Here — put your number in. I'll text you something that'll make you smile.",
      de: 'Hier — gib deine Nummer ein. Ich schicke dir was, das dich zum Lächeln bringt.',
    },
    explanation: {
      en: 'Assertive and fun. Handing your phone over shows confidence. The promise creates anticipation.',
      de: 'Bestimmt und spaßig. Das Handy rübergeben zeigt Selbstvertrauen. Das Versprechen erzeugt Vorfreude.',
    },
    isPremium: true,
    forGender: 'male',
  },
  {
    id: 'cl_5',
    categoryId: 'closing_lines',
    situation: { en: 'Playful close', de: 'Spielerischer Abschluss' },
    text: {
      en: "I need to go, but I have a feeling we're not done. Same time, same place, or somewhere better?",
      de: 'Ich muss gehen, aber ich habe das Gefühl, wir sind noch nicht fertig. Gleiche Zeit, gleicher Ort, oder wo Besseres?',
    },
    explanation: {
      en: 'Creates continuity. Assumes there will be a next time without being pushy.',
      de: 'Schafft Kontinuität. Nimmt ein nächstes Mal an, ohne aufdringlich zu sein.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cl_6',
    categoryId: 'closing_lines',
    situation: { en: 'After a great date', de: 'Nach einem tollen Date' },
    text: {
      en: "Tonight was genuinely fun. I'd love to do this again — and next time you pick the place.",
      de: 'Heute Abend war echt toll. Ich würde das gerne wiederholen — und nächstes Mal suchst du den Ort aus.',
    },
    explanation: {
      en: 'Affirms the date, shows interest in a second, and involves them in planning.',
      de: 'Bestätigt das Date, zeigt Interesse an einem zweiten und bezieht sie in die Planung ein.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cl_7',
    categoryId: 'closing_lines',
    situation: { en: 'The follow-up text', de: 'Die Follow-up-Nachricht' },
    text: {
      en: "So I just realized I forgot to ask you about [something from the conversation]. Guess we need a round two.",
      de: 'Mir ist gerade aufgefallen, dass ich vergessen hab dich nach [Gesprächsthema] zu fragen. Heißt wohl, wir brauchen eine Runde zwei.',
    },
    explanation: {
      en: 'References the actual conversation (shows you listened) and naturally segues to asking for a second meeting.',
      de: 'Bezieht sich auf das Gespräch (zeigt Zuhören) und leitet natürlich zu einem zweiten Treffen über.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cl_8',
    categoryId: 'closing_lines',
    situation: { en: 'Leaving a group setting', de: 'Eine Gruppenrunde verlassen' },
    text: {
      en: "Hey, I'm heading out — but it was really nice meeting you. Can I message you sometime?",
      de: 'Hey, ich gehe jetzt — aber es war echt nett, dich kennenzulernen. Darf ich dir mal schreiben?',
    },
    explanation: {
      en: 'Simple, polite, and direct. Pulling someone aside briefly shows genuine interest.',
      de: 'Einfach, höflich und direkt. Jemanden kurz beiseitezuziehen zeigt echtes Interesse.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cl_9',
    categoryId: 'closing_lines',
    situation: { en: 'Subtle hint for them to approach', de: 'Subtiler Hinweis zum Ansprechen' },
    text: {
      en: "I keep running into you here. Maybe the universe is trying to tell us something.",
      de: 'Ich laufe dir hier ständig über den Weg. Vielleicht versucht das Universum uns etwas zu sagen.',
    },
    explanation: {
      en: 'Playful and opens the door without pressure. Works when you\'ve seen them before.',
      de: 'Verspielt und öffnet die Tür ohne Druck. Funktioniert wenn man sich schon gesehen hat.',
    },
    isPremium: true,
    forGender: 'female',
  },
  {
    id: 'cl_10',
    categoryId: 'closing_lines',
    situation: { en: 'Bold & direct', de: 'Mutig & direkt' },
    text: {
      en: "Look, I'll be direct — I think you're great and I'd regret not asking. Coffee this weekend?",
      de: 'Ich sag es direkt — ich finde dich toll und würde es bereuen, nicht zu fragen. Kaffee am Wochenende?',
    },
    explanation: {
      en: 'Directness is attractive. Framing it as "I\'d regret not asking" shows courage, not desperation.',
      de: 'Direktheit ist attraktiv. "Ich würde es bereuen" zeigt Mut, keine Verzweiflung.',
    },
    isPremium: true,
    forGender: 'all',
  },
];

export function getPhrasesForCategory(categoryId: PhraseCategoryId): Phrase[] {
  return phrases.filter((p) => p.categoryId === categoryId);
}

export function getFreePhraseCount(categoryId: PhraseCategoryId): number {
  return phrases.filter((p) => p.categoryId === categoryId && !p.isPremium).length;
}

export function getTotalPhraseCount(categoryId: PhraseCategoryId): number {
  return phrases.filter((p) => p.categoryId === categoryId).length;
}
