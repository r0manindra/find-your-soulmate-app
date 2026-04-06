export type PhraseCategoryId =
  | 'opening_lines'
  | 'compliments'
  | 'conversation_deepeners'
  | 'witty_responses'
  | 'smart_vocabulary'
  | 'closing_lines'
  | 'texting_dms'
  | 'confidence_boosters'
  | 'date_conversation'
  | 'body_language'
  | 'story_replies';

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
  {
    id: 'texting_dms',
    name: { en: 'Texting & DMs', de: 'Texten & Nachrichten' },
    icon: 'phone-portrait',
    color: '#6366F1',
  },
  {
    id: 'confidence_boosters',
    name: { en: 'Confidence Boosters', de: 'Selbstvertrauen stärken' },
    icon: 'shield-checkmark',
    color: '#14B8A6',
  },
  {
    id: 'date_conversation',
    name: { en: 'Date Conversation', de: 'Date-Gespräche' },
    icon: 'restaurant',
    color: '#F97316',
  },
  {
    id: 'body_language',
    name: { en: 'Body Language + Words', de: 'Körpersprache + Worte' },
    icon: 'body',
    color: '#A855F7',
  },
  {
    id: 'story_replies',
    name: { en: 'Story Replies', de: 'Story-Antworten' },
    icon: 'camera',
    color: '#E8435A',
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
      en: "Excuse me - what did you order? I've been staring at this menu for way too long.",
      de: 'Entschuldige - was hast du bestellt? Ich starre schon viel zu lange auf die Karte.',
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
  {
    id: 'ol_5',
    categoryId: 'opening_lines',
    situation: { en: 'Festival / Outdoor event', de: 'Festival / Open-Air' },
    text: {
      en: "This is my first time at this festival. Any must-see tips from a pro?",
      de: 'Ich bin zum ersten Mal auf diesem Festival. Hast du als Profi irgendwelche Tipps?',
    },
    explanation: {
      en: 'Flatters them as an expert. Asking for advice is disarming and opens easy conversation.',
      de: 'Schmeichelt als Experte. Um Rat fragen entwaffnet und eröffnet lockeres Gespräch.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium opening lines
  {
    id: 'ol_6',
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
    id: 'ol_7',
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
    id: 'ol_8',
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
    id: 'ol_9',
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
    id: 'ol_10',
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
    id: 'ol_11',
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
    id: 'ol_12',
    categoryId: 'opening_lines',
    situation: { en: 'Class / Workshop', de: 'Kurs / Workshop' },
    text: {
      en: "First time here? I'm brand new and pretending I know what I'm doing.",
      de: 'Erstes Mal hier? Ich bin komplett neu und tue so, als wüsste ich was ich tue.',
    },
    explanation: {
      en: 'Relatable vulnerability. Everyone feels like the new kid - admitting it is refreshing.',
      de: 'Nachvollziehbare Verletzlichkeit. Jeder fühlt sich als Neuling - es zuzugeben ist erfrischend.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_13',
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
  {
    id: 'ol_14',
    categoryId: 'opening_lines',
    situation: { en: 'Cooking class', de: 'Kochkurs' },
    text: {
      en: "I'm pretty sure mine isn't supposed to look like that. How's yours going?",
      de: 'Ich bin mir ziemlich sicher, dass meins nicht so aussehen sollte. Wie läuft es bei dir?',
    },
    explanation: {
      en: 'Self-deprecating humor in a shared activity. Creates instant camaraderie.',
      de: 'Selbstironischer Humor bei gemeinsamer Aktivität. Schafft sofort Kameradschaft.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_15',
    categoryId: 'opening_lines',
    situation: { en: 'Farmers market', de: 'Wochenmarkt' },
    text: {
      en: 'Have you tried these before? I can never walk past this stand without buying something.',
      de: 'Hast du die schon mal probiert? Ich kann nie an diesem Stand vorbeigehen, ohne etwas zu kaufen.',
    },
    explanation: {
      en: 'Sharing enthusiasm about food is universally connecting. Low-pressure and genuine.',
      de: 'Begeisterung über Essen teilen verbindet immer. Kein Druck und authentisch.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_16',
    categoryId: 'opening_lines',
    situation: { en: 'Shared workspace / Café working', de: 'Co-Working / Café-Arbeit' },
    text: {
      en: "You look like you're in the zone. I don't want to interrupt, but... is the wifi actually working for you?",
      de: 'Du siehst aus, als wärst du voll drin. Ich will nicht stören, aber... funktioniert bei dir das WLAN?',
    },
    explanation: {
      en: 'Acknowledges their focus (respectful), then asks a practical question that opens conversation.',
      de: 'Erkennt ihren Fokus an (respektvoll), dann eine praktische Frage, die Gespräch eröffnet.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_17',
    categoryId: 'opening_lines',
    situation: { en: 'Hiking trail', de: 'Wanderweg' },
    text: {
      en: "Please tell me the view at the top is worth this. I'm running on hope at this point.",
      de: 'Bitte sag mir, dass die Aussicht oben das wert ist. Ich laufe gerade nur noch auf Hoffnung.',
    },
    explanation: {
      en: 'Shared struggle creates bonding. Humorous vulnerability on a trail is very natural.',
      de: 'Gemeinsame Anstrengung verbindet. Humorvolle Verletzlichkeit auf einem Wanderweg ist sehr natürlich.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_18',
    categoryId: 'opening_lines',
    situation: { en: 'Rainy weather', de: 'Regenwetter' },
    text: {
      en: "Didn't check the weather either? We should start a support group.",
      de: 'Auch nicht aufs Wetter geschaut? Wir sollten eine Selbsthilfegruppe gründen.',
    },
    explanation: {
      en: 'Bonds over shared misfortune. Weather complaints are universal icebreakers in German culture.',
      de: 'Verbindet über gemeinsames Pech. Wetter-Klagen sind universelle Eisbrecher in der deutschen Kultur.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_19',
    categoryId: 'opening_lines',
    situation: { en: 'Beach / Pool', de: 'Strand / Pool' },
    text: {
      en: "Is this spot taken? I promise I'm better company than an empty towel.",
      de: 'Ist hier noch frei? Ich bin bessere Gesellschaft als ein leeres Handtuch, versprochen.',
    },
    explanation: {
      en: 'Light, doesn\'t take itself seriously. Beach setting already has relaxed vibes.',
      de: 'Leicht, nimmt sich nicht zu ernst. Strand-Setting hat sowieso entspannte Vibes.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_20',
    categoryId: 'opening_lines',
    situation: { en: 'Volunteer event', de: 'Ehrenamtliches Event' },
    text: {
      en: "What made you sign up for this? I came for the free snacks but stayed for the good vibes.",
      de: 'Was hat dich dazu gebracht, dich anzumelden? Ich kam wegen der Gratis-Snacks und bin wegen der guten Stimmung geblieben.',
    },
    explanation: {
      en: 'Self-deprecating + shows shared values. Volunteer events are gold for meeting genuine people.',
      de: 'Selbstironisch + zeigt gemeinsame Werte. Ehrenamtliche Events sind Gold zum Kennenlernen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_21',
    categoryId: 'opening_lines',
    situation: { en: 'Laundromat', de: 'Waschsalon' },
    text: {
      en: "We're both here on a Saturday night doing laundry. I feel like that makes us automatically friends.",
      de: 'Wir sind beide Samstagabend im Waschsalon. Ich finde, das macht uns automatisch zu Freunden.',
    },
    explanation: {
      en: 'Shared mundane situation + humor about it. Unexpected places make for great stories.',
      de: 'Gemeinsame alltägliche Situation + Humor darüber. Unerwartete Orte machen tolle Geschichten.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_22',
    categoryId: 'opening_lines',
    situation: { en: 'Delayed flight / train', de: 'Verspäteter Flug / Zug' },
    text: {
      en: "At this point, I think we all deserve a group chat. How long have you been waiting?",
      de: 'An diesem Punkt verdienen wir alle einen Gruppenchat. Wie lange wartest du schon?',
    },
    explanation: {
      en: 'Shared frustration is bonding. Travel delays create a temporary community feeling.',
      de: 'Gemeinsame Frustration verbindet. Reiseverzögerungen schaffen ein temporäres Gemeinschaftsgefühl.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'ol_23',
    categoryId: 'opening_lines',
    situation: { en: 'Wine tasting / Food event', de: 'Weinprobe / Food-Event' },
    text: {
      en: "I'm pretending I can taste 'notes of oak and blackberry'. Can you actually tell the difference?",
      de: "Ich tue so, als würde ich 'Noten von Eiche und Brombeere' schmecken. Kannst du wirklich den Unterschied erkennen?",
    },
    explanation: {
      en: 'Honest vulnerability at a pretentious event. Most people are also pretending - they\'ll appreciate the honesty.',
      de: 'Ehrliche Verletzlichkeit bei prätentiösem Event. Die meisten tun auch so - sie werden die Ehrlichkeit schätzen.',
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
  {
    id: 'gc_4',
    categoryId: 'compliments',
    situation: { en: 'Their humor', de: 'Ihr Humor' },
    text: {
      en: "You're one of the few people who actually makes me laugh out loud. That's rare.",
      de: 'Du bist eine der wenigen Personen, die mich wirklich zum Lachen bringen. Das ist selten.',
    },
    explanation: {
      en: "Saying it's rare makes them feel special. Everyone wants to be funny.",
      de: '"Selten" gibt ihnen ein besonderes Gefühl. Jeder möchte lustig sein.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium compliments
  {
    id: 'gc_5',
    categoryId: 'compliments',
    situation: { en: 'Their laugh', de: 'Ihr Lachen' },
    text: {
      en: "Your laugh is contagious. I keep trying to say funny things just to hear it again.",
      de: 'Dein Lachen ist ansteckend. Ich versuch immer wieder was Lustiges zu sagen, nur um es nochmal zu hören.',
    },
    explanation: {
      en: 'Specific, genuine, and a little vulnerable - you admit they affect you.',
      de: 'Spezifisch, ehrlich und ein bisschen verletzlich - du gibst zu, dass sie dich berühren.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_6',
    categoryId: 'compliments',
    situation: { en: 'Their passion', de: 'Ihre Leidenschaft' },
    text: {
      en: "The way you talk about [their interest] - your whole face lights up. It's really cool to see.",
      de: 'Wie du über [ihr Interesse] redest - dein ganzes Gesicht leuchtet dabei. Das ist echt toll zu sehen.',
    },
    explanation: {
      en: "Shows you're paying attention to them as a person, not just going through motions.",
      de: 'Zeigt, dass du sie als Person wahrnimmst, nicht nur Smalltalk machst.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_7',
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
    id: 'gc_8',
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
    id: 'gc_9',
    categoryId: 'compliments',
    situation: { en: 'Their kindness', de: 'Ihre Freundlichkeit' },
    text: {
      en: "The way you treated that waiter just now - that says a lot about you. And all good things.",
      de: 'Wie du gerade den Kellner behandelt hast - das sagt viel über dich. Und nur Gutes.',
    },
    explanation: {
      en: 'Noticing how they treat others shows deep observation. Very powerful.',
      de: 'Zu bemerken, wie sie andere behandeln, zeigt tiefe Beobachtungsgabe. Sehr wirkungsvoll.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_10',
    categoryId: 'compliments',
    situation: { en: 'Their eyes', de: 'Ihre Augen' },
    text: {
      en: "You have really expressive eyes. I feel like I know what you're thinking before you say it.",
      de: 'Du hast richtig ausdrucksstarke Augen. Ich hab das Gefühl, ich weiß was du denkst, bevor du es sagst.',
    },
    explanation: {
      en: "Intimate but not creepy - focuses on expressiveness, not color. Shows you're engaged.",
      de: 'Intim aber nicht gruselig - fokussiert auf Ausdruck, nicht Farbe. Zeigt Engagement.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_11',
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
  {
    id: 'gc_12',
    categoryId: 'compliments',
    situation: { en: 'Their voice', de: 'Ihre Stimme' },
    text: {
      en: "Has anyone told you you have a really calming voice? I could listen to you talk for hours.",
      de: 'Hat dir schon mal jemand gesagt, dass du eine richtig beruhigende Stimme hast? Ich könnte dir stundenlang zuhören.',
    },
    explanation: {
      en: 'Unusual compliment that catches people off guard in the best way. Feels intimate.',
      de: 'Ungewöhnliches Kompliment, das positiv überrascht. Fühlt sich intim an.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_13',
    categoryId: 'compliments',
    situation: { en: 'Their uniqueness', de: 'Ihre Einzigartigkeit' },
    text: {
      en: "I've met a lot of people, but I genuinely haven't met anyone quite like you.",
      de: 'Ich habe viele Leute kennengelernt, aber jemanden wie dich wirklich noch nicht.',
    },
    explanation: {
      en: 'Simple but powerful. Everyone wants to feel one-of-a-kind. Deliver it genuinely.',
      de: 'Einfach aber wirkungsvoll. Jeder möchte sich einzigartig fühlen. Ehrlich rüberbringen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_14',
    categoryId: 'compliments',
    situation: { en: 'Their creative work', de: 'Ihre kreative Arbeit' },
    text: {
      en: "I can really see your personality in this. It's so clearly you.",
      de: 'Man kann deine Persönlichkeit darin richtig sehen. Es ist so eindeutig du.',
    },
    explanation: {
      en: 'Connecting their work to who they are hits deeper than just "this is good".',
      de: 'Ihre Arbeit mit ihrer Person zu verbinden trifft tiefer als nur "das ist gut".',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_15',
    categoryId: 'compliments',
    situation: { en: 'Their presence', de: 'Ihre Präsenz' },
    text: {
      en: "There's something about you that makes the room feel different when you walk in. In the best way.",
      de: 'Irgendetwas an dir verändert den Raum, wenn du reinkommst. Auf die beste Art.',
    },
    explanation: {
      en: 'Describes their impact without being specific about appearance. Mysterious and powerful.',
      de: 'Beschreibt ihre Wirkung ohne Fokus auf Aussehen. Geheimnisvoll und kraftvoll.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'gc_16',
    categoryId: 'compliments',
    situation: { en: 'Their storytelling', de: 'Ihr Erzählen' },
    text: {
      en: "You could make a trip to the grocery store sound like an adventure. Seriously, you should write a book.",
      de: 'Du könntest einen Einkauf im Supermarkt wie ein Abenteuer klingen lassen. Ernsthaft, du solltest ein Buch schreiben.',
    },
    explanation: {
      en: 'Celebrates their ability to captivate. Everyone loves being told they\'re a good storyteller.',
      de: 'Feiert ihre Fähigkeit zu fesseln. Jeder hört gerne, dass er gut erzählen kann.',
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
      de: 'Wenn du morgen aufwachen könntest und eine Fähigkeit perfekt beherrschen würdest - welche wäre es?',
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
  {
    id: 'cd_4',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Spontaneity question', de: 'Spontanitäts-Frage' },
    text: {
      en: "What's the most spontaneous thing you've ever done?",
      de: 'Was ist das Spontanste, was du jemals gemacht hast?',
    },
    explanation: {
      en: 'Invites exciting stories and reveals their adventurous side. Energy lifter.',
      de: 'Lädt zu spannenden Geschichten ein und zeigt ihre abenteuerliche Seite.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium conversation deepeners
  {
    id: 'cd_5',
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
    id: 'cd_6',
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
    id: 'cd_7',
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
    id: 'cd_8',
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
    id: 'cd_9',
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
    id: 'cd_10',
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
    id: 'cd_11',
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
  {
    id: 'cd_12',
    categoryId: 'conversation_deepeners',
    situation: { en: 'FORD method - Dreams', de: 'FORD-Methode - Träume' },
    text: {
      en: "If money and time weren't factors, what would your life look like?",
      de: 'Wenn Geld und Zeit keine Rolle spielen würden, wie würde dein Leben aussehen?',
    },
    explanation: {
      en: 'FORD = Family, Occupation, Recreation, Dreams. Dream questions create the deepest connections.',
      de: 'FORD = Familie, Beruf, Freizeit, Träume. Traum-Fragen schaffen die tiefsten Verbindungen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_13',
    categoryId: 'conversation_deepeners',
    situation: { en: 'FORD method - Family', de: 'FORD-Methode - Familie' },
    text: {
      en: "Are you close with your family? What's the dynamic like?",
      de: 'Stehst du deiner Familie nahe? Wie ist so die Dynamik bei euch?',
    },
    explanation: {
      en: 'Family dynamics reveal so much. Only ask once rapport is established - too early feels intrusive.',
      de: 'Familiendynamik verrät viel. Erst fragen, wenn Vertrauen da ist - zu früh wirkt aufdringlich.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_14',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Emotional escalation', de: 'Emotionale Vertiefung' },
    text: {
      en: "When was the last time you did something for the first time?",
      de: 'Wann hast du zum letzten Mal etwas zum ersten Mal gemacht?',
    },
    explanation: {
      en: 'Makes them think and creates a sense of adventure. Great for sparking novelty-seeking energy.',
      de: 'Regt zum Nachdenken an und erzeugt Abenteuerlust. Toll für Neugier-Energie.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_15',
    categoryId: 'conversation_deepeners',
    situation: { en: 'FORD method - Recreation', de: 'FORD-Methode - Freizeit' },
    text: {
      en: "What's something you've been wanting to try but haven't gotten around to yet?",
      de: 'Was wolltest du schon immer mal ausprobieren, bist aber noch nicht dazu gekommen?',
    },
    explanation: {
      en: 'Shows their aspirational side. Great segue into making plans together.',
      de: 'Zeigt ihre ambitionierte Seite. Toller Übergang zum gemeinsamen Pläneschmieden.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cd_16',
    categoryId: 'conversation_deepeners',
    situation: { en: 'Childhood dreams', de: 'Kindheitsträume' },
    text: {
      en: "What did you want to be when you were 8? And how close is that to what you're doing now?",
      de: 'Was wolltest du mit 8 werden? Und wie nah ist das an dem, was du jetzt machst?',
    },
    explanation: {
      en: 'Nostalgic and revealing. The gap between childhood dreams and reality is always an interesting story.',
      de: 'Nostalgisch und aufschlussreich. Die Lücke zwischen Kindheitsträumen und Realität ist immer eine interessante Geschichte.',
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
  {
    id: 'wr_4',
    categoryId: 'witty_responses',
    situation: { en: 'When asked "Are you flirting with me?"', de: 'Wenn gefragt "Flirtest du mit mir?"' },
    text: {
      en: "Depends. Is it working?",
      de: 'Kommt drauf an. Funktioniert es?',
    },
    explanation: {
      en: 'Short, confident, and turns the question back on them. Creates tension.',
      de: 'Kurz, selbstbewusst und dreht die Frage um. Erzeugt Spannung.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium witty responses
  {
    id: 'wr_5',
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
    id: 'wr_6',
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
    id: 'wr_7',
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
    id: 'wr_8',
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
    id: 'wr_9',
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
    id: 'wr_10',
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
    id: 'wr_11',
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
  {
    id: 'wr_12',
    categoryId: 'witty_responses',
    situation: { en: 'Playful disagreement', de: 'Spielerische Meinungsverschiedenheit' },
    text: {
      en: "I completely disagree. But I respect your right to be wrong.",
      de: 'Da bin ich komplett anderer Meinung. Aber ich respektiere dein Recht, falsch zu liegen.',
    },
    explanation: {
      en: 'Creates playful tension. Disagreeing (with a smile) is more attractive than always agreeing.',
      de: 'Erzeugt spielerische Spannung. Widersprechen (mit Lächeln) ist attraktiver als immer zustimmen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_13',
    categoryId: 'witty_responses',
    situation: { en: 'When they say "Tell me about yourself"', de: 'Wenn sie sagen "Erzähl von dir"' },
    text: {
      en: "That's such a loaded question. Ask me something specific - I'm better under pressure.",
      de: 'Das ist so eine geladene Frage. Frag mich was Konkretes - unter Druck bin ich besser.',
    },
    explanation: {
      en: 'Deflects the generic question and creates a fun dynamic. Puts the ball in their court.',
      de: 'Lenkt die generische Frage um und schafft eine lustige Dynamik. Ball liegt bei ihnen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_14',
    categoryId: 'witty_responses',
    situation: { en: 'When they say "You\'re trouble"', de: 'Wenn sie sagen "Du bist gefährlich"' },
    text: {
      en: "The best kind, though. Right?",
      de: 'Aber die beste Art. Oder?',
    },
    explanation: {
      en: 'Short, confident, and turns their warning into a compliment. Less is more.',
      de: 'Kurz, selbstbewusst und verwandelt ihre Warnung in ein Kompliment. Weniger ist mehr.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'wr_15',
    categoryId: 'witty_responses',
    situation: { en: 'When they say "We should hang out"', de: 'Wenn sie sagen "Wir sollten mal was machen"' },
    text: {
      en: "Bold of you to assume I have free time. But for you, I'll check my very busy Netflix schedule.",
      de: 'Mutig von dir, anzunehmen, dass ich freie Zeit habe. Aber für dich checke ich meinen sehr vollen Netflix-Plan.',
    },
    explanation: {
      en: 'Playful push-pull: creates scarcity then immediately shows interest. Classic banter.',
      de: 'Spielerisches Push-Pull: erzeugt Knappheit und zeigt sofort Interesse. Klassisches Geplänkel.',
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
    situation: { en: 'Italian - effortless charm', de: 'Italienisch - müheloser Charme' },
    text: {
      en: 'Sprezzatura - the art of making everything you do look effortless, as if you weren\'t even trying.',
      de: 'Sprezzatura - die Kunst, alles mühelos aussehen zu lassen, als würdest du es nicht einmal versuchen.',
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
    situation: { en: 'French - electric chemistry', de: 'Französisch - elektrische Chemie' },
    text: {
      en: 'Frisson - that sudden shiver of excitement when chemistry hits. The electric moment before a first kiss.',
      de: 'Frisson - dieses plötzliche Schaudern der Aufregung, wenn die Chemie stimmt. Der elektrische Moment vor dem ersten Kuss.',
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
    situation: { en: 'English - magnetic storytelling', de: 'Englisch - magnetisches Erzählen' },
    text: {
      en: 'Raconteur - someone who tells stories with such flair that everyone leans in and forgets their phone exists.',
      de: 'Raconteur - jemand, der Geschichten so erzählt, dass alle sich vorbeugen und ihr Handy vergessen.',
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
    situation: { en: 'Portuguese - bittersweet longing', de: 'Portugiesisch - bittersüße Sehnsucht' },
    text: {
      en: 'Saudade - the deep, melancholic longing for someone or something absent. The beautiful ache of missing what once was.',
      de: 'Saudade - die tiefe, melancholische Sehnsucht nach jemandem oder etwas Abwesendem. Der schöne Schmerz des Vermissens.',
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
    situation: { en: 'Psychology - obsessive infatuation', de: 'Psychologie - obsessive Verliebtheit' },
    text: {
      en: 'Limerence - the involuntary state of obsessive romantic infatuation. Not love, not a crush - a neurochemical storm.',
      de: 'Limerence - der unwillkürliche Zustand obsessiver romantischer Verliebtheit. Keine Liebe, kein Schwarm - ein neurochemischer Sturm.',
    },
    explanation: {
      en: 'Knowing this word helps you recognize when you\'re in it - and talk about it intelligently.',
      de: 'Dieses Wort zu kennen hilft dir zu erkennen, wenn du drin steckst - und darüber zu reden.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_6',
    categoryId: 'smart_vocabulary',
    situation: { en: 'French - cool nonchalance', de: 'Französisch - coole Lässigkeit' },
    text: {
      en: 'Insouciance - a carefree, almost reckless nonchalance. The vibe of someone who genuinely doesn\'t need your approval.',
      de: 'Insouciance - eine sorglose, fast verwegene Gelassenheit. Die Ausstrahlung von jemandem, der deine Anerkennung nicht braucht.',
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
    situation: { en: 'Spanish - raw authentic presence', de: 'Spanisch - rohe authentische Präsenz' },
    text: {
      en: 'Duende - that raw, almost primal authenticity that moves people on a gut level. You can\'t fake it; you can only stop suppressing it.',
      de: 'Duende - diese rohe, fast ursprüngliche Authentizität, die Menschen auf einer tiefen Ebene berührt. Man kann es nicht vortäuschen; man kann nur aufhören, es zu unterdrücken.',
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
    situation: { en: 'French - social instinct', de: 'Französisch - sozialer Instinkt' },
    text: {
      en: 'Savoir-faire - the instinctive ability to say and do the right thing in any social situation, without thinking about it.',
      de: 'Savoir-faire - die instinktive Fähigkeit, in jeder sozialen Situation das Richtige zu sagen und zu tun, ohne darüber nachzudenken.',
    },
    explanation: {
      en: 'Beyond social skills - it\'s social elegance. The person who never has an awkward moment.',
      de: 'Mehr als Social Skills - es ist soziale Eleganz. Die Person, die nie einen peinlichen Moment hat.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sv_9',
    categoryId: 'smart_vocabulary',
    situation: { en: 'Greek - soulful passion', de: 'Griechisch - seelenvolle Leidenschaft' },
    text: {
      en: 'Meraki - doing something with absolute soul and passion, pouring yourself completely into the moment.',
      de: 'Meraki - etwas mit absoluter Seele und Leidenschaft tun, sich komplett in den Moment hineingeben.',
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
    situation: { en: 'English - devastating brevity', de: 'Englisch - vernichtende Kürze' },
    text: {
      en: 'Laconic - the art of saying more with less. A devastatingly brief response that lands harder than a paragraph ever could.',
      de: 'Lakonisch - die Kunst, mit weniger mehr zu sagen. Eine vernichtend kurze Antwort, die härter trifft als jeder Absatz.',
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
    situation: { en: 'Japanese - imperfect beauty', de: 'Japanisch - unvollkommene Schönheit' },
    text: {
      en: 'Wabi-sabi - finding beauty in imperfection. The crack in the cup, the scar with a story, the awkward laugh that\'s more charming than a perfect smile.',
      de: 'Wabi-Sabi - Schönheit in der Unvollkommenheit finden. Der Riss in der Tasse, die Narbe mit Geschichte, das unbeholfene Lachen, das charmanter ist als ein perfektes Lächeln.',
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
    situation: { en: 'French - the joy of living', de: 'Französisch - Lebensfreude' },
    text: {
      en: 'Joie de vivre - an infectious, exuberant love of life that makes everyone around you feel more alive.',
      de: 'Joie de vivre - eine ansteckende, überschwängliche Lebensfreude, die alle um dich herum lebendiger fühlen lässt.',
    },
    explanation: {
      en: 'The single most attractive quality. People don\'t fall for perfection - they fall for aliveness.',
      de: 'Die attraktivste Eigenschaft überhaupt. Menschen verlieben sich nicht in Perfektion - sondern in Lebendigkeit.',
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
      en: "I've really enjoyed this. We should continue it - can I get your number?",
      de: 'Das hat mir echt Spaß gemacht. Wir sollten das fortsetzen - kann ich deine Nummer haben?',
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
      en: "You mentioned you love [thing they said]. There's this great [related place] - want to check it out together this week?",
      de: 'Du hast erwähnt, dass du [was sie gesagt haben] liebst. Es gibt diesen tollen [verwandten Ort] - wollen wir uns das diese Woche zusammen anschauen?',
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
      en: 'Leaves on a high note. Shows intentionality - you chose to approach and you\'re glad you did.',
      de: 'Geht auf einem Höhepunkt. Zeigt Absicht - du hast dich entschieden anzusprechen und bist froh darüber.',
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
      en: "Here - put your number in. I'll text you something that'll make you smile.",
      de: 'Hier - gib deine Nummer ein. Ich schicke dir was, das dich zum Lächeln bringt.',
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
      en: "Tonight was genuinely fun. I'd love to do this again - and next time you pick the place.",
      de: 'Heute Abend war echt toll. Ich würde das gerne wiederholen - und nächstes Mal suchst du den Ort aus.',
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
      en: "Hey, I'm heading out - but it was really nice meeting you. Can I message you sometime?",
      de: 'Hey, ich gehe jetzt - aber es war echt nett, dich kennenzulernen. Darf ich dir mal schreiben?',
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
      en: "Look, I'll be direct - I think you're great and I'd regret not asking. Coffee this weekend?",
      de: 'Ich sag es direkt - ich finde dich toll und würde es bereuen, nicht zu fragen. Kaffee am Wochenende?',
    },
    explanation: {
      en: 'Directness is attractive. Framing it as "I\'d regret not asking" shows courage, not desperation.',
      de: 'Direktheit ist attraktiv. "Ich würde es bereuen" zeigt Mut, keine Verzweiflung.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // TEXTING & DMs
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'tx_1',
    categoryId: 'texting_dms',
    situation: { en: 'First message on dating app', de: 'Erste Nachricht auf Dating-App' },
    text: {
      en: "I see you're into [something from their profile]. I have so many questions. Starting with: [specific question].",
      de: 'Ich sehe, du stehst auf [etwas aus dem Profil]. Ich habe so viele Fragen. Angefangen mit: [konkrete Frage].',
    },
    explanation: {
      en: 'Shows you read their profile. A specific question gets 3x more replies than "Hey".',
      de: 'Zeigt, dass du das Profil gelesen hast. Eine konkrete Frage bekommt 3x mehr Antworten als "Hey".',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'tx_2',
    categoryId: 'texting_dms',
    situation: { en: 'Replying to a story', de: 'Auf eine Story antworten' },
    text: {
      en: "Okay I need the full story behind this. Where was this?",
      de: 'Okay, ich brauche die ganze Geschichte dahinter. Wo war das?',
    },
    explanation: {
      en: "Story replies feel more natural than cold DMs. Shows interest in their life, not just their looks.",
      de: 'Story-Antworten fühlen sich natürlicher an als kalte DMs. Zeigt Interesse am Leben, nicht nur am Aussehen.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'tx_3',
    categoryId: 'texting_dms',
    situation: { en: 'After getting their number', de: 'Nachdem du die Nummer bekommen hast' },
    text: {
      en: "Hey, it's [name] from [place]. This is the part where I'm supposed to wait three days to text you. I decided not to.",
      de: 'Hey, hier ist [Name] von [Ort]. Das ist der Teil, wo ich eigentlich drei Tage warten soll. Hab mich dagegen entschieden.',
    },
    explanation: {
      en: 'Breaks the "waiting game" with honesty. Shows confidence and genuine interest.',
      de: 'Bricht das Wartespiel mit Ehrlichkeit. Zeigt Selbstvertrauen und echtes Interesse.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium texting
  {
    id: 'tx_4',
    categoryId: 'texting_dms',
    situation: { en: 'Rescue a one-word reply', de: 'Einsilbige Antwort retten' },
    text: {
      en: "I can see you're a person of few words. Challenge accepted - I'll make you use a full sentence.",
      de: 'Ich sehe, du bist ein Mensch weniger Worte. Challenge accepted - ich bringe dich dazu, einen ganzen Satz zu schreiben.',
    },
    explanation: {
      en: 'Playfully calls out the dry reply without being needy. Turns it into a game.',
      de: 'Spricht die trockene Antwort spielerisch an, ohne bedürftig zu wirken. Macht ein Spiel daraus.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_5',
    categoryId: 'texting_dms',
    situation: { en: 'Suggest meeting up', de: 'Treffen vorschlagen' },
    text: {
      en: "This is fun over text, but I have a feeling you're even better in person. Coffee Thursday or Friday?",
      de: 'Das macht Spaß per Text, aber ich habe das Gefühl, du bist persönlich noch besser. Kaffee Donnerstag oder Freitag?',
    },
    explanation: {
      en: "Compliment + specific day options. Don't ask 'sometime' - give real options.",
      de: 'Kompliment + konkrete Tage. Nicht "irgendwann" fragen - echte Optionen geben.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_6',
    categoryId: 'texting_dms',
    situation: { en: 'Dating app opener - humor', de: 'Dating-App Opener - Humor' },
    text: {
      en: "Your profile made me stop scrolling. That's basically the modern equivalent of love at first sight.",
      de: 'Dein Profil hat mich zum Anhalten gebracht. Das ist quasi das moderne Äquivalent von Liebe auf den ersten Blick.',
    },
    explanation: {
      en: 'Light and self-aware. Acknowledges the dating app reality without being cynical.',
      de: 'Leicht und selbstbewusst. Erkennt die Dating-App-Realität an, ohne zynisch zu sein.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_7',
    categoryId: 'texting_dms',
    situation: { en: 'Flirty good morning text', de: 'Flirtige Guten-Morgen-Nachricht' },
    text: {
      en: "Good morning. I was going to send something clever but honestly I just wanted to talk to you.",
      de: 'Guten Morgen. Ich wollte was Cleveres schreiben, aber ehrlich gesagt wollte ich einfach mit dir reden.',
    },
    explanation: {
      en: 'Vulnerability beats cleverness. Being honest about wanting to talk is refreshing.',
      de: 'Verletzlichkeit schlägt Cleverness. Ehrlich zu sein, dass man reden will, ist erfrischend.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_8',
    categoryId: 'texting_dms',
    situation: { en: 'Revive a dead conversation', de: 'Totes Gespräch wiederbeleben' },
    text: {
      en: "I just saw [something related to your earlier conversation] and immediately thought of you. Still into [topic]?",
      de: 'Ich habe gerade [etwas zu eurem Gespräch] gesehen und musste sofort an dich denken. Stehst du immer noch auf [Thema]?',
    },
    explanation: {
      en: "Callbacks to past conversations show you remember. Much better than a random 'Hey, what's up?'",
      de: 'Rückbezüge auf vergangene Gespräche zeigen, dass du dich erinnerst. Viel besser als ein zufälliges "Hey".',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_9',
    categoryId: 'texting_dms',
    situation: { en: 'Response to photo they sent', de: 'Antwort auf gesendetes Foto' },
    text: {
      en: "Okay, I need more context. Where is this? And how do I get invited next time?",
      de: 'Okay, ich brauche mehr Kontext. Wo ist das? Und wie werde ich beim nächsten Mal eingeladen?',
    },
    explanation: {
      en: 'Shows interest and subtly suggests you want to be part of their life.',
      de: 'Zeigt Interesse und deutet subtil an, dass du Teil ihres Lebens sein willst.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_10',
    categoryId: 'texting_dms',
    situation: { en: 'Playful bet via text', de: 'Spielerische Wette per Text' },
    text: {
      en: "I bet I can guess your go-to coffee order in 3 tries. Loser buys the next round. Deal?",
      de: 'Ich wette, ich kann deine Kaffeebestellung in 3 Versuchen erraten. Verlierer zahlt die nächste Runde. Deal?',
    },
    explanation: {
      en: 'Creates a mini-game with built-in reason to meet. Fun, flirty, and forward.',
      de: 'Erzeugt ein Mini-Spiel mit eingebautem Grund zum Treffen. Spaßig, flirty und vorwärts.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_11',
    categoryId: 'texting_dms',
    situation: { en: 'Profile-based opener', de: 'Profilbasierter Opener' },
    text: {
      en: "Wait - is that [place/thing] in your third photo? I was just there! Small world or great taste?",
      de: 'Moment - ist das [Ort/Sache] auf deinem dritten Foto? Da war ich gerade erst! Kleine Welt oder guter Geschmack?',
    },
    explanation: {
      en: 'Specific references prove you looked at their profile. Shared experiences create instant connection.',
      de: 'Spezifische Referenzen beweisen, dass du das Profil angesehen hast. Gemeinsame Erfahrungen verbinden sofort.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_12',
    categoryId: 'texting_dms',
    situation: { en: 'After they take long to reply', de: 'Wenn sie lange zum Antworten brauchen' },
    text: {
      en: "No rush on replying. I'm patient. Mostly because I have zero other plans.",
      de: 'Kein Stress mit dem Antworten. Ich bin geduldig. Hauptsächlich weil ich null andere Pläne habe.',
    },
    explanation: {
      en: 'Acknowledges the slow reply without pressure. Self-deprecating humor keeps it light.',
      de: 'Erkennt die späte Antwort an, ohne Druck. Selbstironischer Humor hält es leicht.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_13',
    categoryId: 'texting_dms',
    situation: { en: 'Voice note opener', de: 'Sprachnachricht als Opener' },
    text: {
      en: "Send a short voice note instead of text. Say: 'Hey, I figured a voice note is more personal than typing. So here goes...'",
      de: "Schick eine kurze Sprachnachricht statt Text. Sag: 'Hey, ich dachte eine Sprachnachricht ist persönlicher als Tippen. Also los...'",
    },
    explanation: {
      en: 'Voice notes stand out. They hear your tone, your laugh, your energy. Very few people do this.',
      de: 'Sprachnachrichten fallen auf. Sie hören deinen Ton, dein Lachen, deine Energie. Sehr wenige machen das.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_14',
    categoryId: 'texting_dms',
    situation: { en: 'Asking about their day (not boring)', de: 'Nach ihrem Tag fragen (nicht langweilig)' },
    text: {
      en: "Rate your day 1-10. I'll tell you mine. Then we figure out how to make tomorrow a 10.",
      de: 'Bewerte deinen Tag von 1-10. Ich sag dir meinen. Dann überlegen wir, wie morgen eine 10 wird.',
    },
    explanation: {
      en: 'Turns the generic "how was your day?" into a mini-game with built-in next-step planning.',
      de: 'Verwandelt das generische "wie war dein Tag?" in ein Mini-Spiel mit eingebautem nächsten Schritt.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'tx_15',
    categoryId: 'texting_dms',
    situation: { en: 'Sending a meme or photo', de: 'Ein Meme oder Foto schicken' },
    text: {
      en: "[Send relevant meme/photo] This reminded me of our conversation about [topic]. Tell me I'm wrong.",
      de: '[Relevantes Meme/Foto senden] Das hat mich an unser Gespräch über [Thema] erinnert. Sag mir, dass ich falsch liege.',
    },
    explanation: {
      en: '"This reminded me of you" is one of the most powerful texting moves. It shows you think about them.',
      de: '"Das hat mich an dich erinnert" ist einer der stärksten Texting-Moves. Es zeigt, dass du an sie denkst.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONFIDENCE BOOSTERS
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'cb_1',
    categoryId: 'confidence_boosters',
    situation: { en: 'Before approaching someone', de: 'Bevor du jemanden ansprichst' },
    text: {
      en: "Remind yourself: the worst that happens is a polite 'no'. That's it. Your life stays exactly the same.",
      de: "Erinnere dich: das Schlimmste ist ein höfliches 'Nein'. Das war's. Dein Leben bleibt genau gleich.",
    },
    explanation: {
      en: 'Reframing rejection shrinks it. The fear is always bigger than the reality.',
      de: 'Ablehnung umzudeuten macht sie kleiner. Die Angst ist immer größer als die Realität.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'cb_2',
    categoryId: 'confidence_boosters',
    situation: { en: 'After a rejection', de: 'Nach einer Ablehnung' },
    text: {
      en: "They didn't reject you - they rejected a 30-second interaction. They don't know you. That's their loss, not your failure.",
      de: 'Sie haben nicht dich abgelehnt - sie haben eine 30-Sekunden-Interaktion abgelehnt. Sie kennen dich nicht. Ihr Verlust, nicht dein Versagen.',
    },
    explanation: {
      en: "Rejection feels personal but it's almost never about you. They could be taken, tired, or shy.",
      de: 'Ablehnung fühlt sich persönlich an, aber es geht fast nie um dich. Sie könnten vergeben, müde oder schüchtern sein.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'cb_3',
    categoryId: 'confidence_boosters',
    situation: { en: 'Feeling not good enough', de: 'Sich nicht gut genug fühlen' },
    text: {
      en: "You don't need to be perfect to be attractive. You need to be present, genuine, and interested in the other person.",
      de: 'Du musst nicht perfekt sein, um attraktiv zu sein. Du musst präsent, echt und an der anderen Person interessiert sein.',
    },
    explanation: {
      en: 'Attractiveness is 80% how you make someone feel, not how you look.',
      de: 'Attraktivität besteht zu 80% daraus, wie du jemanden fühlen lässt, nicht wie du aussiehst.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium confidence
  {
    id: 'cb_4',
    categoryId: 'confidence_boosters',
    situation: { en: 'Overcoming approach anxiety', de: 'Ansprechangst überwinden' },
    text: {
      en: "Count to 3, then go. Don't give your brain time to build the wall. 3... 2... 1... move.",
      de: 'Zähle bis 3, dann geh. Gib deinem Gehirn keine Zeit, die Mauer aufzubauen. 3... 2... 1... los.',
    },
    explanation: {
      en: "The 3-second rule. Hesitation is your brain's protection mode - override it with action.",
      de: 'Die 3-Sekunden-Regel. Zögern ist der Schutzmodus deines Gehirns - überschreibe ihn mit Handlung.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_5',
    categoryId: 'confidence_boosters',
    situation: { en: 'Comparing yourself to others', de: 'Sich mit anderen vergleichen' },
    text: {
      en: "The person who seems effortlessly confident? They were nervous too. They just decided to act anyway.",
      de: 'Die Person, die mühelos selbstbewusst wirkt? Die war auch nervös. Sie hat sich nur entschieden, trotzdem zu handeln.',
    },
    explanation: {
      en: 'Confidence isn\'t absence of fear. It\'s feeling the fear and doing it anyway.',
      de: 'Selbstvertrauen ist nicht die Abwesenheit von Angst. Es ist die Angst zu fühlen und trotzdem zu handeln.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_6',
    categoryId: 'confidence_boosters',
    situation: { en: 'When a conversation goes badly', de: 'Wenn ein Gespräch schlecht läuft' },
    text: {
      en: "Bad conversations are reps. Every awkward moment is training for the next great one. You just leveled up.",
      de: 'Schlechte Gespräche sind Wiederholungen. Jeder peinliche Moment ist Training für den nächsten großartigen. Du bist gerade aufgestiegen.',
    },
    explanation: {
      en: 'Reframing failure as practice removes the sting and builds resilience.',
      de: 'Misserfolg als Übung umzudeuten nimmt den Stachel und baut Widerstandskraft auf.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_7',
    categoryId: 'confidence_boosters',
    situation: { en: 'Body language power pose', de: 'Körpersprache-Power-Pose' },
    text: {
      en: "Before walking in: shoulders back, chin slightly up, take one deep breath. Your body tells your brain how to feel.",
      de: 'Bevor du reingehst: Schultern zurück, Kinn leicht hoch, einen tiefen Atemzug. Dein Körper sagt deinem Gehirn, wie es sich fühlen soll.',
    },
    explanation: {
      en: 'Amy Cuddy\'s research: 2 minutes of power posing changes your cortisol and testosterone levels.',
      de: 'Amy Cuddys Forschung: 2 Minuten Power-Posing verändert deine Cortisol- und Testosteronwerte.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_8',
    categoryId: 'confidence_boosters',
    situation: { en: 'Handling ghosting', de: 'Ghosting verarbeiten' },
    text: {
      en: "Someone who ghosts you just saved you time. You want someone who's excited about you, not someone you have to convince.",
      de: 'Jemand der dich ghostet hat dir gerade Zeit gespart. Du willst jemanden, der begeistert von dir ist, nicht jemanden, den du überzeugen musst.',
    },
    explanation: {
      en: 'Ghosting says nothing about your worth. It says everything about their communication skills.',
      de: 'Ghosting sagt nichts über deinen Wert. Es sagt alles über ihre Kommunikationsfähigkeiten.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_9',
    categoryId: 'confidence_boosters',
    situation: { en: 'Self-affirmation before a date', de: 'Selbstbestärkung vor einem Date' },
    text: {
      en: "You're not auditioning. You're showing up as yourself to see if there's a connection. That's all.",
      de: 'Du bist nicht beim Vorsprechen. Du zeigst dich als du selbst, um zu sehen, ob es eine Verbindung gibt. Das ist alles.',
    },
    explanation: {
      en: 'Reframing a date as mutual exploration removes performance pressure.',
      de: 'Ein Date als gegenseitiges Erkunden umzudeuten nimmt den Leistungsdruck.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_10',
    categoryId: 'confidence_boosters',
    situation: { en: 'When you feel like giving up', de: 'Wenn du aufgeben willst' },
    text: {
      en: "Every person in a happy relationship was once single and wondering if it would ever happen. Keep going.",
      de: 'Jede Person in einer glücklichen Beziehung war einmal Single und hat sich gefragt, ob es jemals passiert. Mach weiter.',
    },
    explanation: {
      en: 'Perspective is everything. The timeline is different for everyone, but it happens.',
      de: 'Perspektive ist alles. Der Zeitplan ist für jeden anders, aber es passiert.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_11',
    categoryId: 'confidence_boosters',
    situation: { en: 'Dealing with nervousness', de: 'Nervosität bewältigen' },
    text: {
      en: "Nervousness and excitement are the same chemical in your brain. Tell yourself: I'm excited, not scared.",
      de: 'Nervosität und Aufregung sind die gleiche Chemikalie in deinem Gehirn. Sag dir: Ich bin aufgeregt, nicht ängstlich.',
    },
    explanation: {
      en: 'Anxiety reappraisal: relabeling your nerves as excitement actually improves performance.',
      de: 'Angst-Umdeutung: deine Nervosität als Aufregung umzubenennen verbessert tatsächlich die Leistung.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_12',
    categoryId: 'confidence_boosters',
    situation: { en: 'Imposter syndrome', de: 'Hochstapler-Syndrom' },
    text: {
      en: "Nobody has it figured out. Everyone is improvising. The people who seem confident just got comfortable being uncomfortable.",
      de: 'Niemand hat es raus. Alle improvisieren. Die Leute, die selbstbewusst wirken, haben sich nur daran gewöhnt, sich unwohl zu fühlen.',
    },
    explanation: {
      en: 'Normalizes the struggle. Confidence is a practice, not a destination.',
      de: 'Normalisiert den Kampf. Selbstvertrauen ist eine Übung, kein Ziel.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_13',
    categoryId: 'confidence_boosters',
    situation: { en: 'Social battery low', de: 'Soziale Batterie leer' },
    text: {
      en: "It's okay to not be 'on' all the time. Quality connections matter more than quantity. One genuine conversation beats ten shallow ones.",
      de: "Es ist okay, nicht immer 'an' zu sein. Qualitätsverbindungen zählen mehr als Quantität. Ein echtes Gespräch schlägt zehn oberflächliche.",
    },
    explanation: {
      en: 'Permission to be introverted. Not everyone needs to be the life of the party to attract people.',
      de: 'Erlaubnis, introvertiert zu sein. Nicht jeder muss der Partylöwe sein, um Menschen anzuziehen.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // DATE CONVERSATION
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'dc_1',
    categoryId: 'date_conversation',
    situation: { en: 'First date opener', de: 'Erster-Date-Opener' },
    text: {
      en: "So before we do the whole 'What do you do?' thing - what's the most interesting thing that happened to you this week?",
      de: "Bevor wir das ganze 'Was machst du beruflich?'-Ding machen - was war das Interessanteste, das dir diese Woche passiert ist?",
    },
    explanation: {
      en: 'Immediately sets a different tone from the usual boring interview-style date.',
      de: 'Setzt sofort einen anderen Ton als das übliche langweilige Interview-Date.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'dc_2',
    categoryId: 'date_conversation',
    situation: { en: 'Transition to deeper topics', de: 'Übergang zu tieferen Themen' },
    text: {
      en: "Okay, surface level stuff out of the way. Tell me something about you that would surprise me.",
      de: 'Okay, Oberflächliches ist abgehakt. Erzähl mir was über dich, das mich überraschen würde.',
    },
    explanation: {
      en: 'Explicitly signals you want depth. Most people are relieved when someone breaks the small talk.',
      de: 'Signalisiert explizit, dass du Tiefe willst. Die meisten sind erleichtert, wenn jemand den Smalltalk bricht.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'dc_3',
    categoryId: 'date_conversation',
    situation: { en: 'Storytelling prompt', de: 'Erzählaufforderung' },
    text: {
      en: "What's your best 'you won't believe this happened' story?",
      de: "Was ist deine beste 'Das glaubst du nicht'-Geschichte?",
    },
    explanation: {
      en: 'Everyone has one. This question makes them animated and gives you both something to laugh about.',
      de: 'Jeder hat eine. Diese Frage macht sie lebendig und gibt euch beiden etwas zum Lachen.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium date conversation
  {
    id: 'dc_4',
    categoryId: 'date_conversation',
    situation: { en: 'Beyond "What do you do?"', de: 'Jenseits von "Was machst du?"' },
    text: {
      en: "What do you do for fun that you could nerd out about for 20 minutes?",
      de: 'Worüber könntest du 20 Minuten lang begeistert reden?',
    },
    explanation: {
      en: "Gives them permission to be passionate. Watching someone light up about their interest is attractive.",
      de: 'Gibt ihnen Erlaubnis, leidenschaftlich zu sein. Jemanden über sein Interesse strahlen zu sehen ist attraktiv.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_5',
    categoryId: 'date_conversation',
    situation: { en: 'Creating shared humor', de: 'Gemeinsamen Humor schaffen' },
    text: {
      en: "If our first date was a movie, what genre would it be so far?",
      de: 'Wenn unser erstes Date ein Film wäre, welches Genre wäre es bisher?',
    },
    explanation: {
      en: 'Meta-humor about the date itself creates an inside joke between you. Instantly bonds.',
      de: 'Meta-Humor über das Date selbst schafft einen Insider-Witz zwischen euch. Verbindet sofort.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_6',
    categoryId: 'date_conversation',
    situation: { en: 'Travel stories', de: 'Reisegeschichten' },
    text: {
      en: "What's a place that completely changed how you see things?",
      de: 'Welcher Ort hat komplett verändert, wie du Dinge siehst?',
    },
    explanation: {
      en: 'Goes deeper than "Where have you traveled?" - gets at their transformative experiences.',
      de: 'Geht tiefer als "Wo bist du gereist?" - kommt an ihre transformativen Erfahrungen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_7',
    categoryId: 'date_conversation',
    situation: { en: 'Food as conversation', de: 'Essen als Gesprächsthema' },
    text: {
      en: "What's your comfort food? The one you go to when the world is falling apart.",
      de: 'Was ist dein Comfort Food? Das eine Gericht, wenn die Welt untergeht.',
    },
    explanation: {
      en: 'Food is emotional and personal. This question feels warm and opens nostalgic stories.',
      de: 'Essen ist emotional und persönlich. Diese Frage fühlt sich warm an und öffnet nostalgische Geschichten.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_8',
    categoryId: 'date_conversation',
    situation: { en: 'Childhood memories', de: 'Kindheitserinnerungen' },
    text: {
      en: "What's something you loved as a kid that you secretly still enjoy?",
      de: 'Was hast du als Kind geliebt, das du heimlich immer noch genießt?',
    },
    explanation: {
      en: 'Invites playfulness and nostalgia. People feel safe sharing childhood joys.',
      de: 'Lädt zu Verspieltheit und Nostalgie ein. Menschen fühlen sich sicher, Kinderfreuden zu teilen.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_9',
    categoryId: 'date_conversation',
    situation: { en: 'End-of-date signal (positive)', de: 'Ende-des-Dates-Signal (positiv)' },
    text: {
      en: "I don't want this to end, but I also want us to have something to look forward to next time.",
      de: 'Ich will nicht, dass das aufhört, aber ich will auch, dass wir beim nächsten Mal etwas haben, worauf wir uns freuen.',
    },
    explanation: {
      en: 'Expresses interest while creating anticipation. Leaving them wanting more is powerful.',
      de: 'Drückt Interesse aus und schafft gleichzeitig Vorfreude. Sie mehr wollen zu lassen ist wirkungsvoll.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_10',
    categoryId: 'date_conversation',
    situation: { en: 'Values check (gentle)', de: 'Werte-Check (sanft)' },
    text: {
      en: "What does a perfect weekend look like for you?",
      de: 'Wie sieht ein perfektes Wochenende für dich aus?',
    },
    explanation: {
      en: 'Reveals lifestyle compatibility without heavy questions. Are they a homebody or adventurer?',
      de: 'Zeigt Lifestyle-Kompatibilität ohne schwere Fragen. Stubenhocker oder Abenteurer?',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_11',
    categoryId: 'date_conversation',
    situation: { en: 'Hypothetical game', de: 'Hypothetisches Spiel' },
    text: {
      en: "Quick round: would you rather have the ability to fly or be invisible? And why says a lot about you.",
      de: 'Schnelle Runde: lieber fliegen können oder unsichtbar sein? Und das Warum sagt viel über dich.',
    },
    explanation: {
      en: 'Light hypotheticals break tension. Adding "why says a lot" makes them think deeper.',
      de: 'Leichte Hypothesen lösen Spannung. "Sagt viel über dich" bringt sie zum tieferen Nachdenken.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_12',
    categoryId: 'date_conversation',
    situation: { en: 'Music as bonding', de: 'Musik als Verbindung' },
    text: {
      en: "What song is your guilty pleasure? The one you play when nobody's watching.",
      de: 'Was ist dein Guilty-Pleasure-Song? Der eine, den du hörst, wenn keiner zuschaut.',
    },
    explanation: {
      en: 'Music preferences create instant bonding or hilarious debates. Both are wins.',
      de: 'Musikgeschmack schafft sofortige Verbindung oder witzige Debatten. Beides ist ein Gewinn.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_13',
    categoryId: 'date_conversation',
    situation: { en: 'Bucket list sharing', de: 'Bucket-List teilen' },
    text: {
      en: "Top 3 things on your bucket list. Go. No overthinking.",
      de: 'Top 3 Dinge auf deiner Bucket-List. Los. Nicht lang nachdenken.',
    },
    explanation: {
      en: 'Fast-paced format creates energy. Their instant answers reveal real desires, not curated ones.',
      de: 'Schnelles Format erzeugt Energie. Ihre spontanen Antworten zeigen echte Wünsche, nicht kuratierte.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_14',
    categoryId: 'date_conversation',
    situation: { en: 'Pet peeves (bonding through humor)', de: 'Nervige Sachen (Verbindung durch Humor)' },
    text: {
      en: "What's something small that irrationally annoys you? Mine is [funny example].",
      de: 'Was nervt dich irrational? Bei mir ist es [lustiges Beispiel].',
    },
    explanation: {
      en: 'Sharing pet peeves is weirdly bonding. Going first makes them comfortable sharing.',
      de: 'Pet Peeves zu teilen verbindet seltsamerweise. Zuerst zu teilen macht es ihnen leichter.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'dc_15',
    categoryId: 'date_conversation',
    situation: { en: 'Two truths and a lie', de: 'Zwei Wahrheiten und eine Lüge' },
    text: {
      en: "Let's play two truths and a lie. I'll go first. [Share 3 things]. Guess which one is fake.",
      de: 'Lass uns Zwei Wahrheiten und eine Lüge spielen. Ich fange an. [3 Dinge teilen]. Rate, welche gelogen ist.',
    },
    explanation: {
      en: 'Turns conversation into a game. You learn fun facts about each other and create laughter.',
      de: 'Verwandelt das Gespräch in ein Spiel. Man lernt lustige Fakten und schafft Gelächter.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // BODY LANGUAGE + WORDS
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'bl_1',
    categoryId: 'body_language',
    situation: { en: 'Eye contact basics', de: 'Blickkontakt-Grundlagen' },
    text: {
      en: "Hold eye contact for 3-5 seconds, then break it by looking to the side (not down). Looking down signals submission.",
      de: 'Halte Blickkontakt für 3-5 Sekunden, dann brich ihn zur Seite (nicht nach unten). Nach unten schauen signalisiert Unterwerfung.',
    },
    explanation: {
      en: 'The triangle technique: alternate between left eye, right eye, and mouth when talking closely.',
      de: 'Die Dreieckstechnik: Wechsle zwischen linkem Auge, rechtem Auge und Mund beim nahen Gespräch.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'bl_2',
    categoryId: 'body_language',
    situation: { en: 'Open body language', de: 'Offene Körpersprache' },
    text: {
      en: "Uncross your arms, face them directly, and lean in slightly when they talk. Your body should say: I'm interested.",
      de: 'Öffne die Arme, wende dich ihnen direkt zu und lehne dich leicht vor, wenn sie reden. Dein Körper sollte sagen: Ich bin interessiert.',
    },
    explanation: {
      en: 'People read body language before words. Open posture = approachable and confident.',
      de: 'Menschen lesen Körpersprache vor Worten. Offene Haltung = zugänglich und selbstbewusst.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'bl_3',
    categoryId: 'body_language',
    situation: { en: 'Mirroring', de: 'Spiegeln' },
    text: {
      en: "Subtly mirror their posture and gestures. If they lean in, you lean in. If they gesture with hands, you do too.",
      de: 'Spiegele subtil ihre Haltung und Gesten. Wenn sie sich vorlehnen, lehne dich vor. Wenn sie mit Händen gestikulieren, tue es auch.',
    },
    explanation: {
      en: 'Mirroring triggers unconscious rapport. It makes people feel understood without knowing why.',
      de: 'Spiegeln löst unbewusste Verbindung aus. Es gibt Menschen das Gefühl, verstanden zu werden.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium body language
  {
    id: 'bl_4',
    categoryId: 'body_language',
    situation: { en: 'Touch escalation', de: 'Berührungs-Eskalation' },
    text: {
      en: "Start with safe touches: light tap on shoulder while laughing, brief touch on arm to emphasize a point. Read their reaction.",
      de: 'Beginne mit sicheren Berührungen: leichtes Tippen auf die Schulter beim Lachen, kurze Armberührung um einen Punkt zu betonen. Lies ihre Reaktion.',
    },
    explanation: {
      en: 'Physical touch builds connection fast. If they lean into it, good. If they stiffen, pull back.',
      de: 'Physische Berührung baut schnell Verbindung auf. Wenn sie sich anlehnen, gut. Wenn sie steif werden, zurück.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_5',
    categoryId: 'body_language',
    situation: { en: 'Voice tonality', de: 'Stimmtonalität' },
    text: {
      en: "Slow down your speech. Pause before key words. Lower your pitch slightly at the end of statements. Confidence sounds unhurried.",
      de: 'Verlangsame dein Sprechtempo. Pausiere vor Schlüsselwörtern. Senke die Stimme leicht am Ende von Aussagen. Selbstvertrauen klingt ungehetzt.',
    },
    explanation: {
      en: 'Fast talking = nervous. Slow, deliberate speech with pauses = powerful and magnetic.',
      de: 'Schnelles Reden = nervös. Langsames, bewusstes Sprechen mit Pausen = kraftvoll und magnetisch.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_6',
    categoryId: 'body_language',
    situation: { en: 'Smile with eyes', de: 'Mit den Augen lächeln' },
    text: {
      en: "A genuine smile reaches your eyes (crow's feet). Practice: think of something that actually makes you happy, then smile.",
      de: "Ein echtes Lächeln erreicht die Augen (Krähenfüße). Übe: denk an etwas, das dich wirklich glücklich macht, dann lächle.",
    },
    explanation: {
      en: 'Duchenne smile (eyes + mouth) is perceived as 10x more attractive than a polite mouth-only smile.',
      de: 'Duchenne-Lächeln (Augen + Mund) wird als 10x attraktiver wahrgenommen als ein höfliches Nur-Mund-Lächeln.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_7',
    categoryId: 'body_language',
    situation: { en: 'Reading interest signals', de: 'Interesse-Signale lesen' },
    text: {
      en: "Positive signs: they face you fully, play with hair, find excuses to touch you, lean in, maintain eye contact, laugh easily.",
      de: 'Positive Zeichen: volle Zuwendung, mit Haaren spielen, Ausreden zum Berühren finden, sich vorlehnen, Blickkontakt halten, leicht lachen.',
    },
    explanation: {
      en: 'Look for clusters (3+ signals together), not single cues. One signal means nothing; three means something.',
      de: 'Achte auf Cluster (3+ Signale zusammen), nicht einzelne. Ein Signal bedeutet nichts; drei bedeuten etwas.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_8',
    categoryId: 'body_language',
    situation: { en: 'Walking with confidence', de: 'Selbstbewusst gehen' },
    text: {
      en: "Walk like you have somewhere to be. Head up, shoulders relaxed, moderate pace. Confident people don't rush or shuffle.",
      de: 'Geh, als hättest du ein Ziel. Kopf hoch, Schultern entspannt, gemäßigtes Tempo. Selbstbewusste Menschen hasten oder schlurfen nicht.',
    },
    explanation: {
      en: 'How you enter a room sets the first impression before you say a word.',
      de: 'Wie du einen Raum betrittst, setzt den ersten Eindruck, bevor du ein Wort sagst.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_9',
    categoryId: 'body_language',
    situation: { en: 'The head tilt', de: 'Die Kopfneigung' },
    text: {
      en: "Tilt your head slightly while listening. It's a universal sign of interest and engagement that makes people feel heard.",
      de: 'Neige deinen Kopf leicht beim Zuhören. Ein universelles Zeichen von Interesse, das Menschen das Gefühl gibt, gehört zu werden.',
    },
    explanation: {
      en: 'Dogs do it instinctively. In humans, it exposes the neck (vulnerability signal) which builds trust.',
      de: 'Hunde machen es instinktiv. Bei Menschen entblößt es den Hals (Verletzlichkeitssignal), was Vertrauen aufbaut.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_10',
    categoryId: 'body_language',
    situation: { en: 'Space and proximity', de: 'Raum und Nähe' },
    text: {
      en: "Gradually decrease distance during conversation. Start at arm's length, move closer as rapport builds. Let them set the final distance.",
      de: 'Verringere den Abstand allmählich während des Gesprächs. Beginne auf Armlänge, komm näher wenn Vertrauen wächst. Lass sie den finalen Abstand bestimmen.',
    },
    explanation: {
      en: 'Proxemics: intimate zone is under 50cm. Getting there naturally (not abruptly) signals mutual comfort.',
      de: 'Proxemik: Intimzone ist unter 50cm. Natürlich (nicht abrupt) dorthin zu kommen signalisiert gegenseitiges Wohlbefinden.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_11',
    categoryId: 'body_language',
    situation: { en: 'Hand gestures while talking', de: 'Handgesten beim Sprechen' },
    text: {
      en: "Use open palm gestures when speaking. Visible palms signal honesty and openness. Hidden or clenched hands feel guarded.",
      de: 'Benutze offene Handflächengesten beim Sprechen. Sichtbare Handflächen signalisieren Ehrlichkeit. Versteckte oder geballte Hände wirken verschlossen.',
    },
    explanation: {
      en: 'TED talk speakers who gesture score higher on trust and likability. Your hands are storytelling tools.',
      de: 'TED-Talk-Sprecher, die gestikulieren, punkten höher bei Vertrauen und Sympathie. Deine Hände sind Erzählwerkzeuge.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_12',
    categoryId: 'body_language',
    situation: { en: 'Reading disinterest signals', de: 'Desinteresse-Signale lesen' },
    text: {
      en: "Red flags: crossed arms, angled body away, short answers, checking phone, no eye contact. These mean: gracefully exit.",
      de: 'Warnzeichen: verschränkte Arme, abgewandter Körper, kurze Antworten, aufs Handy schauen, kein Blickkontakt. Das bedeutet: elegant zurückziehen.',
    },
    explanation: {
      en: "Reading disinterest is as important as reading interest. Respecting 'no' signals is attractive in itself.",
      de: "Desinteresse zu lesen ist genauso wichtig wie Interesse. 'Nein'-Signale zu respektieren ist an sich attraktiv.",
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'bl_13',
    categoryId: 'body_language',
    situation: { en: 'Playful touch with words', de: 'Spielerische Berührung mit Worten' },
    text: {
      en: "Say 'Come here, I want to show you something' while lightly guiding them by the elbow. Physical leading + curiosity = irresistible.",
      de: "Sag 'Komm, ich will dir was zeigen' während du sie leicht am Ellbogen führst. Physisches Führen + Neugier = unwiderstehlich.",
    },
    explanation: {
      en: 'Combining a verbal cue with gentle physical guidance creates a cinematic moment.',
      de: 'Einen verbalen Hinweis mit sanfter physischer Führung zu kombinieren erzeugt einen filmreifen Moment.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cl_11',
    categoryId: 'closing_lines',
    situation: { en: 'Instagram exchange', de: 'Instagram-Tausch' },
    text: {
      en: "I'm more of an Instagram person. What's yours? I'll slide into your DMs with something creative.",
      de: 'Ich bin eher der Instagram-Typ. Was ist deins? Ich slide in deine DMs mit was Kreativem.',
    },
    explanation: {
      en: 'Lower barrier than phone numbers. Social media feels less committal for both parties.',
      de: 'Niedrigere Hürde als Telefonnummern. Social Media fühlt sich für beide Seiten weniger verbindlich an.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cl_12',
    categoryId: 'closing_lines',
    situation: { en: 'The soft close', de: 'Der sanfte Abschluss' },
    text: {
      en: "I don't want to keep you, but I'd genuinely love to continue this. No pressure - here's my number if you want to.",
      de: 'Ich will dich nicht aufhalten, aber ich würde das wirklich gerne fortsetzen. Kein Druck - hier ist meine Nummer, falls du willst.',
    },
    explanation: {
      en: 'Giving your number instead of asking for theirs removes all pressure. Power move that shows confidence.',
      de: 'Deine Nummer zu geben statt zu fragen entfernt allen Druck. Power Move der Selbstvertrauen zeigt.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'cb_14',
    categoryId: 'confidence_boosters',
    situation: { en: 'Morning mindset', de: 'Morgen-Mindset' },
    text: {
      en: "Today's mantra: I don't chase. I attract. What's meant for me will recognize me.",
      de: 'Heutiges Mantra: Ich jage nicht. Ich ziehe an. Was für mich bestimmt ist, wird mich erkennen.',
    },
    explanation: {
      en: 'Abundance mindset over scarcity mindset. Chasing pushes people away; being magnetic draws them in.',
      de: 'Überfluss-Mindset statt Mangel-Mindset. Jagen stößt ab; magnetisch sein zieht an.',
    },
    isPremium: true,
    forGender: 'all',
  },

  // ═══════════════════════════════════════════════════════════════════
  // STORY REPLIES — Witty, playful replies to Instagram/Snapchat stories
  // ═══════════════════════════════════════════════════════════════════

  // Free
  {
    id: 'sr_1',
    categoryId: 'story_replies',
    situation: { en: 'They post a surfing/beach story', de: 'Surf-/Strand-Story' },
    text: {
      en: "Serious question — are you one of those people who's 50% above water or 50% below water the whole time?",
      de: 'Ernste Frage — bist du einer von denen die 50% über Wasser oder 50% unter Wasser sind die ganze Zeit?',
    },
    explanation: {
      en: "Absurd humor that makes them laugh. It's unexpected and way more memorable than 'cool waves!'.",
      de: 'Absurder Humor der zum Lachen bringt. Unerwartet und viel einprägsamer als ein „coole Wellen!".',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'sr_2',
    categoryId: 'story_replies',
    situation: { en: 'They post a travel/airplane story', de: 'Reise-/Flugzeug-Story' },
    text: {
      en: "Is that runway long enough or could I land a plane on your ego too?",
      de: 'Ist die Landebahn lang genug oder könnte ich auch auf deinem Ego landen?',
    },
    explanation: {
      en: "A playful roast that shows you're not intimidated. Works best when they already seem confident.",
      de: 'Ein spielerischer Roast der zeigt, dass du nicht eingeschüchtert bist. Funktioniert am besten bei selbstbewussten Leuten.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'sr_3',
    categoryId: 'story_replies',
    situation: { en: 'They post a food/cooking story', de: 'Essen-/Koch-Story' },
    text: {
      en: "Ok but did you actually make that or is this your one dish you photograph every time?",
      de: 'Ok aber hast du das wirklich gemacht oder ist das dein einziges Gericht das du jedes Mal fotografierst?',
    },
    explanation: {
      en: "Teasing them shows confidence. If they did cook it, they'll defend it proudly — instant conversation.",
      de: 'Sie aufzuziehen zeigt Selbstvertrauen. Wenn sie es gekocht haben, verteidigen sie es stolz — sofortiges Gespräch.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'sr_4',
    categoryId: 'story_replies',
    situation: { en: 'They post a gym/workout story', de: 'Gym-/Workout-Story' },
    text: {
      en: "Do you also film yourself going to the fridge at 2am or just the gym parts?",
      de: 'Filmst du dich auch beim Gang zum Kühlschrank um 2 Uhr nachts oder nur die Gym-Teile?',
    },
    explanation: {
      en: "Self-aware humor about gym culture. Everyone secretly relates to this — it's funny because it's true.",
      de: 'Selbstironischer Humor über Gym-Kultur. Jeder kann sich heimlich damit identifizieren — es ist lustig weil es wahr ist.',
    },
    isPremium: false,
    forGender: 'all',
  },
  {
    id: 'sr_5',
    categoryId: 'story_replies',
    situation: { en: 'They post a sunset/view story', de: 'Sonnenuntergang-/Aussicht-Story' },
    text: {
      en: "Nice view. But I have a very important question: left or right Twix?",
      de: 'Schöne Aussicht. Aber ich hab eine sehr wichtige Frage: links oder rechts Twix?',
    },
    explanation: {
      en: "A complete topic switch that catches them off guard. The randomness is the charm — they'll reply out of curiosity.",
      de: 'Ein kompletter Themawechsel der überrascht. Die Zufälligkeit ist der Charme — sie antworten aus Neugier.',
    },
    isPremium: false,
    forGender: 'all',
  },

  // Premium
  {
    id: 'sr_6',
    categoryId: 'story_replies',
    situation: { en: 'They post a coffee/brunch story', de: 'Kaffee-/Brunch-Story' },
    text: {
      en: "That oat milk latte probably costs more than my rent. Worth it though?",
      de: 'Der Hafermilch Latte kostet wahrscheinlich mehr als meine Miete. Lohnt es sich?',
    },
    explanation: {
      en: 'Relatable millennial/Gen Z humor about overpriced coffee. Lighthearted and opens the door to a real chat.',
      de: 'Relatable Millennial/Gen Z Humor über überteuerten Kaffee. Locker und öffnet die Tür zu einem echten Gespräch.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_7',
    categoryId: 'story_replies',
    situation: { en: 'They post a pet/dog story', de: 'Haustier-/Hunde-Story' },
    text: {
      en: "I was going to say something smooth but honestly your dog just stole my whole attention. What's their name?",
      de: 'Ich wollte was Smoothes sagen aber ehrlich gesagt hat dein Hund meine ganze Aufmerksamkeit gestohlen. Wie heißt er?',
    },
    explanation: {
      en: "Self-aware, disarming, and you're asking about something they clearly love. Triple win.",
      de: 'Selbstbewusst, entwaffnend, und du fragst nach etwas das sie offensichtlich lieben. Dreifacher Gewinn.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_8',
    categoryId: 'story_replies',
    situation: { en: 'They post a concert/festival story', de: 'Konzert-/Festival-Story' },
    text: {
      en: "Your music taste is either a green flag or a dealbreaker and I need to know which one right now.",
      de: 'Dein Musikgeschmack ist entweder ein Green Flag oder ein Dealbreaker und ich muss es jetzt sofort wissen.',
    },
    explanation: {
      en: "Creates instant tension and a reason for them to prove themselves. Playfully high-stakes framing for a fun topic.",
      de: 'Erzeugt sofortige Spannung und einen Grund sich zu beweisen. Spielerisch dramatische Rahmung für ein lockeres Thema.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_9',
    categoryId: 'story_replies',
    situation: { en: 'They post a mirror selfie/outfit story', de: 'Spiegel-Selfie-/Outfit-Story' },
    text: {
      en: "Ok but how many attempts did it take? Be honest. I won't judge... much.",
      de: 'Ok aber wie viele Versuche hat es gebraucht? Sei ehrlich. Ich urteile nicht... viel.',
    },
    explanation: {
      en: "Playful teasing that everyone can relate to. Shows you don't take social media too seriously.",
      de: 'Spielerisches Aufziehen mit dem sich jeder identifizieren kann. Zeigt, dass du Social Media nicht zu ernst nimmst.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_10',
    categoryId: 'story_replies',
    situation: { en: 'They post a hiking/nature story', de: 'Wander-/Natur-Story' },
    text: {
      en: "Beautiful. Quick question though: would you survive a zombie apocalypse or are you the first one gone?",
      de: 'Wunderschön. Kurze Frage aber: würdest du eine Zombie-Apokalypse überleben oder bist du der Erste der geht?',
    },
    explanation: {
      en: "Random hypothetical that turns their nature post into an adventure conversation. People love debating this.",
      de: 'Zufällige hypothetische Frage die ihren Natur-Post in ein Abenteuer-Gespräch verwandelt. Jeder diskutiert das gerne.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_11',
    categoryId: 'story_replies',
    situation: { en: 'They post a club/party story', de: 'Club-/Party-Story' },
    text: {
      en: "Scale of 1-10, how much are you regretting this tomorrow morning?",
      de: 'Auf einer Skala von 1-10, wie sehr bereust du das morgen früh?',
    },
    explanation: {
      en: "Relatable party humor. It's funny, not preachy, and gives them a reason to update you the next day.",
      de: 'Relatable Party-Humor. Lustig, nicht belehrend, und gibt ihnen einen Grund dich am nächsten Tag zu updaten.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_12',
    categoryId: 'story_replies',
    situation: { en: 'They post a study/work story', de: 'Lern-/Arbeits-Story' },
    text: {
      en: "You look way too productive. What's the secret — panic, caffeine, or both?",
      de: 'Du siehst viel zu produktiv aus. Was ist das Geheimnis — Panik, Koffein oder beides?',
    },
    explanation: {
      en: "Validates their effort while being funny. Everyone procrastinates — they'll laugh because it's relatable.",
      de: 'Würdigt ihren Einsatz und ist dabei lustig. Jeder prokrastiniert — sie lachen weil es relatable ist.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_13',
    categoryId: 'story_replies',
    situation: { en: 'They post a vacation/pool story', de: 'Urlaubs-/Pool-Story' },
    text: {
      en: "Not me being at work looking at this. Very rude honestly. Where is that?",
      de: 'Nicht ich der das auf der Arbeit sieht. Sehr unhöflich ehrlich gesagt. Wo ist das?',
    },
    explanation: {
      en: "Light jealousy humor that makes them feel good about their trip while starting a real conversation.",
      de: 'Leichter Neid-Humor der sie gut fühlen lässt über ihren Trip und gleichzeitig ein echtes Gespräch startet.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_14',
    categoryId: 'story_replies',
    situation: { en: 'They post a new haircut/glow-up story', de: 'Neuer Haarschnitt-/Glow-Up-Story' },
    text: {
      en: "Alright who gave you permission to just casually upgrade like that?",
      de: 'Ok wer hat dir die Erlaubnis gegeben einfach so ein Upgrade zu machen?',
    },
    explanation: {
      en: "A compliment disguised as a joke. Way smoother than 'you look good' — it's memorable and flattering.",
      de: "Ein Kompliment als Witz verpackt. Viel smoother als 'du siehst gut aus' — einprägsam und schmeichelnd.",
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_15',
    categoryId: 'story_replies',
    situation: { en: 'They post a boring/mundane story', de: 'Langweilige/alltägliche Story' },
    text: {
      en: "This is the most honest story I've seen all week. Everyone else is faking. You're real.",
      de: 'Das ist die ehrlichste Story die ich die ganze Woche gesehen hab. Alle anderen faken. Du bist echt.',
    },
    explanation: {
      en: "Flipping the script — turning their 'boring' content into a genuine compliment about authenticity.",
      de: 'Den Spieß umdrehen — ihren „langweiligen" Content in ein echtes Kompliment über Authentizität verwandeln.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_16',
    categoryId: 'story_replies',
    situation: { en: 'They post a book/reading story', de: 'Buch-/Lese-Story' },
    text: {
      en: "A person who reads? In this economy? You just became 10x more interesting.",
      de: 'Jemand der liest? In dieser Wirtschaft? Du bist gerade 10x interessanter geworden.',
    },
    explanation: {
      en: "Humor + genuine appreciation. Makes them feel seen for something they're proud of.",
      de: 'Humor + echte Wertschätzung. Gibt ihnen das Gefühl für etwas gesehen zu werden, worauf sie stolz sind.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_17',
    categoryId: 'story_replies',
    situation: { en: 'They post a car/driving story', de: 'Auto-/Fahr-Story' },
    text: {
      en: "Cool car but more importantly — are you a road trip sing-along person or a silent driver type?",
      de: 'Cooles Auto aber wichtiger — bist du ein Roadtrip-Mitsing-Mensch oder ein stiller Fahrer-Typ?',
    },
    explanation: {
      en: 'Redirects from a shallow topic to a personality question. Creates a fun either-or dynamic.',
      de: 'Leitet von einem oberflächlichen Thema zu einer Persönlichkeitsfrage um. Erzeugt eine lustige Entweder-Oder-Dynamik.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_18',
    categoryId: 'story_replies',
    situation: { en: 'They post a skiing/snow story', de: 'Ski-/Schnee-Story' },
    text: {
      en: "Be honest — how many times did you fall before filming the cool version?",
      de: 'Sei ehrlich — wie oft bist du gefallen bevor du die coole Version gefilmt hast?',
    },
    explanation: {
      en: 'Teasing that assumes the best (they got a cool shot) while being relatable. Everyone faceplants on the slopes.',
      de: 'Aufziehen das vom Besten ausgeht (sie haben einen coolen Shot) und gleichzeitig relatable ist.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_19',
    categoryId: 'story_replies',
    situation: { en: 'They post a spa/self-care story', de: 'Spa-/Selfcare-Story' },
    text: {
      en: "Living your best life while I'm here debating what to have for dinner. Teach me your ways.",
      de: 'Du lebst dein bestes Leben während ich hier überlege was ich zum Abendessen esse. Bring mir deine Wege bei.',
    },
    explanation: {
      en: 'Self-deprecating humor that puts them on a pedestal without being cringey. Feels natural.',
      de: 'Selbstironischer Humor der sie auf ein Podest stellt ohne cringe zu sein. Fühlt sich natürlich an.',
    },
    isPremium: true,
    forGender: 'all',
  },
  {
    id: 'sr_20',
    categoryId: 'story_replies',
    situation: { en: 'They post a throwback/childhood story', de: 'Throwback-/Kindheits-Story' },
    text: {
      en: "Little you had no idea you'd grow up to have this much main character energy.",
      de: 'Das kleine Du hatte keine Ahnung, dass du mit so viel Hauptcharakter-Energie aufwachsen würdest.',
    },
    explanation: {
      en: 'A creative compliment that bridges past and present. Shows you actually look at their stories thoughtfully.',
      de: 'Ein kreatives Kompliment das Vergangenheit und Gegenwart verbindet. Zeigt, dass du ihre Stories aufmerksam anschaust.',
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
