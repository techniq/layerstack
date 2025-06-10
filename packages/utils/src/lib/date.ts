import {
  CountableTimeInterval,
  timeDay,
  timeHour,
  timeMillisecond,
  timeMinute,
  timeMonth,
  timeSecond,
  timeWeek,
  timeYear,
  timeInterval as d3TimeInterval,
  type TimeInterval,
  timeMonday,
  timeTuesday,
  timeWednesday,
  timeThursday,
  timeFriday,
  timeSaturday,
} from 'd3-time';
import { timeParse } from 'd3-time-format';
import { min, max } from 'd3-array';

import { hasKeyOf } from './typeGuards.js';
import { assertNever, entries } from './typeHelpers.js';
import { chunk } from './array.js';
import {
  PeriodType,
  DayOfWeek,
  DateToken,
  type SelectedDate,
  type CustomIntlDateTimeFormatOptions,
  type FormatDateOptions,
  type DateFormatVariantPreset,
  periodTypeMappings,
  PeriodTypeCode,
  type TimeIntervalType,
} from './date_types.js';
import { defaultLocale, type LocaleSettings } from './locale.js';
import { convertUnicodeToStrftime } from './dateInternal.js';

export * from './date_types.js';

export function getDayOfWeekName(weekStartsOn: DayOfWeek, locales: string) {
  // Create a date object for a specific day (0 = Sunday, 1 = Monday, etc.)
  // And "7 of Jan 2024" is a Sunday
  const date = new Date(2024, 0, 7 + weekStartsOn);
  const formatter = new Intl.DateTimeFormat(locales, { weekday: 'short' });
  return formatter.format(date);
}

export function getPeriodTypeName(periodType: PeriodType) {
  return getPeriodTypeNameWithLocale(defaultLocale, periodType);
}

export function getPeriodTypeNameWithLocale(settings: LocaleSettings, periodType: PeriodType) {
  const {
    locale: locale,
    dictionary: { Date: dico },
  } = settings;

  switch (periodType) {
    case PeriodType.Custom:
      return 'Custom';

    case PeriodType.Day:
      return dico.Day;
    case PeriodType.DayTime:
      return dico.DayTime;
    case PeriodType.TimeOnly:
      return dico.Time;

    case PeriodType.WeekSun:
      return `${dico.Week} (${getDayOfWeekName(DayOfWeek.Sunday, locale)})`;
    case PeriodType.WeekMon:
      return `${dico.Week} (${getDayOfWeekName(1, locale)})`;
    case PeriodType.WeekTue:
      return `${dico.Week} (${getDayOfWeekName(2, locale)})`;
    case PeriodType.WeekWed:
      return `${dico.Week} (${getDayOfWeekName(3, locale)})`;
    case PeriodType.WeekThu:
      return `${dico.Week} (${getDayOfWeekName(4, locale)})`;
    case PeriodType.WeekFri:
      return `${dico.Week} (${getDayOfWeekName(5, locale)})`;
    case PeriodType.WeekSat:
      return `${dico.Week} (${getDayOfWeekName(6, locale)})`;
    case PeriodType.Week:
      return dico.Week;

    case PeriodType.Month:
      return dico.Month;
    case PeriodType.MonthYear:
      return dico.Month;
    case PeriodType.Quarter:
      return dico.Quarter;
    case PeriodType.CalendarYear:
      return dico.CalendarYear;
    case PeriodType.FiscalYearOctober:
      return dico.FiscalYearOct;

    case PeriodType.BiWeek1Sun:
      return `${dico.BiWeek} (${getDayOfWeekName(0, locale)})`;
    case PeriodType.BiWeek1Mon:
      return `${dico.BiWeek} (${getDayOfWeekName(1, locale)})`;
    case PeriodType.BiWeek1Tue:
      return `${dico.BiWeek} (${getDayOfWeekName(2, locale)})`;
    case PeriodType.BiWeek1Wed:
      return `${dico.BiWeek} (${getDayOfWeekName(3, locale)})`;
    case PeriodType.BiWeek1Thu:
      return `${dico.BiWeek} (${getDayOfWeekName(4, locale)})`;
    case PeriodType.BiWeek1Fri:
      return `${dico.BiWeek} (${getDayOfWeekName(5, locale)})`;
    case PeriodType.BiWeek1Sat:
      return `${dico.BiWeek} (${getDayOfWeekName(6, locale)})`;
    case PeriodType.BiWeek1:
      return dico.BiWeek;

    case PeriodType.BiWeek2Sun:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(0, locale)})`;
    case PeriodType.BiWeek2Mon:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(1, locale)})`;
    case PeriodType.BiWeek2Tue:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(2, locale)})`;
    case PeriodType.BiWeek2Wed:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(3, locale)})`;
    case PeriodType.BiWeek2Thu:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(4, locale)})`;
    case PeriodType.BiWeek2Fri:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(5, locale)})`;
    case PeriodType.BiWeek2Sat:
      return `${dico.BiWeek} 2 (${getDayOfWeekName(6, locale)})`;
    case PeriodType.BiWeek2:
      return `${dico.BiWeek} 2`;

    default:
      assertNever(periodType); // This will now report unhandled cases
  }
}

