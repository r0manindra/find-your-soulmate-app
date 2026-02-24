import type { Habit } from '@/src/core/entities/habit-types';

interface NudgeContext {
  habit: Habit;
  streak: { current: number; longest: number };
  missedYesterday: boolean;
  completedToday: boolean;
  characterId: string;
}

type LocalizedString = { en: string; de: string };

export function generateNudge(ctx: NudgeContext): LocalizedString | null {
  const { habit, streak, missedYesterday, completedToday, characterId } = ctx;

  if (completedToday) return null;

  const isCharismo = characterId === 'charismo';

  // Streak broke — sarcastic RIP
  if (missedYesterday && streak.longest > 2) {
    if (isCharismo) {
      return {
        en: `Your ${streak.longest}-day streak on "${habit.title.en}" just died. RIP. But hey, today's a fresh start.`,
        de: `Dein ${streak.longest}-Tage-Streak bei "${habit.title.de}" ist gerade gestorben. RIP. Aber hey, heute ist ein Neuanfang.`,
      };
    }
    return {
      en: `So "${habit.title.en}" had a ${streak.longest}-day streak and you just... let it die? Bold move. Start over.`,
      de: `Also "${habit.title.de}" hatte einen ${streak.longest}-Tage-Streak und du hast ihn einfach... sterben lassen? Mutig. Fang neu an.`,
    };
  }

  // Streak celebration milestones
  if (streak.current === 7) {
    if (isCharismo) {
      return {
        en: `7 days straight on "${habit.title.en}"! You're building something real. Keep it going.`,
        de: `7 Tage am Stück bei "${habit.title.de}"! Du baust etwas Echtes auf. Weiter so.`,
      };
    }
    return {
      en: `A whole week of "${habit.title.en}". Who even are you anymore? I'm almost impressed.`,
      de: `Eine ganze Woche "${habit.title.de}". Wer bist du überhaupt? Ich bin fast beeindruckt.`,
    };
  }
  if (streak.current === 14) {
    if (isCharismo) {
      return {
        en: `2 weeks of "${habit.title.en}"! This is becoming part of who you are.`,
        de: `2 Wochen "${habit.title.de}"! Das wird ein Teil von dir.`,
      };
    }
    return {
      en: `14 days. "${habit.title.en}" is basically your personality now. Respect.`,
      de: `14 Tage. "${habit.title.de}" ist jetzt quasi deine Persönlichkeit. Respekt.`,
    };
  }
  if (streak.current === 30) {
    if (isCharismo) {
      return {
        en: `30 days of "${habit.title.en}"! You're a machine. This is permanent now.`,
        de: `30 Tage "${habit.title.de}"! Du bist eine Maschine. Das ist jetzt dauerhaft.`,
      };
    }
    return {
      en: `30 DAYS. "${habit.title.en}" is no longer a habit — it's who you are. Legendary.`,
      de: `30 TAGE. "${habit.title.de}" ist keine Gewohnheit mehr — es ist wer du bist. Legendär.`,
    };
  }

  // Daily reminder — not yet completed
  if (isCharismo) {
    return {
      en: `Don't forget "${habit.title.en}" today. You've got this.`,
      de: `Vergiss "${habit.title.de}" heute nicht. Du schaffst das.`,
    };
  }
  return {
    en: `"${habit.title.en}" isn't going to do itself. Chop chop.`,
    de: `"${habit.title.de}" erledigt sich nicht von selbst. Los los.`,
  };
}

export function getTopNudge(
  habits: { habit: Habit; streak: { current: number; longest: number }; missedYesterday: boolean; completedToday: boolean }[],
  characterId: string
): LocalizedString | null {
  // Priority: streak broke > milestone > daily reminder
  for (const h of habits) {
    if (h.missedYesterday && h.streak.longest > 2) {
      return generateNudge({ ...h, characterId });
    }
  }
  for (const h of habits) {
    if ([7, 14, 30].includes(h.streak.current) && !h.completedToday) {
      return generateNudge({ ...h, characterId });
    }
  }
  for (const h of habits) {
    if (!h.completedToday) {
      return generateNudge({ ...h, characterId });
    }
  }
  return null;
}
