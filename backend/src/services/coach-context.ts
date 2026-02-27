import { chaptersMeta, phasesMeta } from '../content/chapters-meta';
import { chapterLessons } from '../content/chapter-lessons';
import { getCharacterPrompt } from './characters';
import { getExercisePromptBlock, type ExerciseModeId } from './exercise-modes';

// ── Types ────────────────────────────────────────────────────────────

export interface UserJourneyContext {
  profile: {
    gender: 'male' | 'female' | null;
    ageGroup: string | null;
    skillLevel: string | null;
    socialEnergy: string | null;
    basicsLevel: string | null;
    goal: string | null;
  };
  progress: {
    completedChapters: number[];
    currentChapterId: number | null;
    streak: number;
    graduated: boolean;
  };
  habits: {
    active: { name: string; currentStreak: number }[];
    todayCompleted: number;
    todayTotal: number;
    weeklyCompletionRate: number;
  };
  locale: 'en' | 'de';
}

// ── Chapter order (the journey path) ─────────────────────────────────

const CHAPTER_ORDER: number[] = phasesMeta.flatMap((p) => p.chapters);

// ── Helpers ──────────────────────────────────────────────────────────

function getChapterTitle(id: number): string {
  return chaptersMeta.find((c) => c.id === id)?.title ?? `Chapter ${id}`;
}

function getPhaseForChapter(chapterId: number): { id: number; title: string } | null {
  const phase = phasesMeta.find((p) => p.chapters.includes(chapterId));
  return phase ? { id: phase.id, title: phase.title } : null;
}

function getNextChapterId(currentId: number, completed: number[]): number | null {
  const idx = CHAPTER_ORDER.indexOf(currentId);
  if (idx === -1) return null;
  for (let i = idx + 1; i < CHAPTER_ORDER.length; i++) {
    if (!completed.includes(CHAPTER_ORDER[i])) return CHAPTER_ORDER[i];
  }
  return null;
}

function formatGoal(goal: string | null): string {
  const map: Record<string, string> = {
    social_confidence: 'build social confidence',
    get_dates: 'get more dates',
    find_partner: 'find a long-term partner',
    social_magnetism: 'become socially magnetic',
    ambitious: 'master all social & dating skills',
  };
  return goal ? map[goal] ?? goal : 'unspecified';
}

function formatEnergy(energy: string | null): string {
  const map: Record<string, string> = {
    deep_introvert: 'deep introvert',
    introvert: 'introvert',
    ambivert: 'ambivert',
    extrovert: 'extrovert',
  };
  return energy ? map[energy] ?? energy : 'unspecified';
}

function formatAge(age: string | null): string {
  const map: Record<string, string> = {
    age_18_24: '18-24',
    age_25_34: '25-34',
    age_35_44: '35-44',
    age_45_plus: '45+',
  };
  return age ? map[age] ?? age : 'unspecified';
}

function formatSkill(skill: string | null): string {
  return skill ?? 'unspecified';
}

function formatBasics(basics: string | null): string {
  const map: Record<string, string> = {
    basics_none: 'needs work',
    basics_some: 'some basics covered',
    basics_solid: 'solid foundation',
    basics_mastered: 'mastered',
  };
  return basics ? map[basics] ?? basics : 'unspecified';
}

// ── Prompt block builders ────────────────────────────────────────────