export function getPeriodTypeCode(periodType: PeriodType): PeriodTypeCode {
  return periodTypeMappings[periodType];
}

export function getPeriodTypeByCode(code: PeriodTypeCode) {
  const element = entries(periodTypeMappings).find((c) => c[1] === code);
  return parseInt(String(element?.[0] ?? '0'));
}

export function getDayOfWeek(periodType: PeriodType): DayOfWeek | null {
  if (
    (periodType >= PeriodType.WeekSun && periodType <= PeriodType.WeekSat) ||
    (periodType >= PeriodType.BiWeek1Sun && periodType <= PeriodType.BiWeek1Sat) ||
    (periodType >= PeriodType.BiWeek2Sun && periodType <= PeriodType.BiWeek2Sat)
  ) {
    return (periodType % 10) - 1;
  } else {
    return null;
  }
}

/** Replace day of week for `periodType`, if applicable */
export function replaceDayOfWeek(periodType: PeriodType, dayOfWeek: DayOfWeek): PeriodType {
  if (hasDayOfWeek(periodType)) {
    return periodType - (getDayOfWeek(periodType) ?? 0) + dayOfWeek;
  } else if (missingDayOfWeek(periodType)) {
    return periodType + dayOfWeek + 1;
  } else {
    return periodType;
  }
}

/** Check if `periodType` has day of week (Sun-Sat) */
export function hasDayOfWeek(periodType: PeriodType) {
  if (periodType >= PeriodType.WeekSun && periodType <= PeriodType.WeekSat) {
    return true;
  }
  if (periodType >= PeriodType.BiWeek1Sun && periodType <= PeriodType.BiWeek1Sat) {
    return true;
  }
  if (periodType >= PeriodType.BiWeek2Sun && periodType <= PeriodType.BiWeek2Sat) {
    return true;
  }

  return false;
}

/** Is `periodType` missing day of week (Sun-Sat) */
export function missingDayOfWeek(periodType: PeriodType) {
  return [PeriodType.Week, PeriodType.BiWeek1, PeriodType.BiWeek2].includes(periodType);
}

export function getMonths(year = new Date().getFullYear()) {
  return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
}

export function getMonthDaysByWeek(
  dateInTheMonth: Date,
  weekStartsOn: DayOfWeek = DayOfWeek.Sunday
): Date[][] {
  const startOfFirstWeek = startOfWeek(startOfInterval('month', dateInTheMonth), weekStartsOn);
  const endOfLastWeek = endOfWeek(endOfInterval('month', dateInTheMonth), weekStartsOn);

  const list = [];

  let valueToAdd = startOfFirstWeek;
  while (valueToAdd <= endOfLastWeek) {
    list.push(valueToAdd);
    valueToAdd = intervalOffset('day', valueToAdd, 1);
  }

  return chunk(list, 7) as Date[][];
}

export function getMinSelectedDate(date: SelectedDate | null | undefined) {
  if (date instanceof Date) {
    return date;
  } else if (date instanceof Array) {
    return min(date);
  } else if (hasKeyOf<{ from: Date }>(date, 'from')) {
    return date.from;
  } else {
    return null;
  }
}

export function getMaxSelectedDate(date: SelectedDate | null | undefined) {
  if (date instanceof Date) {
    return date;
  } else if (date instanceof Array) {
    return max(date);
  } else if (hasKeyOf<{ from: Date }>(date, 'to')) {
    return date.to;
  } else {
    return null;
  }
}

/*
 * Fiscal Year
 */

export function getFiscalYear(date: Date | null = new Date(), options?: { startMonth?: number }) {
  if (date === null) {
    // null explicitly passed in (default value overridden)
    return NaN;
  }

  const startMonth = (options && options.startMonth) || 10;
  return date.getMonth() >= startMonth - 1 ? date.getFullYear() + 1 : date.getFullYear();
}

export function getFiscalYearRange(
  date = new Date(),
  options?: { startMonth?: number; numberOfMonths?: number }
) {
  const fiscalYear = getFiscalYear(date, options);
  const startMonth = (options && options.startMonth) || 10;
  const numberOfMonths = (options && options.numberOfMonths) || 12;

  const startDate = new Date((fiscalYear || 0) - 1, startMonth - 1, 1);
  const endDate = endOfInterval('month', intervalOffset('month', startDate, numberOfMonths - 1));

  return { startDate, endDate };
}

