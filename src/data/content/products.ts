import type { Product } from '@/src/core/entities/types';

export const products: Product[] = [
  // Fragrances - linked to ch 21 "The Foundation"
  {
    id: 1,
    name: 'Santal 33',
    brand: 'Le Labo',
    category: 'fragrance',
    emoji: '🌿',
    ionicon: 'leaf-outline',
    affiliateUrl: 'https://www.lelabofragrances.com/santal-33.html',
    chapterIds: [21],
    description: {
      en: 'The "you smell amazing, what is that?" fragrance. Woody, warm, unisex - instant conversation starter.',
      de: 'Der "du riechst unglaublich, was ist das?" Duft. Holzig, warm, unisex - sofortiger Gesprächseröffner.',
    },
    whyItWorks: {
      en: 'Scent is the most powerful trigger of memory and attraction. This one gets compliments without trying.',
      de: 'Duft ist der stärkste Auslöser von Erinnerung und Anziehung. Dieser bekommt Komplimente ohne es zu versuchen.',
    },
  },
  {
    id: 2,
    name: 'Sauvage',
    brand: 'Dior',
    category: 'fragrance',
    emoji: '🔥',
    ionicon: 'flame-outline',
    affiliateUrl: 'https://www.dior.com/en_us/products/beauty-sauvage',
    chapterIds: [21],
    description: {
      en: 'The universal crowd-pleaser. Fresh, bold, and impossible to dislike. The safe bet that never feels safe.',
      de: 'Der universelle Publikumsliebling. Frisch, mutig und unmöglich nicht zu mögen. Die sichere Wahl, die nie langweilig wirkt.',
    },
    whyItWorks: {
      en: "It's the most complimented men's fragrance for a reason. Wide appeal, great longevity, works everywhere.",
      de: 'Es ist aus gutem Grund der meistkomplimentierte Herrenduft. Breite Wirkung, lange Haltbarkeit, funktioniert überall.',
    },
  },
  {
    id: 3,
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    category: 'fragrance',
    emoji: '💎',
    ionicon: 'diamond-outline',
    affiliateUrl: 'https://www.chanel.com/us/fragrance/men/bleu-de-chanel/',
    chapterIds: [21],
    description: {
      en: 'Sophisticated, timeless, and effortlessly classy. The fragrance equivalent of a well-tailored suit.',
      de: 'Sophisticated, zeitlos und mühelos stilvoll. Das Duft-Äquivalent eines maßgeschneiderten Anzugs.',
    },
    whyItWorks: {
      en: 'Projects maturity and taste without being overpowering. Perfect for dates and professional settings alike.',
      de: 'Strahlt Reife und Geschmack aus, ohne aufdringlich zu sein. Perfekt für Dates und berufliche Situationen.',
    },
  },
  // Grooming/Skincare - linked to ch 21
  {
    id: 4,
    name: 'Foaming Cleanser',
    brand: 'CeraVe',
    category: 'skincare',
    emoji: '🧴',
    ionicon: 'flask-outline',
    affiliateUrl: 'https://www.cerave.com/skincare/cleansers/foaming-facial-cleanser',
    chapterIds: [21],
    description: {
      en: 'The no-BS skincare starter. Dermatologist-recommended, affordable, and actually works. No excuses.',
      de: 'Der No-Nonsense Hautpflege-Einstieg. Von Dermatologen empfohlen, bezahlbar und funktioniert tatsächlich.',
    },
    whyItWorks: {
      en: 'Clear skin is the foundation of looking put-together. This removes the guesswork from starting a routine.',
      de: 'Klare Haut ist die Grundlage für ein gepflegtes Aussehen. Dieses Produkt nimmt das Rätselraten aus dem Start einer Routine.',
    },
  },
  {
    id: 5,
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'skincare',
    emoji: '✨',
    ionicon: 'sparkles-outline',
    affiliateUrl: 'https://theordinary.com/en-us/niacinamide-10-zinc-1-100436.html',
    chapterIds: [21],
    description: {
      en: 'The affordable skin game changer. Reduces pores, controls oil, evens skin tone. Under $10.',
      de: 'Der bezahlbare Hautpflege-Gamechanger. Verkleinert Poren, kontrolliert Öl, gleicht den Hautton aus. Unter 10€.',
    },
    whyItWorks: {
      en: "Good skin doesn't need to be expensive. This one serum does more than most $50 products combined.",
      de: 'Gute Haut muss nicht teuer sein. Dieses eine Serum leistet mehr als die meisten 50€-Produkte zusammen.',
    },
  },
  {
    id: 6,
    name: 'OneBlade Pro',
    brand: 'Philips',
    category: 'grooming',
    emoji: '🪒',
    ionicon: 'cut-outline',
    affiliateUrl: 'https://www.philips.com/c-m-pe/oneblade',
    chapterIds: [21],
    description: {
      en: 'Trims, edges, and shaves any length. One tool for your entire face and body. No more 5 different gadgets.',
      de: 'Trimmt, konturiert und rasiert jede Länge. Ein Werkzeug für Gesicht und Körper. Schluss mit 5 verschiedenen Geräten.',
    },
    whyItWorks: {
      en: 'Grooming should be simple. This handles everything from stubble to clean-shaven in one device.',
      de: 'Pflege sollte einfach sein. Dieses Gerät handhabt alles von Stoppeln bis glatt rasiert.',
    },
  },
  // Style - linked to ch 24 "Presence & Manners"
  {
    id: 7,
    name: 'Classic White Tee',
    brand: 'Uniqlo U',
    category: 'style',
    emoji: '👕',
    ionicon: 'shirt-outline',
    affiliateUrl: 'https://www.uniqlo.com/us/en/men/t-shirts',
    chapterIds: [24],
    description: {
      en: "The perfect white tee that actually fits. Heavy cotton, clean cut, doesn't go see-through after one wash.",
      de: 'Das perfekte weiße T-Shirt, das tatsächlich passt. Schwerer Baumwollstoff, cleaner Schnitt, wird nicht durchsichtig.',
    },
    whyItWorks: {
      en: 'A well-fitting white tee is the most versatile piece in your wardrobe. Get the basics right first.',
      de: 'Ein gut sitzendes weißes T-Shirt ist das vielseitigste Teil in deinem Kleiderschrank. Erst die Basics richtig machen.',
    },
  },
  {
    id: 8,
    name: 'Slim Fit Dark Jeans',
    brand: 'Levi\'s 511',
    category: 'style',
    emoji: '👖',
    ionicon: 'accessibility-outline',
    affiliateUrl: 'https://www.levi.com/US/en_US/clothing/men/jeans/511-slim-fit-jeans/',
    chapterIds: [24],
    description: {
      en: 'Dark, slim, timeless. The jeans that work with everything - sneakers, boots, date night, casual Friday.',
      de: 'Dunkel, slim, zeitlos. Die Jeans, die zu allem passt - Sneaker, Stiefel, Date-Night, Casual Friday.',
    },
    whyItWorks: {
      en: 'Dark jeans are the Swiss Army knife of style. They dress up or down and always look intentional.',
      de: 'Dunkle Jeans sind das Schweizer Taschenmesser des Stils. Sie kleiden hoch oder runter und wirken immer gewollt.',
    },
  },
  {
    id: 9,
    name: 'Clean White Sneakers',
    brand: 'Axel Arigato',
    category: 'style',
    emoji: '👟',
    ionicon: 'footsteps-outline',
    affiliateUrl: 'https://www.axelarigato.com/clean-90',
    chapterIds: [24],
    description: {
      en: 'Clean, minimal white sneakers that elevate any outfit. The Common Projects look without the price tag.',
      de: 'Cleane, minimalistische weiße Sneaker, die jedes Outfit aufwerten. Der Common Projects Look ohne den Preis.',
    },
    whyItWorks: {
      en: 'Shoes are the first thing people notice. Clean white sneakers say "I have my life together" without trying.',
      de: 'Schuhe sind das Erste, was Menschen bemerken. Weiße Sneaker sagen "Ich hab mein Leben im Griff" ohne es zu versuchen.',
    },
  },
  // Fitness - linked to ch 23 "Discipline & Habits"
  {
    id: 10,
    name: 'Resistance Bands Set',
    brand: 'Fit Simplify',
    category: 'fitness',
    emoji: '💪',
    ionicon: 'barbell-outline',
    affiliateUrl: 'https://www.amazon.com/dp/B01AVDVHTI',
    chapterIds: [23],
    description: {
      en: 'No gym? No excuse. Full-body workout anywhere. 5 resistance levels from "I just started" to "I\'m a machine".',
      de: 'Kein Gym? Keine Ausrede. Ganzkörper-Workout überall. 5 Widerstandsstufen von "Ich fang gerade an" bis "Ich bin eine Maschine".',
    },
    whyItWorks: {
      en: 'Fitness is the fastest way to boost confidence. These cost less than a month at the gym and travel anywhere.',
      de: 'Fitness ist der schnellste Weg, Selbstbewusstsein zu steigern. Kosten weniger als ein Monat im Gym und passen überall hin.',
    },
  },
  {
    id: 11,
    name: 'Jump Rope',
    brand: 'Crossrope',
    category: 'fitness',
    emoji: '🏃',
    ionicon: 'pulse-outline',
    affiliateUrl: 'https://www.crossrope.com/',
    chapterIds: [23],
    description: {
      en: 'Best cardio tool that fits in your pocket. Burns more calories than running. 10 minutes = done.',
      de: 'Bestes Cardio-Tool, das in die Tasche passt. Verbrennt mehr Kalorien als Laufen. 10 Minuten = fertig.',
    },
    whyItWorks: {
      en: "Cardio shapes your face, improves posture, and gives you energy. This is the fastest path to looking lean.",
      de: 'Cardio formt dein Gesicht, verbessert die Haltung und gibt dir Energie. Der schnellste Weg zu einem schlanken Look.',
    },
  },
  {
    id: 12,
    name: 'Atomic Habits',
    brand: 'James Clear',
    category: 'fitness',
    emoji: '📖',
    ionicon: 'book-outline',
    affiliateUrl: 'https://www.amazon.com/dp/0735211299',
    chapterIds: [23],
    description: {
      en: "The bible of habit building. If you read one book on discipline, make it this one. Tiny changes, remarkable results.",
      de: 'Die Bibel des Gewohnheitsaufbaus. Wenn du ein Buch über Disziplin liest, dann dieses. Kleine Änderungen, bemerkenswerte Ergebnisse.',
    },
    whyItWorks: {
      en: 'Most people fail at habits because of their system, not their motivation. This book fixes the system.',
      de: 'Die meisten scheitern an Gewohnheiten wegen ihres Systems, nicht ihrer Motivation. Dieses Buch repariert das System.',
    },
  },
];

export function getProductsForChapter(chapterId: number): Product[] {
  return products.filter((p) => p.chapterIds.includes(chapterId));
}
