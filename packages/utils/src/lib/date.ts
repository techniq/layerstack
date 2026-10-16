import {
  type CountableTimeInterval,
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
  utcDay,
  utcFriday,
  utcHour,
  utcMillisecond,
  utcMinute,
  utcMonday,
  utcMonth,
  utcSaturday,
  utcSecond,
  utcThursday,
  utcTuesday,
  utcWednesday,
  utcWeek,
  utcYear,
} from 'd3-time';
import { timeFormat, timeParse, utcFormat } from 'd3-time-format';
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
  type PeriodTypeCode,
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

    case PeriodType.Hour:
      return dico.Hour;
    case PeriodType.Minute:
      return dico.Minute;
    case PeriodType.Second:
      return dico.Second;
    case PeriodType.Millisecond:
      return dico.Millisecond;

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
  weekStartsOn: DayOfWeek = DayOfWeek.Sunday,
  options?: { utc?: boolean }
): Date[][] {
  const monthInterval = options?.utc ? 'utcMonth' : 'month';
  const dayInterval = options?.utc ? 'utcDay' : 'day';

  const startOfFirstWeek = startOfWeek(
    startOfInterval(monthInterval, dateInTheMonth),
    weekStartsOn,
    options
  );
  const endOfLastWeek = endOfWeek(
    endOfInterval(monthInterval, dateInTheMonth),
    weekStartsOn,
    options
  );

  const list = [];

  let valueToAdd = startOfFirstWeek;
  while (valueToAdd <= endOfLastWeek) {
    list.push(valueToAdd);
    valueToAdd = intervalOffset(dayInterval, valueToAdd, 1);
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

export function getFiscalYear(
  date: Date | null = new Date(),
  options?: { startMonth?: number; utc?: boolean }
) {
  if (date === null) {
    // null explicitly passed in (default value overridden)
    return NaN;
  }

  const startMonth = (options && options.startMonth) || 10;
  const month = options?.utc ? date.getUTCMonth() : date.getMonth();
  const year = options?.utc ? date.getUTCFullYear() : date.getFullYear();
  return month >= startMonth - 1 ? year + 1 : year;
}

export function getFiscalYearRange(
  date = new Date(),
  options?: { startMonth?: number; numberOfMonths?: number; utc?: boolean }
) {
  const fiscalYear = getFiscalYear(date, options);
  const startMonth = (options && options.startMonth) || 10;
  const numberOfMonths = (options && options.numberOfMonths) || 12;
  const utc = options?.utc ?? false;

  const startDate = utc
    ? new Date(Date.UTC((fiscalYear || 0) - 1, startMonth - 1, 1))
    : new Date((fiscalYear || 0) - 1, startMonth - 1, 1);
  const monthInterval = utc ? 'utcMonth' : 'month';
  const endDate = endOfInterval(
    monthInterval,
    intervalOffset(monthInterval, startDate, numberOfMonths - 1)
  );

  return { startDate, endDate };
}

export function startOfFiscalYear(date: Date, options?: Parameters<typeof getFiscalYearRange>[1]) {
  return getFiscalYearRange(date, options).startDate;
}

export function endOfFiscalYear(date: Date, options?: Parameters<typeof getFiscalYearRange>[1]) {
  return getFiscalYearRange(date, options).endDate;
}

export function isSameFiscalYear(
  dateLeft: Date,
  dateRight: Date,
  options?: Parameters<typeof getFiscalYear>[1]
) {
  return getFiscalYear(dateLeft, options) === getFiscalYear(dateRight, options);
}

/*
 * Bi-Weekly
 */

const biweekBaseDates = [new Date('1799-12-22T00:00'), new Date('1799-12-15T00:00')];
/** UTC counterparts of `biweekBaseDates` (the strings above parse as *local* midnight) */
const utcBiweekBaseDates = [new Date(Date.UTC(1799, 11, 22)), new Date(Date.UTC(1799, 11, 15))];

export function startOfBiWeek(
  date: Date,
  week: number,
  startOfWeek: DayOfWeek,
  options?: { utc?: boolean }
) {
  const dayInterval = options?.utc ? 'utcDay' : 'day';
  const weekBaseDate = (options?.utc ? utcBiweekBaseDates : biweekBaseDates)[week - 1];
  const baseDate = intervalOffset(dayInterval, weekBaseDate, startOfWeek);
  const periodsSince = Math.floor(intervalDifference(dayInterval, baseDate, date) / 14);
  return intervalOffset(dayInterval, baseDate, periodsSince * 14);
}

export function endOfBiWeek(
  date: Date,
  week: number,
  startOfWeek: DayOfWeek,
  options?: { utc?: boolean }
) {
  return intervalOffset(
    options?.utc ? 'utcDay' : 'day',
    startOfBiWeek(date, week, startOfWeek, options),
    13
  );
}

/** The d3 interval for a week beginning on `weekStartsOn`, local or UTC */
function weekInterval(weekStartsOn: DayOfWeek, utc = false) {
  switch (weekStartsOn) {
    case DayOfWeek.Sunday:
      return utc ? utcWeek : timeWeek;
    case DayOfWeek.Monday:
      return utc ? utcMonday : timeMonday;
    case DayOfWeek.Tuesday:
      return utc ? utcTuesday : timeTuesday;
    case DayOfWeek.Wednesday:
      return utc ? utcWednesday : timeWednesday;
    case DayOfWeek.Thursday:
      return utc ? utcThursday : timeThursday;
    case DayOfWeek.Friday:
      return utc ? utcFriday : timeFriday;
    case DayOfWeek.Saturday:
      return utc ? utcSaturday : timeSaturday;
  }
}

function startOfWeek(date: Date, weekStartsOn: DayOfWeek, options?: { utc?: boolean }) {
  return startOfInterval(weekInterval(weekStartsOn, options?.utc), date);
}

function endOfWeek(date: Date, weekStartsOn: DayOfWeek, options?: { utc?: boolean }) {
  return endOfInterval(weekInterval(weekStartsOn, options?.utc), date);
}

/**
 * Get the start/end/add/difference/isSame functions for a period type.
 *
 * @param options.utc Operate on UTC boundaries instead of local ones, so results are
 *   unaffected by the ambient timezone or by DST. Note this changes only the *math* — pair it
 *   with `utc` on `formatDate()` to also render the UTC calendar fields.
 */
export function getDateFuncsByPeriodType(
  settings: LocaleSettings,
  periodType: PeriodType | null | undefined,
  options?: { utc?: boolean }
) {
  if (settings) {
    periodType = updatePeriodTypeWithWeekStartsOn(settings.formats.dates.weekStartsOn, periodType);
  }

  const utc = options?.utc ?? false;
  const dayInterval = utc ? 'utcDay' : 'day';
  const weekIntervalName = utc ? 'utcWeek' : 'week';
  const monthInterval = utc ? 'utcMonth' : 'month';
  const quarterInterval = utc ? 'utcQuarter' : 'quarter';
  const yearInterval = utc ? 'utcYear' : 'year';

  switch (periodType) {
    case PeriodType.Day:
      return {
        start: startOfInterval(dayInterval),
        end: endOfInterval(dayInterval),
        add: (date: Date, amount: number) => intervalOffset(dayInterval, date, amount),
        difference: intervalDifference(dayInterval),
        isSame: isSameInterval(dayInterval),
      };

    case PeriodType.Week:
    case PeriodType.WeekSun:
    case PeriodType.WeekMon:
    case PeriodType.WeekTue:
    case PeriodType.WeekWed:
    case PeriodType.WeekThu:
    case PeriodType.WeekFri:
    case PeriodType.WeekSat: {
      // `PeriodType.Week` has no day of week of its own — it only reaches here when `settings`
      // is absent (so `updatePeriodTypeWithWeekStartsOn` did not resolve it), and the previous
      // behaviour was to fall through to Sunday.
      const interval = weekInterval(getDayOfWeek(periodType) ?? DayOfWeek.Sunday, utc);
      return {
        start: startOfInterval(interval),
        end: endOfInterval(interval),
        add: (date: Date, amount: number) => intervalOffset(weekIntervalName, date, amount),
        difference: intervalDifference(interval),
        isSame: isSameInterval(interval),
      };
    }

    case PeriodType.Month:
      return {
        start: startOfInterval(monthInterval),
        end: endOfInterval(monthInterval),
        add: (date: Date, amount: number) => intervalOffset(monthInterval, date, amount),
        difference: intervalDifference(monthInterval),
        isSame: isSameInterval(monthInterval),
      };
    case PeriodType.Quarter:
      return {
        start: startOfInterval(quarterInterval),
        end: endOfInterval(quarterInterval),
        add: (date: Date, amount: number) => intervalOffset(quarterInterval, date, amount),
        difference: intervalDifference(quarterInterval),
        isSame: isSameInterval(quarterInterval),
      };
    case PeriodType.CalendarYear:
      return {
        start: startOfInterval(yearInterval),
        end: endOfInterval(yearInterval),
        add: (date: Date, amount: number) => intervalOffset(yearInterval, date, amount),
        difference: intervalDifference(yearInterval),
        isSame: isSameInterval(yearInterval),
      };
    case PeriodType.FiscalYearOctober:
      return {
        start: (date: Date) => startOfFiscalYear(date, { utc }),
        end: (date: Date) => endOfFiscalYear(date, { utc }),
        add: (date: Date, amount: number) => intervalOffset(yearInterval, date, amount),
        difference: intervalDifference(yearInterval),
        isSame: (dateLeft: Date, dateRight: Date) => isSameFiscalYear(dateLeft, dateRight, { utc }),
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
        start: (date: Date) => startOfBiWeek(date, week, dayOfWeek, { utc }),
        end: (date: Date) => endOfBiWeek(date, week, dayOfWeek, { utc }),
        add: (date: Date, amount: number) => intervalOffset(weekIntervalName, date, amount * 2),
        difference: (dateLeft: Date, dateRight: Date) => {
          // TODO: Use interval based on start of bi-week (sunday, monday, etc)
          return intervalDifference(weekIntervalName, dateLeft, dateRight) / 2;
        },
        isSame: (dateLeft: Date, dateRight: Date) => {
          return isSameInterval(
            dayInterval,
            startOfBiWeek(dateLeft, week, dayOfWeek, { utc }),
            startOfBiWeek(dateRight, week, dayOfWeek, { utc })
          );
        },
      };
    }

    // All cases not handled above
    case PeriodType.Custom:
    case PeriodType.DayTime:
    case PeriodType.TimeOnly:
    case PeriodType.Hour:
    case PeriodType.Minute:
    case PeriodType.Second:
    case PeriodType.Millisecond:

    case PeriodType.MonthYear:
    case null:
    case undefined:
      // Default to end of day if periodType == null, etc
      return {
        start: startOfInterval(dayInterval),
        end: endOfInterval(dayInterval),
        add: (date: Date, amount: number) => intervalOffset(dayInterval, date, amount),
        difference: intervalDifference(dayInterval),
        isSame: isSameInterval(dayInterval),
      };

    default:
      assertNever(periodType); // This will now report unhandled cases
  }
}

/**
 * Format a date with `Intl.DateTimeFormat`.
 *
 * @param options.utc Render the date's UTC calendar fields rather than the local ones. An
 *   explicit `timeZone` in `tokens_or_intlOptions` takes precedence.
 */
export function formatIntl(
  settings: LocaleSettings,
  dt: Date,
  tokens_or_intlOptions: CustomIntlDateTimeFormatOptions,
  options?: { utc?: boolean }
) {
  const {
    locale,
    formats: {
      dates: { ordinalSuffixes: suffixes },
    },
  } = settings;

  const timeZone = options?.utc ? 'UTC' : undefined;

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
      new Intl.DateTimeFormat(locale, {
        timeZone,
        ...tokens_or_intlOptions,
      }),
      tokens_or_intlOptions.withOrdinal
    );
  }

  const tokens = Array.isArray(tokens_or_intlOptions)
    ? tokens_or_intlOptions.join('')
    : tokens_or_intlOptions;

  // Order of includes check is important! (longest first)
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,

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
  biWeek: undefined | 1 | 2 = undefined, // undefined means that it's not a bi-week
  options?: { utc?: boolean }
) {
  const start =
    biWeek === undefined
      ? startOfWeek(date, weekStartsOn, options)
      : startOfBiWeek(date, biWeek, weekStartsOn, options);
  const end =
    biWeek === undefined
      ? endOfWeek(date, weekStartsOn, options)
      : endOfBiWeek(date, biWeek, weekStartsOn, options);

  return (
    formatIntl(settings, start, formatToUse, options) +
    ' - ' +
    formatIntl(settings, end, formatToUse, options)
  );
}