export function startOfFiscalYear(date: Date, options?: Parameters<typeof getFiscalYearRange>[1]) {
  return getFiscalYearRange(date, options).startDate;
}

export function endOfFiscalYear(date: Date, options?: Parameters<typeof getFiscalYearRange>[1]) {
  return getFiscalYearRange(date, options).endDate;
}

export function isSameFiscalYear(dateLeft: Date, dateRight: Date) {
  return getFiscalYear(dateLeft) === getFiscalYear(dateRight);
}

/*
 * Bi-Weekly
 */

const biweekBaseDates = [new Date('1799-12-22T00:00'), new Date('1799-12-15T00:00')];

export function startOfBiWeek(date: Date, week: number, startOfWeek: DayOfWeek) {
  var weekBaseDate = biweekBaseDates[week - 1];
  var baseDate = intervalOffset('day', weekBaseDate, startOfWeek);
  var periodsSince = Math.floor(intervalDifference('day', baseDate, date) / 14);
  return intervalOffset('day', baseDate, periodsSince * 14);
}

export function endOfBiWeek(date: Date, week: number, startOfWeek: DayOfWeek) {
  return intervalOffset('day', startOfBiWeek(date, week, startOfWeek), 13);
}

function startOfWeek(date: Date, weekStartsOn: DayOfWeek) {
  switch (weekStartsOn) {
    case DayOfWeek.Sunday:
      return startOfInterval(timeWeek, date);
    case DayOfWeek.Monday:
      return startOfInterval(timeMonday, date);
    case DayOfWeek.Tuesday:
      return startOfInterval(timeTuesday, date);
    case DayOfWeek.Wednesday:
      return startOfInterval(timeWednesday, date);
    case DayOfWeek.Thursday:
      return startOfInterval(timeThursday, date);
    case DayOfWeek.Friday:
      return startOfInterval(timeFriday, date);
    case DayOfWeek.Saturday:
      return startOfInterval(timeSaturday, date);
  }
}

function endOfWeek(date: Date, weekStartsOn: DayOfWeek) {
  switch (weekStartsOn) {
    case DayOfWeek.Sunday:
      return endOfInterval(timeWeek, date);
    case DayOfWeek.Monday:
      return endOfInterval(timeMonday, date);
    case DayOfWeek.Tuesday:
      return endOfInterval(timeTuesday, date);
    case DayOfWeek.Wednesday:
      return endOfInterval(timeWednesday, date);
    case DayOfWeek.Thursday:
      return endOfInterval(timeThursday, date);
    case DayOfWeek.Friday:
      return endOfInterval(timeFriday, date);
    case DayOfWeek.Saturday:
      return endOfInterval(timeSaturday, date);
  }
}

