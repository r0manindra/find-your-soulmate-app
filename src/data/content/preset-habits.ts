import type { PresetHabit } from '@/src/core/entities/habit-types';

export const presetHabits: PresetHabit[] = [
  // Phase 0: The Basics (ch 21-24) — 3-4 per chapter

  // Ch 21: The Foundation (Hygiene, skincare & grooming)
  { id: 'p21-1', emoji: '🧴', title: { en: 'Morning skincare routine', de: 'Morgendliche Hautpflege' }, chapterId: 21 },
  { id: 'p21-2', emoji: '🪥', title: { en: 'Brush & floss teeth', de: 'Zähne putzen & Zahnseide' }, chapterId: 21 },
  { id: 'p21-3', emoji: '💅', title: { en: 'Check nails & grooming', de: 'Nägel & Pflege checken' }, chapterId: 21 },
  { id: 'p21-4', emoji: '🚿', title: { en: 'Cold shower finish', de: 'Kalt abduschen' }, chapterId: 21 },

  // Ch 22: Your Voice
  { id: 'p22-1', emoji: '🎙️', title: { en: '5-min voice exercise', de: '5-Min Stimmübung' }, chapterId: 22 },
  { id: 'p22-2', emoji: '🗣️', title: { en: 'Practice speaking slowly', de: 'Langsames Sprechen üben' }, chapterId: 22 },
  { id: 'p22-3', emoji: '🎧', title: { en: 'Record & listen to yourself', de: 'Aufnehmen & anhören' }, chapterId: 22 },

  // Ch 23: Discipline & Habits
  { id: 'p23-1', emoji: '🏋️', title: { en: 'Workout or movement', de: 'Training oder Bewegung' }, chapterId: 23 },
  { id: 'p23-2', emoji: '📖', title: { en: 'Read for 20 minutes', de: '20 Minuten lesen' }, chapterId: 23 },
  { id: 'p23-3', emoji: '🌅', title: { en: 'Morning routine completed', de: 'Morgenroutine erledigt' }, chapterId: 23 },
  { id: 'p23-4', emoji: '😴', title: { en: 'In bed by midnight', de: 'Vor Mitternacht im Bett' }, chapterId: 23 },

  // Ch 24: Presence & Manners
  { id: 'p24-1', emoji: '🧍', title: { en: 'Posture check (3x today)', de: 'Haltungscheck (3x heute)' }, chapterId: 24 },
  { id: 'p24-2', emoji: '📵', title: { en: 'Phone-free meal', de: 'Handyfreie Mahlzeit' }, chapterId: 24 },
  { id: 'p24-3', emoji: '👔', title: { en: 'Dress with intention', de: 'Bewusst kleiden' }, chapterId: 24 },

  // Ch 25: Social Practice
  { id: 'p25-1', emoji: '👋', title: { en: 'Talk to a stranger', de: 'Mit einem Fremden sprechen' }, chapterId: 25 },
  { id: 'p25-2', emoji: '✨', title: { en: 'Compliment someone', de: 'Jemandem ein Kompliment machen' }, chapterId: 25 },
  { id: 'p25-3', emoji: '😂', title: { en: 'Make someone laugh', de: 'Jemanden zum Lachen bringen' }, chapterId: 25 },

  // Phase 1: Know Yourself (ch 1-4) — 2 per chapter

  // Ch 1: The Mirror
  { id: 'p1-1', emoji: '📝', title: { en: 'Journal for 10 minutes', de: '10 Minuten Tagebuch schreiben' }, chapterId: 1 },
  { id: 'p1-2', emoji: '🪞', title: { en: 'Self-reflection check-in', de: 'Selbstreflexion Check-in' }, chapterId: 1 },

  // Ch 2: Confidence Bootcamp
  { id: 'p2-1', emoji: '💪', title: { en: 'Power pose for 2 minutes', de: 'Power-Pose für 2 Minuten' }, chapterId: 2 },
  { id: 'p2-2', emoji: '🚶', title: { en: 'Walk with shoulders back', de: 'Mit aufrechten Schultern gehen' }, chapterId: 2 },

  // Ch 3: Eye Contact
  { id: 'p3-1', emoji: '👁️', title: { en: 'Eye contact with a stranger', de: 'Blickkontakt mit Fremdem' }, chapterId: 3 },
  { id: 'p3-2', emoji: '👀', title: { en: 'Hold eye contact 3 seconds', de: '3 Sek. Blickkontakt halten' }, chapterId: 3 },

  // Ch 4: Starting Conversations
  { id: 'p4-1', emoji: '💬', title: { en: 'Start 1 conversation', de: '1 Gespräch beginnen' }, chapterId: 4 },
  { id: 'p4-2', emoji: '👋', title: { en: 'Greet someone new', de: 'Jemand Neues grüßen' }, chapterId: 4 },

  // Phase 2: Make Your Move (ch 5-8) — 1-2 per chapter

  // Ch 5: The Approach
  { id: 'p5-1', emoji: '🚶', title: { en: 'Approach someone today', de: 'Heute jemanden ansprechen' }, chapterId: 5 },

  // Ch 6: Reading the Room
  { id: 'p6-1', emoji: '🎯', title: { en: 'Observe social dynamics', de: 'Soziale Dynamiken beobachten' }, chapterId: 6 },
  { id: 'p6-2', emoji: '🧠', title: { en: 'Note 3 body language cues', de: '3 Körpersprache-Signale notieren' }, chapterId: 6 },

  // Ch 7: Active Listening
  { id: 'p7-1', emoji: '👂', title: { en: 'Listen without interrupting', de: 'Zuhören ohne zu unterbrechen' }, chapterId: 7 },

  // Ch 8: Humor & Wit
  { id: 'p8-1', emoji: '😄', title: { en: 'Make someone laugh', de: 'Jemanden zum Lachen bringen' }, chapterId: 8 },

  // Phase 3: The Connection (ch 9-12) — 1 per chapter

  // Ch 9: The Compliment
  { id: 'p9-1', emoji: '✨', title: { en: 'Give a genuine compliment', de: 'Ehrliches Kompliment machen' }, chapterId: 9 },

  // Ch 10: Digital Game
  { id: 'p10-1', emoji: '📱', title: { en: 'Improve dating profile', de: 'Dating-Profil verbessern' }, chapterId: 10 },

  // Ch 11: First Date
  { id: 'p11-1', emoji: '🌹', title: { en: 'Plan a date idea', de: 'Date-Idee planen' }, chapterId: 11 },

  // Ch 12: Conversation Flow
  { id: 'p12-1', emoji: '🌊', title: { en: 'Practice open-ended questions', de: 'Offene Fragen üben' }, chapterId: 12 },

  // Phase 4: Going Deeper (ch 13-16) — 1 per chapter

  // Ch 13: Touch & Proximity
  { id: 'p13-1', emoji: '🤝', title: { en: 'Initiate appropriate touch', de: 'Angemessene Berührung initiieren' }, chapterId: 13 },

  // Ch 14: Handling Rejection
  { id: 'p14-1', emoji: '🛡️', title: { en: 'Reframe a rejection', de: 'Ablehnung umdeuten' }, chapterId: 14 },

  // Ch 15: The Follow-Up
  { id: 'p15-1', emoji: '📩', title: { en: 'Send a thoughtful follow-up', de: 'Durchdachtes Follow-Up senden' }, chapterId: 15 },

  // Ch 16: Building Connection
  { id: 'p16-1', emoji: '🔗', title: { en: 'Share something vulnerable', de: 'Etwas Verletzliches teilen' }, chapterId: 16 },

  // Phase 5: The Commitment (ch 17-20) — 1 per chapter

  // Ch 17: Reading Signals
  { id: 'p17-1', emoji: '📡', title: { en: 'Note interest signals', de: 'Interessenssignale notieren' }, chapterId: 17 },

  // Ch 18: Relationship Talk
  { id: 'p18-1', emoji: '💑', title: { en: 'Practice honest communication', de: 'Ehrliche Kommunikation üben' }, chapterId: 18 },

  // Ch 19: Keeping the Spark
  { id: 'p19-1', emoji: '🔥', title: { en: 'Do something unexpected', de: 'Etwas Unerwartetes tun' }, chapterId: 19 },

  // Ch 20: The Graduation
  { id: 'p20-1', emoji: '🎓', title: { en: 'Express gratitude to someone', de: 'Jemandem Dankbarkeit zeigen' }, chapterId: 20 },
];

export function getPresetsForChapter(chapterId: number): PresetHabit[] {
  return presetHabits.filter((p) => p.chapterId === chapterId);
}

export function getPresetById(id: string): PresetHabit | undefined {
  return presetHabits.find((p) => p.id === id);
}
