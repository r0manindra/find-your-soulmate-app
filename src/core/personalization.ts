import type { SocialEnergy, AgeGroup, SkillLevel, Goal } from '@/src/store/user-profile-store';

export interface PersonalizationResult {
  suggestedStartChapter: number;
  recommendedCharacterId: string;
  bookPriority: number[];
  contentTone: 'gen_z' | 'millennial' | 'mature' | 'classic';
}

interface ProfileInput {
  socialEnergy: SocialEnergy | null;
  ageGroup: AgeGroup | null;
  skillLevel: SkillLevel | null;
  goal: Goal | null;
}

function getSuggestedStartChapter(skillLevel: SkillLevel | null): number {
  switch (skillLevel) {
    case 'beginner': return 1;
    case 'intermediate': return 3;
    case 'advanced': return 5;
    case 'expert': return 9;
    default: return 1;
  }
}

function getRecommendedCharacter(
  socialEnergy: SocialEnergy | null,
  goal: Goal | null,
): string {
  const isIntrovert = socialEnergy === 'introvert' || socialEnergy === 'deep_introvert';
  const isExtrovert = socialEnergy === 'extrovert';
  const isAmbivert = socialEnergy === 'ambivert';

  if (isIntrovert && goal === 'social_confidence') return 'gentleman';
  if (isIntrovert && goal === 'find_partner') return 'charismo';
  if (isIntrovert) return 'gentleman';

  if (isExtrovert && (goal === 'ambitious' || goal === 'social_magnetism')) return 'hypeman';
  if (isExtrovert) return 'maverick';

  if (isAmbivert && goal === 'ambitious') return 'smooth';
  if (isAmbivert && goal === 'get_dates') return 'playboy';
  if (isAmbivert) return 'charismo';

  return 'charismo';
}

// Default book order by ID
const DEFAULT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Foundation books for beginners: Carnegie (3), Models (1), Subtle Art (12), No More Mr Nice Guy (11)
const BEGINNER_FOUNDATION = [3, 1, 12, 11, 9, 4, 5, 7, 8, 6, 2, 10];

// Psychology-heavy picks for advanced: Art of Seduction (2), Attached (4), Come as You Are (10)
const ADVANCED_PSYCHOLOGY = [2, 4, 10, 1, 5, 6, 9, 3, 8, 7, 11, 12];

function getBookPriority(skillLevel: SkillLevel | null, goal: Goal | null): number[] {
  let base: number[];

  switch (skillLevel) {
    case 'beginner':
      base = [...BEGINNER_FOUNDATION];
      break;
    case 'intermediate':
      base = [...DEFAULT_ORDER];
      break;
    case 'advanced':
    case 'expert':
      base = [...ADVANCED_PSYCHOLOGY];
      break;
    default:
      base = [...DEFAULT_ORDER];
  }

  // Bump specific books based on goal
  if (goal === 'find_partner') {
    // Bump "Attached" (id 4) to top
    base = [4, ...base.filter((id) => id !== 4)];
  } else if (goal === 'social_confidence') {
    // Bump Carnegie (id 3) to top
    base = [3, ...base.filter((id) => id !== 3)];
  } else if (goal === 'ambitious' || goal === 'social_magnetism') {
    // Bump Art of Seduction (id 2) to top
    base = [2, ...base.filter((id) => id !== 2)];
  } else if (goal === 'get_dates') {
    // Bump Models (id 1) to top
    base = [1, ...base.filter((id) => id !== 1)];
  }

  return base;
}

function getContentTone(ageGroup: AgeGroup | null): PersonalizationResult['contentTone'] {
  switch (ageGroup) {
    case 'age_18_24': return 'gen_z';
    case 'age_25_34': return 'millennial';
    case 'age_35_44': return 'mature';
    case 'age_45_plus': return 'classic';
    default: return 'millennial';
  }
}

export function getPersonalization(profile: ProfileInput): PersonalizationResult {
  return {
    suggestedStartChapter: getSuggestedStartChapter(profile.skillLevel),
    recommendedCharacterId: getRecommendedCharacter(profile.socialEnergy, profile.goal),
    bookPriority: getBookPriority(profile.skillLevel, profile.goal),
    contentTone: getContentTone(profile.ageGroup),
  };
}