export function getDateFuncsByPeriodType(
  settings: LocaleSettings,
  periodType: PeriodType | null | undefined
) {
  if (settings) {
    periodType = updatePeriodTypeWithWeekStartsOn(settings.formats.dates.weekStartsOn, periodType);
  }

  switch (periodType) {
    case PeriodType.Day:
      return {
        start: startOfInterval('day'),
        end: endOfInterval('day'),
        add: (date: Date, amount: number) => intervalOffset('day', date, amount),
        difference: intervalDifference('day'),
        isSame: isSameInterval('day'),
      };

    case PeriodType.Week:
    case PeriodType.WeekSun:
      return {
        start: startOfInterval(timeWeek),
        end: endOfInterval(timeWeek),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeWeek),
        isSame: isSameInterval(timeWeek),
      };
    case PeriodType.WeekMon:
      return {
        start: startOfInterval(timeMonday),
        end: endOfInterval(timeMonday),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeMonday),
        isSame: isSameInterval(timeMonday),
      };
    case PeriodType.WeekTue:
      return {
        start: startOfInterval(timeTuesday),
        end: endOfInterval(timeTuesday),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeTuesday),
        isSame: isSameInterval(timeTuesday),
      };
    case PeriodType.WeekWed:
      return {
        start: startOfInterval(timeWednesday),
        end: endOfInterval(timeWednesday),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeWednesday),
        isSame: isSameInterval(timeWednesday),
      };
    case PeriodType.WeekThu:
      return {
        start: startOfInterval(timeThursday),
        end: endOfInterval(timeThursday),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeThursday),
        isSame: isSameInterval(timeThursday),
      };
    case PeriodType.WeekFri:
      return {
        start: startOfInterval(timeFriday),
        end: endOfInterval(timeFriday),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeFriday),
        isSame: isSameInterval(timeFriday),
      };
    case PeriodType.WeekSat:
      return {
        start: startOfInterval(timeSaturday),
        end: endOfInterval(timeSaturday),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount),
        difference: intervalDifference(timeSaturday),
        isSame: isSameInterval(timeSaturday),
      };

    case PeriodType.Month:
      return {
        start: startOfInterval('month'),
        end: endOfInterval('month'),
        add: (date: Date, amount: number) => intervalOffset('month', date, amount),
        difference: intervalDifference('month'),
        isSame: isSameInterval('month'),
      };
    case PeriodType.Quarter:
      return {
        start: startOfInterval('quarter'),
        end: endOfInterval('quarter'),
        add: (date: Date, amount: number) => intervalOffset('quarter', date, amount),
        difference: intervalDifference('quarter'),
        isSame: isSameInterval('quarter'),
      };
    case PeriodType.CalendarYear:
      return {
        start: startOfInterval('year'),
        end: endOfInterval('year'),
        add: (date: Date, amount: number) => intervalOffset('year', date, amount),
        difference: intervalDifference('year'),
        isSame: isSameInterval('year'),
      };
    case PeriodType.FiscalYearOctober:
      return {
        start: startOfFiscalYear,
        end: endOfFiscalYear,
        add: (date: Date, amount: number) => intervalOffset('year', date, amount),
        difference: intervalDifference('year'),
        isSame: isSameFiscalYear,
      };

    // BiWeek 1
    case PeriodType.BiWeek1:
    case PeriodType.BiWeek1Sun:
    case PeriodType.BiWeek1Mon:
    case PeriodType.BiWeek1Tue:
    case PeriodType.BiWeek1Wed:
    case PeriodType.BiWeek1Thu:
    case PeriodType.BiWeek1Fri:
    case PeriodType.BiWeek1Sat:
    // BiWeek 2
    case PeriodType.BiWeek2:
    case PeriodType.BiWeek2Sun:
    case PeriodType.BiWeek2Mon:
    case PeriodType.BiWeek2Tue:
    case PeriodType.BiWeek2Wed:
    case PeriodType.BiWeek2Thu:
    case PeriodType.BiWeek2Fri:
    case PeriodType.BiWeek2Sat: {
      const week = getPeriodTypeCode(periodType).startsWith('BIWEEK1') ? 1 : 2;
      const dayOfWeek = getDayOfWeek(periodType)!;
      return {
        start: (date: Date) => startOfBiWeek(date, week, dayOfWeek),
        end: (date: Date) => endOfBiWeek(date, week, dayOfWeek),
        add: (date: Date, amount: number) => intervalOffset('week', date, amount * 2),
        difference: (dateLeft: Date, dateRight: Date) => {
          // TODO: Use interval based on start of bi-week (sunday, monday, etc)
          return intervalDifference('week', dateLeft, dateRight) / 2;
        },
        isSame: (dateLeft: Date, dateRight: Date) => {
          return isSameInterval(
            'day',
            startOfBiWeek(dateLeft, week, dayOfWeek),
            startOfBiWeek(dateRight, week, dayOfWeek)
          );
        },
      };
    }

    // All cases not handled above
    case PeriodType.Custom:
    case PeriodType.DayTime:
    case PeriodType.TimeOnly:

    case PeriodType.MonthYear:
    case null:
    case undefined:
      // Default to end of day if periodType == null, etc
      return {
        start: startOfInterval('day'),
        end: endOfInterval('day'),
        add: (date: Date, amount: number) => intervalOffset('day', date, amount),
        difference: intervalDifference('day'),
        isSame: isSameInterval('day'),
      };

    default:
      assertNever(periodType); // This will now report unhandled cases
  }
}

