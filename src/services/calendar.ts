import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

async function getDefaultCalendarId(): Promise<string | null> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

  if (Platform.OS === 'ios') {
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    if (defaultCal) return defaultCal.id;
  }

  // Find primary / writable calendar
  const writable = calendars.find(
    (c) => c.allowsModifications && c.source?.type !== 'birthdays'
  );
  if (writable) return writable.id;

  // Fallback: create one on Android
  if (Platform.OS === 'android') {
    const id = await Calendar.createCalendarAsync({
      title: 'Charismo Habits',
      color: '#E8435A',
      entityType: Calendar.EntityTypes.EVENT,
      source: { isLocalAccount: true, name: 'Charismo', type: 'LOCAL' } as any,
      name: 'charismo-habits',
      ownerAccount: 'charismo',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return id;
  }

  return calendars[0]?.id ?? null;
}

export async function requestCalendarPermission(): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

export async function createHabitEvent(opts: {
  title: string;
  startHour: number;
  startMinute: number;
  durationMinutes?: number;
  scheduledDays?: number[];
  locale: 'en' | 'de';
}): Promise<boolean> {
  const granted = await requestCalendarPermission();
  if (!granted) {
    Alert.alert(
      opts.locale === 'de' ? 'Berechtigung benötigt' : 'Permission Required',
      opts.locale === 'de'
        ? 'Bitte erlaube den Kalender-Zugriff in den Einstellungen.'
        : 'Please allow calendar access in Settings.',
    );
    return false;
  }

  const calendarId = await getDefaultCalendarId();
  if (!calendarId) return false;

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    opts.startHour,
    opts.startMinute,
  );
  const end = new Date(start.getTime() + (opts.durationMinutes ?? 30) * 60 * 1000);

  // Build recurrence rule from scheduled days
  let recurrenceRule: Calendar.RecurrenceRule | undefined;
  if (opts.scheduledDays && opts.scheduledDays.length > 0 && opts.scheduledDays.length < 7) {
    const dayMap: Record<number, Calendar.DayOfTheWeek> = {
      0: Calendar.DayOfTheWeek.Sunday,
      1: Calendar.DayOfTheWeek.Monday,
      2: Calendar.DayOfTheWeek.Tuesday,
      3: Calendar.DayOfTheWeek.Wednesday,
      4: Calendar.DayOfTheWeek.Thursday,
      5: Calendar.DayOfTheWeek.Friday,
      6: Calendar.DayOfTheWeek.Saturday,
    };
    recurrenceRule = {
      frequency: Calendar.Frequency.WEEKLY,
      daysOfTheWeek: opts.scheduledDays.map((d) => ({ dayOfTheWeek: dayMap[d] })),
    };
  } else {
    // Every day
    recurrenceRule = { frequency: Calendar.Frequency.DAILY };
  }

  await Calendar.createEventAsync(calendarId, {
    title: opts.title,
    startDate: start,
    endDate: end,
    recurrenceRule,
    alarms: [{ relativeOffset: -5 }],
  });

  return true;
}
