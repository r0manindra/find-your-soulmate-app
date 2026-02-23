import type { Achievement } from '@/src/core/entities/types';

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    title: { en: 'First Step', de: 'Erster Schritt' },
    description: { en: 'Complete your first chapter', de: 'Schließe dein erstes Kapitel ab' },
    icon: '👣',
    condition: (s) => s.completedChapters.length >= 1,
  },
  {
    id: 'bookworm',
    title: { en: 'Bookworm', de: 'Bücherwurm' },
    description: { en: 'Finish reading 3 books', de: 'Lies 3 Bücher fertig' },
    icon: '📚',
    condition: (s) => s.completedBooks.length >= 3,
  },
  {
    id: 'smooth-talker',
    title: { en: 'Smooth Talker', de: 'Charmeur' },
    description: { en: '50 AI coach conversations', de: '50 KI-Coach-Gespräche' },
    icon: '🗣️',
    condition: (s) => s.chatMessageCount >= 50,
  },
  {
    id: 'streak-master',
    title: { en: 'Streak Master', de: 'Streak-Meister' },
    description: { en: '7-day streak', de: '7-Tage-Streak' },
    icon: '🔥',
    condition: (s) => s.streak >= 7,
  },
  {
    id: 'halfway',
    title: { en: 'Halfway There', de: 'Halbzeit' },
    description: { en: 'Complete 10 chapters', de: 'Schließe 10 Kapitel ab' },
    icon: '⭐',
    condition: (s) => s.completedChapters.length >= 10,
  },
  {
    id: 'the-graduate',
    title: { en: 'The Graduate', de: 'Der Absolvent' },
    description: { en: 'Complete all chapters + 5 books', de: 'Schließe alle Kapitel + 5 Bücher ab' },
    icon: '🎓',
    condition: (s) => s.completedChapters.length >= 20 && s.completedBooks.length >= 5,
  },
  {
    id: 'soulmate-found',
    title: { en: 'Soulmate Found', de: 'Seelenverwandten gefunden' },
    description: { en: "You don't need us anymore!", de: 'Du brauchst uns nicht mehr!' },
    icon: '❤️',
    condition: (s) => s.graduated,
  },
];