export function formatIntl(
  settings: LocaleSettings,
  dt: Date,
  tokens_or_intlOptions: CustomIntlDateTimeFormatOptions
) {
  const {
    locale,
    formats: {
      dates: { ordinalSuffixes: suffixes },
    },
  } = settings;

  function formatIntlOrdinal(formatter: Intl.DateTimeFormat, with_ordinal = false) {
    if (with_ordinal) {
      const rules = new Intl.PluralRules(locale, { type: 'ordinal' });

      const splited = formatter.formatToParts(dt);
      return splited
        .map((c) => {
          if (c.type === 'day') {
            const ordinal = rules.select(parseInt(c.value, 10));
            const suffix = suffixes[ordinal];
            return `${c.value}${suffix}`;
          }
          return c.value;
        })
        .join('');
    }

    return formatter.format(dt);
  }

  if (typeof tokens_or_intlOptions !== 'string' && !Array.isArray(tokens_or_intlOptions)) {
    return formatIntlOrdinal(
      new Intl.DateTimeFormat(locale, tokens_or_intlOptions),
      tokens_or_intlOptions.withOrdinal
    );
  }

  const tokens = Array.isArray(tokens_or_intlOptions)
    ? tokens_or_intlOptions.join('')
    : tokens_or_intlOptions;

  // Order of includes check is important! (longest first)
  const formatter = new Intl.DateTimeFormat(locale, {
    year: tokens.includes(DateToken.Year_numeric)
      ? 'numeric'
      : tokens.includes(DateToken.Year_2Digit)
        ? '2-digit'
        : undefined,

    month: tokens.includes(DateToken.Month_long)
      ? 'long'
      : tokens.includes(DateToken.Month_short)
        ? 'short'
        : tokens.includes(DateToken.Month_2Digit)
          ? '2-digit'
          : tokens.includes(DateToken.Month_numeric)
            ? 'numeric'
            : undefined,

    day: tokens.includes(DateToken.DayOfMonth_2Digit)
      ? '2-digit'
      : tokens.includes(DateToken.DayOfMonth_numeric)
        ? 'numeric'
        : undefined,

    hour: tokens.includes(DateToken.Hour_2Digit)
      ? '2-digit'
      : tokens.includes(DateToken.Hour_numeric)
        ? 'numeric'
        : undefined,
    hour12: tokens.includes(DateToken.Hour_woAMPM)
      ? false
      : tokens.includes(DateToken.Hour_wAMPM)
        ? true
        : undefined,

    minute: tokens.includes(DateToken.Minute_2Digit)
      ? '2-digit'
      : tokens.includes(DateToken.Minute_numeric)
        ? 'numeric'
        : undefined,

    second: tokens.includes(DateToken.Second_2Digit)
      ? '2-digit'
      : tokens.includes(DateToken.Second_numeric)
        ? 'numeric'
        : undefined,

    fractionalSecondDigits: tokens.includes(DateToken.MiliSecond_3) ? 3 : undefined,

    weekday: tokens.includes(DateToken.DayOfWeek_narrow)
      ? 'narrow'
      : tokens.includes(DateToken.DayOfWeek_long)
        ? 'long'
        : tokens.includes(DateToken.DayOfWeek_short)
          ? 'short'
          : undefined,
  });

  return formatIntlOrdinal(formatter, tokens.includes(DateToken.DayOfMonth_withOrdinal));
}

function range(
  settings: LocaleSettings,
  date: Date,
  weekStartsOn: DayOfWeek,
  formatToUse: CustomIntlDateTimeFormatOptions,
  biWeek: undefined | 1 | 2 = undefined // undefined means that it's not a bi-week
) {
  const start =
    biWeek === undefined
      ? startOfWeek(date, weekStartsOn)
      : startOfBiWeek(date, biWeek, weekStartsOn);
  const end =
    biWeek === undefined ? endOfWeek(date, weekStartsOn) : endOfBiWeek(date, biWeek, weekStartsOn);

  return formatIntl(settings, start, formatToUse) + ' - ' + formatIntl(settings, end, formatToUse);
}

export function formatDate(
  date: Date | string | null | undefined,
  periodType: PeriodType | PeriodTypeCode,
  options: FormatDateOptions = {}
): string {
  return formatDateWithLocale(defaultLocale, date, periodType, options);
}

export function updatePeriodTypeWithWeekStartsOn(
  weekStartsOn: DayOfWeek,
  periodType: PeriodType | null | undefined
) {
  if (periodType === PeriodType.Week) {
    periodType = [
      PeriodType.WeekSun,
      PeriodType.WeekMon,
      PeriodType.WeekTue,
      PeriodType.WeekWed,
      PeriodType.WeekThu,
      PeriodType.WeekFri,
      PeriodType.WeekSat,
    ][weekStartsOn];
  } else if (periodType === PeriodType.BiWeek1) {
    periodType = [
      PeriodType.BiWeek1Sun,
      PeriodType.BiWeek1Mon,
      PeriodType.BiWeek1Tue,
      PeriodType.BiWeek1Wed,
      PeriodType.BiWeek1Thu,
      PeriodType.BiWeek1Fri,
      PeriodType.BiWeek1Sat,
    ][weekStartsOn];
  } else if (periodType === PeriodType.BiWeek2) {
    periodType = [
      PeriodType.BiWeek2Sun,
      PeriodType.BiWeek2Mon,
      PeriodType.BiWeek2Tue,
      PeriodType.BiWeek2Wed,
      PeriodType.BiWeek2Thu,
      PeriodType.BiWeek2Fri,
      PeriodType.BiWeek2Sat,
    ][weekStartsOn];
  }

  return periodType;
}