export function buildUserContextBlock(ctx: UserJourneyContext): string {
  const { profile, progress, habits } = ctx;
  const totalChapters = CHAPTER_ORDER.length;
  const completedCount = progress.completedChapters.length;

  const currentTitle = progress.currentChapterId
    ? getChapterTitle(progress.currentChapterId)
    : null;
  const currentPhase = progress.currentChapterId
    ? getPhaseForChapter(progress.currentChapterId)
    : null;
  const nextId = progress.currentChapterId
    ? getNextChapterId(progress.currentChapterId, progress.completedChapters)
    : null;
  const nextTitle = nextId ? getChapterTitle(nextId) : null;

  const lines: string[] = [
    '=== ABOUT THIS USER ===',
    `- ${profile.gender ?? 'Unknown gender'}, age ${formatAge(profile.ageGroup)}, skill level: ${formatSkill(profile.skillLevel)}, social energy: ${formatEnergy(profile.socialEnergy)}`,
    `- Basics level: ${formatBasics(profile.basicsLevel)}`,
    `- Goal: ${formatGoal(profile.goal)}`,
  ];

  if (progress.graduated) {
    lines.push(`- GRADUATED! Completed all ${totalChapters} chapters.`);
  } else {
    lines.push(`- Completed ${completedCount}/${totalChapters} chapters.${currentPhase ? ` Currently in Phase ${currentPhase.id}: "${currentPhase.title}"` : ''}`);
    if (currentTitle) lines.push(`- Currently working on: "${currentTitle}"`);
    if (nextTitle) lines.push(`- Next up: "${nextTitle}"`);
  }

  if (progress.streak > 0) {
    lines.push(`- App streak: ${progress.streak} day${progress.streak !== 1 ? 's' : ''}`);
  }

  if (habits.active.length > 0) {
    const habitList = habits.active
      .map((h) => `"${h.name}" (${h.currentStreak}d streak)`)
      .join(', ');
    lines.push(`- Active habits: ${habitList}`);
    lines.push(`- Habits today: ${habits.todayCompleted}/${habits.todayTotal} done | Weekly rate: ${Math.round(habits.weeklyCompletionRate * 100)}%`);
  }

  return lines.join('\n');
}

export function buildChapterContextBlock(ctx: UserJourneyContext): string | null {
  const { progress, profile } = ctx;
  if (!progress.currentChapterId) return null;

  const chapter = chapterLessons.find((c) => c.chapterId === progress.currentChapterId);
  if (!chapter) return null;

  const isFemale = profile.gender === 'female';
  const lessons = isFemale && chapter.femaleVariant ? chapter.femaleVariant.lessons : chapter.lessons;
  const exercises = isFemale && chapter.femaleVariant ? chapter.femaleVariant.exercises : chapter.exercises;
  const takeaway = isFemale && chapter.femaleVariant ? chapter.femaleVariant.keyTakeaway : chapter.keyTakeaway;

  const title = getChapterTitle(progress.currentChapterId);

  const lines: string[] = [
    `=== CURRENT CHAPTER: "${title}" ===`,
    `Key Takeaway: ${takeaway}`,
    `Lessons: ${lessons.map((l) => l.title).join(', ')}`,
    'Exercises:',
  ];

  exercises.forEach((ex, i) => {
    lines.push(`${i + 1}. ${ex.title} — ${ex.description.slice(0, 120)}${ex.description.length > 120 ? '...' : ''}`);
  });

  return lines.join('\n');
}

const COACHING_GUIDELINES = `=== COACHING GUIDELINES ===
- Reference current chapter content naturally when giving advice
- Celebrate streaks and habit consistency
- Tailor advice to their skill level and energy type
- Frame advice around their stated goal
- If they ask about future chapter topics, give brief help and tease the upcoming chapter
- Actively propose exercises from the current chapter as interactive practice
- Create roleplay scenarios (e.g., "Let's practice: I'm someone at a coffee shop, try your opening line")
- Give specific, encouraging feedback on user attempts
- After helping with a topic, suggest the next exercise to try
- Do NOT recite chapter content verbatim, weave it naturally into conversation
- If the user has graduated, focus on real-world application and reinforcement
- Match the language/locale preference when possible
- The app has a Phrasebook feature with curated opening lines, compliments, conversation deepeners, witty responses, smart vocabulary, and closing lines — mention it naturally when giving advice about what to say`;

// ── Main prompt builder ──────────────────────────────────────────────

export function buildContextAwarePrompt(
  characterId: string,
  ctx: UserJourneyContext,
  exerciseMode?: ExerciseModeId
): string {
  const characterPrompt = getCharacterPrompt(characterId);
  const userBlock = buildUserContextBlock(ctx);
  const chapterBlock = buildChapterContextBlock(ctx);

  const parts = [characterPrompt, '', userBlock];
  if (chapterBlock) parts.push('', chapterBlock);
  parts.push('', COACHING_GUIDELINES);

  if (exerciseMode) {
    const exerciseBlock = getExercisePromptBlock(exerciseMode);
    if (exerciseBlock) {
      parts.push('', exerciseBlock);
    }
  }

  return parts.join('\n');
}