export function formatDate(
  date: Date | string | null | undefined,
  periodOrFormat: PeriodType | PeriodTypeCode | string,
  options: FormatDateOptions = {}
): string {
  if (typeof periodOrFormat === 'string' && !getPeriodTypeByCode(periodOrFormat as any)) {
    if (!date) {
      return '';
    } else if (typeof date === 'string') {
      // If periodOrFormat is string, treat as unicode/strftime format
      date = parseDate(date);
    }

    let strftimeFormat = periodOrFormat;
    if (!periodOrFormat.includes('%')) {
      // Unicode format, convert to strftime format
      strftimeFormat = convertUnicodeToStrftime(periodOrFormat);
      // console.log({ periodOrFormat, strftimeFormat });
    }

    return options.utc ? utcFormat(strftimeFormat)(date) : timeFormat(strftimeFormat)(date);
  }

  return formatDateWithLocale(
    defaultLocale,
    date,
    periodOrFormat as PeriodType | PeriodTypeCode,
    options
  );
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

  const {
    day,
    dayTime,
    timeOnly,
    hour,
    minute,
    second,
    millisecond,
    week,
    month,
    monthsYear,
    year,
  } = settings.formats.dates.presets;

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

  // Bound to a local so the narrowing above survives into the closures below (`date` is a
  // reassigned parameter). `fmt`/`rng` exist to carry `utc` into every branch of the switch.
  const dt = date;
  const utcOptions = { utc: options.utc };
  const fmt = (value: Date, format: CustomIntlDateTimeFormatOptions) =>
    formatIntl(settings, value, format, utcOptions);
  const rng = (weekStartsOn: DayOfWeek, format: CustomIntlDateTimeFormatOptions, biWeek?: 1 | 2) =>
    range(settings, dt, weekStartsOn, format, biWeek, utcOptions);

  switch (periodType) {
    case PeriodType.Custom:
      return fmt(date, options.custom!);

    case PeriodType.Day:
      return fmt(date, rv(day!)!);

    case PeriodType.DayTime:
      return fmt(date, rv(dayTime!)!);

    case PeriodType.TimeOnly:
      return fmt(date, rv(timeOnly!)!);

    case PeriodType.Hour:
      return fmt(date, rv(hour!)!);

    case PeriodType.Minute:
      return fmt(date, rv(minute!)!);

    case PeriodType.Second:
      return fmt(date, rv(second!)!);

    case PeriodType.Millisecond:
      return fmt(date, rv(millisecond!)!);

    case PeriodType.Week: //Should never happen, but to make types happy
    case PeriodType.WeekSun:
      return rng(0, rv(week!)!);
    case PeriodType.WeekMon:
      return rng(1, rv(week!)!);
    case PeriodType.WeekTue:
      return rng(2, rv(week!)!);
    case PeriodType.WeekWed:
      return rng(3, rv(week!)!);
    case PeriodType.WeekThu:
      return rng(4, rv(week!)!);
    case PeriodType.WeekFri:
      return rng(5, rv(week!)!);
    case PeriodType.WeekSat:
      return rng(6, rv(week!)!);

    case PeriodType.Month:
      return fmt(date, rv(month!)!);

    case PeriodType.MonthYear:
      return fmt(date, rv(monthsYear!)!);

    case PeriodType.Quarter:
      return [
        fmt(startOfInterval(options.utc ? 'utcQuarter' : 'quarter', date), rv(month!)!),
        fmt(endOfInterval(options.utc ? 'utcQuarter' : 'quarter', date), rv(monthsYear!)!),
      ].join(' - ');

    case PeriodType.CalendarYear:
      return fmt(date, rv(year!)!);

    case PeriodType.FiscalYearOctober:
      const fiscalYear = getFiscalYear(date, utcOptions);
      const fDate = options.utc ? new Date(Date.UTC(fiscalYear, 0, 1)) : new Date(fiscalYear, 0, 1);
      return fmt(fDate, rv(year!)!);

    case PeriodType.BiWeek1: //Should never happen, but to make types happy
    case PeriodType.BiWeek1Sun:
      return rng(0, rv(week!)!, 1);
    case PeriodType.BiWeek1Mon:
      return rng(1, rv(week!)!, 1);
    case PeriodType.BiWeek1Tue:
      return rng(2, rv(week!)!, 1);
    case PeriodType.BiWeek1Wed:
      return rng(3, rv(week!)!, 1);
    case PeriodType.BiWeek1Thu:
      return rng(4, rv(week!)!, 1);
    case PeriodType.BiWeek1Fri:
      return rng(5, rv(week!)!, 1);
    case PeriodType.BiWeek1Sat:
      return rng(6, rv(week!)!, 1);

    case PeriodType.BiWeek2: //Should never happen, but to make types happy
    case PeriodType.BiWeek2Sun:
      return rng(0, rv(week!)!, 2);
    case PeriodType.BiWeek2Mon:
      return rng(1, rv(week!)!, 2);
    case PeriodType.BiWeek2Tue:
      return rng(2, rv(week!)!, 2);
    case PeriodType.BiWeek2Wed:
      return rng(3, rv(week!)!, 2);
    case PeriodType.BiWeek2Thu:
      return rng(4, rv(week!)!, 2);
    case PeriodType.BiWeek2Fri:
      return rng(5, rv(week!)!, 2);
    case PeriodType.BiWeek2Sat:
      return rng(6, rv(week!)!, 2);

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
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
  // `new Date(year, ...)` maps years 0-99 onto 1900-1999; restore the intended year.
  // Must be `setFullYear`, not `setUTCFullYear`: `d` was built from *local* fields, so near a
  // year boundary its UTC year differs from its local year and setting the UTC one shifts the
  // date by a full year (e.g. `2024-01-01T00:00Z` -> Jan 1 2025 in Asia/Tokyo, and
  // `2026-12-31T23:59:59.999Z` -> Dec 31 2025 in America/New_York).
  d.setFullYear(date.getUTCFullYear());
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
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
  // `Date.UTC` applies the same 0-99 year mapping as `new Date(year, ...)`. Here `d` is built
  // from UTC fields, so `setUTCFullYear` is the correct counterpart to `utcToLocalDate`.
  d.setUTCFullYear(date.getFullYear());
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
  // If format is provided, use it to parse the date string
  if (format) {
    let strftimeFormat = format;
    if (!format.includes('%')) {
      // Unicode format, convert to strftime format
      strftimeFormat = convertUnicodeToStrftime(format);
      // console.log({ format, strftimeFormat });
    }

    return timeParse(strftimeFormat)(dateStr) ?? new Date('Invalid Date');
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

/**
 * Custom time interval for quarters, in UTC.
 *
 * The UTC counterpart of {@link timeQuarter} — d3-time has no quarter interval of either
 * kind, so this mirrors the local implementation using the UTC accessors.
 */
export const utcQuarter = d3TimeInterval(
  // floor
  (date) => {
    date.setUTCMonth(date.getUTCMonth() - (date.getUTCMonth() % 3), 1);
    date.setUTCHours(0, 0, 0, 0);
  },
  // offset
  (date, step) => date.setUTCMonth(date.getUTCMonth() + step * 3, 1),
  // count
  (start, end) => (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30 * 3),
  // field
  (date) => date.getUTCMonth() // TODO: what should this be?
);

/**
 * Get a time interval function by name.
 *
 * Every interval has a `utc`-prefixed counterpart (`'utcDay'`, `'utcMonth'`, ...) that floors
 * and offsets on UTC boundaries instead of local ones, so it is unaffected by the ambient
 * timezone or by DST. Because these are plain names, they work anywhere an interval name is
 * accepted — `startOfInterval('utcDay', date)`, `intervalOffset('utcMonth', date, -1)`, etc.
 */
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

    case 'utcMillisecond':
      return utcMillisecond;
    case 'utcSecond':
      return utcSecond;
    case 'utcMinute':
      return utcMinute;
    case 'utcHour':
      return utcHour;
    case 'utcDay':
      return utcDay;
    case 'utcWeek':
      return utcWeek;
    case 'utcMonth':
      return utcMonth;
    case 'utcQuarter':
      return utcQuarter;
    case 'utcYear':
      return utcYear;
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