export function formatDateWithLocale(
  settings: LocaleSettings,
  date: Date | string | null | undefined,
  periodType: PeriodType | PeriodTypeCode,
  options: FormatDateOptions = {}
): string {
  if (typeof date === 'string') {
    date = parseDate(date);
  }

  // Handle 'Invalid Date'
  // @ts-expect-error - Date is a number (see: https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript)
  if (date == null || isNaN(date)) {
    return '';
  }

  const weekStartsOn = options.weekStartsOn ?? settings.formats.dates.weekStartsOn;

  const { day, dayTime, timeOnly, week, month, monthsYear, year } = settings.formats.dates.presets;

  periodType =
    typeof periodType === 'string'
      ? getPeriodTypeByCode(periodType)
      : ((periodType ?? PeriodType.Day) as PeriodType);

  periodType = updatePeriodTypeWithWeekStartsOn(weekStartsOn, periodType) ?? periodType;

  /** Resolve a preset given the chosen variant */
  function rv(preset: DateFormatVariantPreset) {
    if (options.variant === 'custom') {
      return options.custom ?? preset.default;
    } else if (options.custom && !options.variant) {
      return options.custom;
    }

    return preset[options.variant ?? 'default'];
  }

  switch (periodType) {
    case PeriodType.Custom:
      return formatIntl(settings, date, options.custom!);

    case PeriodType.Day:
      return formatIntl(settings, date, rv(day!)!);

    case PeriodType.DayTime:
      return formatIntl(settings, date, rv(dayTime!)!);

    case PeriodType.TimeOnly:
      return formatIntl(settings, date, rv(timeOnly!)!);

    case PeriodType.Week: //Should never happen, but to make types happy
    case PeriodType.WeekSun:
      return range(settings, date, 0, rv(week!)!);
    case PeriodType.WeekMon:
      return range(settings, date, 1, rv(week!)!);
    case PeriodType.WeekTue:
      return range(settings, date, 2, rv(week!)!);
    case PeriodType.WeekWed:
      return range(settings, date, 3, rv(week!)!);
    case PeriodType.WeekThu:
      return range(settings, date, 4, rv(week!)!);
    case PeriodType.WeekFri:
      return range(settings, date, 5, rv(week!)!);
    case PeriodType.WeekSat:
      return range(settings, date, 6, rv(week!)!);

    case PeriodType.Month:
      return formatIntl(settings, date, rv(month!)!);

    case PeriodType.MonthYear:
      return formatIntl(settings, date, rv(monthsYear!)!);

    case PeriodType.Quarter:
      return [
        formatIntl(settings, startOfInterval('quarter', date), rv(month!)!),
        formatIntl(settings, endOfInterval('quarter', date), rv(monthsYear!)!),
      ].join(' - ');

    case PeriodType.CalendarYear:
      return formatIntl(settings, date, rv(year!)!);

    case PeriodType.FiscalYearOctober:
      const fDate = new Date(getFiscalYear(date), 0, 1);
      return formatIntl(settings, fDate, rv(year!)!);

    case PeriodType.BiWeek1: //Should never happen, but to make types happy
    case PeriodType.BiWeek1Sun:
      return range(settings, date, 0, rv(week!)!, 1);
    case PeriodType.BiWeek1Mon:
      return range(settings, date, 1, rv(week!)!, 1);
    case PeriodType.BiWeek1Tue:
      return range(settings, date, 2, rv(week!)!, 1);
    case PeriodType.BiWeek1Wed:
      return range(settings, date, 3, rv(week!)!, 1);
    case PeriodType.BiWeek1Thu:
      return range(settings, date, 4, rv(week!)!, 1);
    case PeriodType.BiWeek1Fri:
      return range(settings, date, 5, rv(week!)!, 1);
    case PeriodType.BiWeek1Sat:
      return range(settings, date, 6, rv(week!)!, 1);

    case PeriodType.BiWeek2: //Should never happen, but to make types happy
    case PeriodType.BiWeek2Sun:
      return range(settings, date, 0, rv(week!)!, 2);
    case PeriodType.BiWeek2Mon:
      return range(settings, date, 1, rv(week!)!, 2);
    case PeriodType.BiWeek2Tue:
      return range(settings, date, 2, rv(week!)!, 2);
    case PeriodType.BiWeek2Wed:
      return range(settings, date, 3, rv(week!)!, 2);
    case PeriodType.BiWeek2Thu:
      return range(settings, date, 4, rv(week!)!, 2);
    case PeriodType.BiWeek2Fri:
      return range(settings, date, 5, rv(week!)!, 2);
    case PeriodType.BiWeek2Sat:
      return range(settings, date, 6, rv(week!)!, 2);

    default:
      return date.toISOString();
    // default:
    //   assertNever(periodType); // This will now report unhandled cases
  }
}

/**
 * Return new Date using UTC date/time as local date/time
 */
export function utcToLocalDate(date: Date | string | null | undefined) {
  date = date instanceof Date ? date : typeof date === 'string' ? new Date(date) : new Date();

  // https://github.com/date-fns/date-fns/issues/376#issuecomment-454163253
  // return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const d = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  d.setUTCFullYear(date.getUTCFullYear());
  return d;
}

/**
 * Return new Date using local date/time as UTC date/time
 */
export function localToUtcDate(date: Date | string | null | undefined) {
  date = date instanceof Date ? date : typeof date === 'string' ? new Date(date) : new Date();

  // return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

  const d = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
  return d;
}

/**
 * Generate a random Date between `from` and `to` (exclusive)
 */
export function randomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

// '1982-03-30'
// '1982-03-30T04:00'
// '1982-03-30T04:00:00'
// '1982-03-30T11:25:59Z'
// '1982-03-30T11:25:59-04:00'
// '1982-03-30T11:25:59.123Z'
// '1982-03-30T11:25:59.1234567Z'
const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+|)?(Z|(-|\+)\d{2}:\d{2}?)?)?)?$/;

/**
 * Determine if string is valid date string
 * - Date-only (yyyy-mm-dd)
 * - Date with time (yyyy-mm-ddThh:mm:ss)
 * - Date with time and timezone (yyyy-mm-ddThh:mm:ssZ)
 * - Date with time and offset (yyyy-mm-ddThh:mm:ss-ZZ:ZZ)
 * - Date with time and 3 digit milliseconds (yyyy-mm-ddThh:mm:ss.sss) with or without timezone / offset
 * - Date with time and 7 digit milliseconds (yyyy-mm-ddThh:mm:ss.sssssss) with or without timezone / offset
 */
export function isStringDate(value: string) {
  return DATE_FORMAT.test(value);
}

/**
 * Determine if string is a date string with time (yyyy-mm-ddThh:mm:ss)
 */
export function isStringDateWithTime(value: string) {
  return isStringDate(value) && value.includes('T');
}

/**
 * Determine if string is a date string with time and timezone (yyyy-mm-ddThh:mm:ssZ) or Offset (yyyy-mm-ddThh:mm:ss-ZZ:ZZ)
 */
export function isStringDateWithTimezone(value: string) {
  return isStringDateWithTime(value) && /Z$|[+-]\d{2}:\d{2}$/.test(value);
}

/** Parse a date string as a local Date if no timezone is specified
 * @param dateStr - The date string to parse
 * @param format - The format of the date string. If not provided, expects ISO 8601 format.
 *   - If provided, will use the format to parse the date string.
 *   - Supports Unicode or strftime date format strings, but will be converted to applicable strftime format before parsing.
 * @returns A Date object
 */
export function parseDate(dateStr: string, format?: string) {
  if (format) {
    if (format.includes('%')) {
      // strftime format
      return timeParse(format)(dateStr) ?? new Date('Invalid Date');
    } else {
      // Unicode format, convert to strftime format
      const strftimeFormat = convertUnicodeToStrftime(format);
      console.log({ format, strftimeFormat });
      return timeParse(strftimeFormat)(dateStr) ?? new Date('Invalid Date');
    }
  }

  if (!isStringDate(dateStr)) return new Date('Invalid Date');

  if (isStringDateWithTime(dateStr)) {
    // Respect timezone.  Also parses unqualified strings like '1982-03-30T04:00' as local date
    return new Date(dateStr);
  }

  const [date, time] = dateStr.split('T');
  const [year, month, day] = date.split('-').map(Number);

  if (time) {
    const [hour, minute, second] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  } else {
    return new Date(year, month - 1, day);
  }
}

/** Custom time interval for quarters */
export const timeQuarter = d3TimeInterval(
  // floor
  (date) => {
    date.setMonth(date.getMonth() - (date.getMonth() % 3), 1);
    date.setHours(0, 0, 0, 0);
  },
  // offset
  (date, step) => date.setMonth(date.getMonth() + step * 3, 1),
  // count
  (start, end) => (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30 * 3),
  // field
  (date) => date.getMonth() // TODO: what should this be?
);

/** Get a time interval function by name */
export function timeInterval(name: TimeIntervalType) {
  switch (name) {
    case 'millisecond':
      return timeMillisecond;
    case 'second':
      return timeSecond;
    case 'minute':
      return timeMinute;
    case 'hour':
      return timeHour;
    case 'day':
      return timeDay;
    case 'week':
      return timeWeek;
    case 'month':
      return timeMonth;
    case 'quarter':
      return timeQuarter;
    case 'year':
      return timeYear;
  }
}

/**
 * Get the date at the start of the interval
 * @param interval The time interval to use
 * @param date Optional date to get start of interval for. If not provided, returns a function that takes a date.
 * @returns Either a Date or a function that takes a date and returns a Date
 */
export function startOfInterval(interval: TimeInterval | TimeIntervalType, date: Date): Date;
export function startOfInterval(interval: TimeInterval | TimeIntervalType): (date: Date) => Date;
export function startOfInterval(
  interval: TimeInterval | TimeIntervalType,
  date?: Date
): Date | ((date: Date) => Date) {
  interval = typeof interval === 'string' ? timeInterval(interval) : interval;

  if (date === undefined) {
    return (date: Date) => new Date(interval.floor(date));
  }

  return new Date(interval.floor(date));
}

/**
 * Get the date at the end of the interval
 * Similar to `interval.ceil(date)` except:
 *   - returns end of day instead of start of next day
 *   - properly handles start of day (i.e. not return same date)
 * @param interval The time interval to use
 * @param date Optional date to get end of interval for. If not provided, returns a function that takes a date.
 * @returns Either a Date or a function that takes a date and returns a Date
 */
export function endOfInterval(interval: TimeInterval | TimeIntervalType, date: Date): Date;
export function endOfInterval(interval: TimeInterval | TimeIntervalType): (date: Date) => Date;
export function endOfInterval(
  interval: TimeInterval | TimeIntervalType,
  date?: Date
): Date | ((date: Date) => Date) {
  interval = typeof interval === 'string' ? timeInterval(interval) : interval;

  if (date === undefined) {
    return (date: Date) => new Date(interval.offset(interval.floor(date), 1).getTime() - 1);
  }

  // Can not use `new Date(+interval.ceil(date) - 1)`; as `.ceil()` will return same date when start of the day (matching `.floor()`)
  return new Date(interval.offset(interval.floor(date), 1).getTime() - 1);
}

/** Add or subtract an interval from a date */
export function intervalOffset(
  interval: TimeInterval | TimeIntervalType,
  date: Date,
  offset: number
) {
  interval = typeof interval === 'string' ? timeInterval(interval) : interval;
  return interval.offset(date, offset);
}

/** Check if two dates are in the same interval (such as same day or month) */
export function isSameInterval(
  interval: TimeInterval | TimeIntervalType,
  date1: Date,
  date2: Date
): boolean;
export function isSameInterval(
  interval: TimeInterval | TimeIntervalType
): (date1: Date, date2: Date) => boolean;
export function isSameInterval(
  interval: TimeInterval | TimeIntervalType,
  date1?: Date,
  date2?: Date
) {
  interval = typeof interval === 'string' ? timeInterval(interval) : interval;

  if (date1 === undefined || date2 === undefined) {
    return (date1: Date, date2: Date) =>
      interval.floor(date1).getTime() === interval.floor(date2).getTime();
  }

  return interval.floor(date1).getTime() === interval.floor(date2).getTime();
}

/** Get the number of intervals between two dates (based on boundaries crossed) */
export function intervalDifference(
  interval: CountableTimeInterval | TimeIntervalType,
  date1: Date,
  date2: Date
): number;
export function intervalDifference(
  interval: CountableTimeInterval | TimeIntervalType
): (date1: Date, date2: Date) => number;
export function intervalDifference(
  interval: CountableTimeInterval | TimeIntervalType,
  date1?: Date,
  date2?: Date
) {
  interval = typeof interval === 'string' ? timeInterval(interval) : interval;

  if (date1 === undefined || date2 === undefined) {
    return (date1: Date, date2: Date) => interval.count(date1, date2);
  }

  return interval.count(date1, date2);
}

/** Check if date is a leap year */
export function isLeapYear(date: Date) {
  return (
    date.getFullYear() % 400 === 0 ||
    (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0)
  );
}

/** Check if first date is before second date */
export function isDateBefore(date1: Date, date2: Date) {
  return date1.getTime() < date2.getTime();
}

/** Check if first date is after second date */
export function isDateAfter(date1: Date, date2: Date) {
  return date1.getTime() > date2.getTime();
}

/** Check if date is within interval */
export function isDateWithin(date: Date, range: { start: Date; end: Date }) {
  return date.getTime() >= range.start.getTime() && date.getTime() <= range.end.getTime();
}
