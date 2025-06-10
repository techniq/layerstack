import { describe, it, expect, test } from 'vitest';
import {
  formatDate,
  getMonthDaysByWeek,
  localToUtcDate,
  utcToLocalDate,
  formatIntl,
  formatDateWithLocale,
  getPeriodTypeByCode,
  getPeriodTypeCode,
  getDayOfWeek,
  hasDayOfWeek,
  replaceDayOfWeek,
  isStringDate,
  timeInterval,
  startOfInterval,
  endOfInterval,
  parseDate,
  intervalOffset,
  isSameInterval,
  intervalDifference,
  isLeapYear,
  isDateWithin,
} from './date.js';
import { createLocaleSettings, defaultLocale, LocaleSettings } from './locale.js';
import {
  PeriodType,
  type FormatDateOptions,
  DayOfWeek,
  type CustomIntlDateTimeFormatOptions,
  DateToken,
  PeriodTypeCode,
  TimeIntervalType,
} from './date_types.js';
import { getWeekStartsOnFromIntl } from './dateInternal.js';
import {
  timeDay,
  timeHour,
  timeMillisecond,
  timeMinute,
  timeMonth,
  timeYear,
  timeSecond,
  timeWeek,
} from 'd3-time';

export const testDateStr = '2023-11-21'; // "good" default date as the day (21) is bigger than 12 (number of months). And november is a good month1 (because why not?)
export const testDate = parseDate('2023-11-21'); // "good" default date as the day (21) is bigger than 12 (number of months). And november is a good month1 (because why not?)

const dt_2M_2d = new Date(2023, 10, 21);
const dt_2M_1d = new Date(2023, 10, 7);
const dt_1M_1d = new Date(2023, 2, 7);
const dt_first = new Date(2024, 1, 1);

const dt_1M_1d_time_pm = new Date(2023, 2, 7, 14, 2, 3, 4);
const dt_1M_1d_time_am = new Date(2023, 2, 7, 1, 2, 3, 4);

const fr = createLocaleSettings({
  locale: 'fr',
  formats: {
    dates: {
      ordinalSuffixes: {
        one: 'er',
      },
    },
  },
});

describe('formatDate()', () => {
  it('should return empty string for null or undefined date', () => {
    // @ts-expect-error
    expect(formatDate(null)).equal('');
    // @ts-expect-error
    expect(formatDate(undefined)).equal('');
  });

  it('should return empty string for invalid date', () => {
    // @ts-expect-error
    expect(formatDate('invalid date')).equal('');
  });

  it('should allow formatting with PeriodType', () => {
    expect(formatDate(testDate, PeriodType.Day)).equal('11/21/2023');
  });

  it('should allow formatting with PeriodTypeCode', () => {
    expect(formatDate(testDate, 'day')).equal('11/21/2023');
  });

  describe('strftime format', () => {
    test.each([
      [new Date('2023-03-07T04:00:00.000Z'), '%Y-%m-%d', '2023-03-07'],
      // [new Date('2023-03-07T04:00:00.000Z'), '%m/%d/%Y', '3/7/2023'], // Not suported
      [new Date('2023-03-07T04:00:00.000Z'), '%m/%d/%Y', '03/07/2023'],
      [new Date('2023-03-07T04:00:00.000Z'), '%m/%d/%y', '03/07/23'],
      [new Date('2023-03-07T04:00:00.000Z'), '%A, %B %d, %Y', 'Tuesday, March 07, 2023'],
      [new Date('1900-01-01T15:25:59.000Z'), '%H:%M:%S', '11:25:59'],
      [new Date('1900-01-01T18:30:00.000Z'), '%I:%M %p', '02:30 PM'],
      [new Date('2023-03-07T18:30:45.000Z'), '%Y-%m-%d %H:%M:%S', '2023-03-07 14:30:45'],
      [new Date('2023-03-07T21:30:45.000Z'), '%Y-%m-%d %H:%M:%S %Z', '2023-03-07 17:30:45 -0400'],
    ])('formatDate(%s, %s) => %s', (date, format, expected) => {
      expect(formatDate(date, format)).toEqual(expected);
    });
  });

  describe('Unicode format', () => {
    test.each([
      [new Date('2023-03-07T04:00:00.000Z'), 'yyyy-MM-dd', '2023-03-07'],
      // [new Date('2023-03-07T04:00:00.000Z'), 'M/d/yyyy', '3/7/2023'], // Not suported
      [new Date('2023-03-07T04:00:00.000Z'), 'MM/dd/yyyy', '03/07/2023'],
      [new Date('2023-03-07T04:00:00.000Z'), 'M/d/yy', '03/07/23'],
      [new Date('2023-03-07T04:00:00.000Z'), 'EEEE, MMMM dd, yyyy', 'Tuesday, March 07, 2023'],
      [new Date('1900-01-01T15:25:59.000Z'), 'HH:mm:ss', '11:25:59'],
      [new Date('1900-01-01T18:30:00.000Z'), 'hh:mm a', '02:30 PM'],
      [new Date('2023-03-07T18:30:45.000Z'), 'yyyy-MM-dd HH:mm:ss', '2023-03-07 14:30:45'],
      [new Date('2023-03-07T21:30:45.000Z'), 'yyyy-MM-dd HH:mm:ss z', '2023-03-07 17:30:45 -0400'],
    ])('formatDate(%s, %s) => %s', (date, format, expected) => {
      expect(formatDate(date, format)).toEqual(expected);
    });
  });
});

describe('formatDateWithLocale()', () => {
  describe('PeriodType', () => {
    const cases: [PeriodType, FormatDateOptions, Date, [LocaleSettings, string][]][] = [
      // PeriodType.Day
      [
        PeriodType.Day,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/21'],
          [fr, '21/11'],
        ],
      ],
      [
        PeriodType.Day,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/21/2023'],
          [fr, '21/11/2023'],
        ],
      ],
      [
        PeriodType.Day,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'Nov 21, 2023'],
          [fr, '21 nov. 2023'],
        ],
      ],
      // PeriodType.DayTime
      [
        PeriodType.DayTime,
        { variant: 'short' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '3/7/2023, 2:02 PM'],
          [fr, '07/03/2023 14:02'],
        ],
      ],
      [
        PeriodType.DayTime,
        { variant: 'default' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '3/7/2023, 02:02 PM'],
          [fr, '07/03/2023 14:02'],
        ],
      ],
      [
        PeriodType.DayTime,
        { variant: 'long' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '3/7/2023, 02:02:03 PM'],
          [fr, '07/03/2023 14:02:03'],
        ],
      ],
      // PeriodType.TimeOnly
      [
        PeriodType.TimeOnly,
        { variant: 'short' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '2:02 PM'],
          [fr, '14:02'],
        ],
      ],
      [
        PeriodType.TimeOnly,
        { variant: 'default' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '02:02:03 PM'],
          [fr, '14:02:03'],
        ],
      ],
      [
        PeriodType.TimeOnly,
        { variant: 'long' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '02:02:03.004 PM'],
          [fr, '14:02:03,004'],
        ],
      ],
      // PeriodType.WeekSun / Mon
      [
        PeriodType.WeekSun,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/19 - 11/25'],
          [fr, '19/11 - 25/11'],
        ],
      ],
      [
        PeriodType.WeekSun,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '19/11/2023 - 25/11/2023'],
        ],
      ],
      [
        PeriodType.WeekSun,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '19/11/2023 - 25/11/2023'],
        ],
      ],
      [
        PeriodType.WeekMon,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/20/2023 - 11/26/2023'],
          [fr, '20/11/2023 - 26/11/2023'],
        ],
      ],
      // PeriodType.Week
      [
        PeriodType.Week,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/19 - 11/25'],
          [fr, '20/11 - 26/11'],
        ],
      ],
      [
        PeriodType.Week,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '20/11/2023 - 26/11/2023'],
        ],
      ],
      [
        PeriodType.Week,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '20/11/2023 - 26/11/2023'],
        ],
      ],
      // PeriodType.Month
      [
        PeriodType.Month,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, 'Nov'],
          [fr, 'nov.'],
        ],
      ],
      [
        PeriodType.Month,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, 'November'],
          [fr, 'novembre'],
        ],
      ],
      [
        PeriodType.Month,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'November 2023'],
          [fr, 'novembre 2023'],
        ],
      ],
      // PeriodType.MonthYear
      [
        PeriodType.MonthYear,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, 'Nov 23'],
          [fr, 'nov. 23'],
        ],
      ],
      [
        PeriodType.MonthYear,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, 'November 2023'],
          [fr, 'novembre 2023'],
        ],
      ],
      [
        PeriodType.MonthYear,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'November 2023'],
          [fr, 'novembre 2023'],
        ],
      ],

      // PeriodType.Quarter
      [
        PeriodType.Quarter,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, 'Oct - Dec 23'],
          [fr, 'oct. - déc. 23'],
        ],
      ],
      [
        PeriodType.Quarter,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, 'October - December 2023'],
          [fr, 'octobre - décembre 2023'],
        ],
      ],
      [
        PeriodType.Quarter,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'October 2023 - December 2023'],
          [fr, 'octobre 2023 - décembre 2023'],
        ],
      ],

      // PeriodType.CalendarYear
      [
        PeriodType.CalendarYear,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '23'],
          [fr, '23'],
        ],
      ],
      [
        PeriodType.CalendarYear,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '2023'],
          [fr, '2023'],
        ],
      ],
      [
        PeriodType.CalendarYear,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '2023'],
          [fr, '2023'],
        ],
      ],

      // PeriodType.FiscalYearOctober
      [
        PeriodType.FiscalYearOctober,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '24'],
          [fr, '24'],
        ],
      ],
      [
        PeriodType.FiscalYearOctober,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '2024'],
          [fr, '2024'],
        ],
      ],
      [
        PeriodType.FiscalYearOctober,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '2024'],
          [fr, '2024'],
        ],
      ],

      // PeriodType.BiWeek1Sun
      [
        PeriodType.BiWeek1Sun,
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/12 - 11/25'],
          [fr, '12/11 - 25/11'],
        ],
      ],
      [
        PeriodType.BiWeek1Sun,
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/12/2023 - 11/25/2023'],
          [fr, '12/11/2023 - 25/11/2023'],
        ],
      ],
      [
        PeriodType.BiWeek1Sun,
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/12/2023 - 11/25/2023'],
          [fr, '12/11/2023 - 25/11/2023'],
        ],
      ],
    ] as const;

    for (const c of cases) {
      const [periodType, options, date, locales] = c;
      describe(PeriodType[periodType], () => {
        describe(`options: ${JSON.stringify(options)}`, () => {
          for (const [locale, expected] of locales) {
            it(`locale: ${locale.locale}`, () => {
              expect(formatDateWithLocale(locale, date, periodType, options)).equal(expected);
            });
          }
        });
      });
    }
  });

  describe('PeriodTypeCode string', () => {
    const cases: [PeriodTypeCode, FormatDateOptions, Date, [LocaleSettings, string][]][] = [
      // 'day'
      [
        'day',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/21'],
          [fr, '21/11'],
        ],
      ],
      [
        'day',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/21/2023'],
          [fr, '21/11/2023'],
        ],
      ],
      [
        'day',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'Nov 21, 2023'],
          [fr, '21 nov. 2023'],
        ],
      ],
      // 'daytime'
      [
        'daytime',
        { variant: 'short' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '3/7/2023, 2:02 PM'],
          [fr, '07/03/2023 14:02'],
        ],
      ],
      [
        'daytime',
        { variant: 'default' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '3/7/2023, 02:02 PM'],
          [fr, '07/03/2023 14:02'],
        ],
      ],
      [
        'daytime',
        { variant: 'long' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '3/7/2023, 02:02:03 PM'],
          [fr, '07/03/2023 14:02:03'],
        ],
      ],
      // 'time'
      [
        'time',
        { variant: 'short' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '2:02 PM'],
          [fr, '14:02'],
        ],
      ],
      [
        'time',
        { variant: 'default' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '02:02:03 PM'],
          [fr, '14:02:03'],
        ],
      ],
      [
        'time',
        { variant: 'long' },
        dt_1M_1d_time_pm,
        [
          [defaultLocale, '02:02:03.004 PM'],
          [fr, '14:02:03,004'],
        ],
      ],
      // 'week-sun'
      [
        'week-sun',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/19 - 11/25'],
          [fr, '19/11 - 25/11'],
        ],
      ],
      [
        'week-sun',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '19/11/2023 - 25/11/2023'],
        ],
      ],
      [
        'week-sun',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '19/11/2023 - 25/11/2023'],
        ],
      ],
      // 'week-mon'
      [
        'week-mon',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/20/2023 - 11/26/2023'],
          [fr, '20/11/2023 - 26/11/2023'],
        ],
      ],
      // 'week'
      [
        'week',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/19 - 11/25'],
          [fr, '20/11 - 26/11'],
        ],
      ],
      [
        'week',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '20/11/2023 - 26/11/2023'],
        ],
      ],
      [
        'week',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/19/2023 - 11/25/2023'],
          [fr, '20/11/2023 - 26/11/2023'],
        ],
      ],
      // 'month'
      [
        'month',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, 'Nov'],
          [fr, 'nov.'],
        ],
      ],
      [
        'month',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, 'November'],
          [fr, 'novembre'],
        ],
      ],
      [
        'month',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'November 2023'],
          [fr, 'novembre 2023'],
        ],
      ],
      // 'month-year'
      [
        'month-year',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, 'Nov 23'],
          [fr, 'nov. 23'],
        ],
      ],
      [
        'month-year',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, 'November 2023'],
          [fr, 'novembre 2023'],
        ],
      ],
      [
        'month-year',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'November 2023'],
          [fr, 'novembre 2023'],
        ],
      ],

      // 'quarter'
      [
        'quarter',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, 'Oct - Dec 23'],
          [fr, 'oct. - déc. 23'],
        ],
      ],
      [
        'quarter',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, 'October - December 2023'],
          [fr, 'octobre - décembre 2023'],
        ],
      ],
      [
        'quarter',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, 'October 2023 - December 2023'],
          [fr, 'octobre 2023 - décembre 2023'],
        ],
      ],

      // 'year'
      [
        'year',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '23'],
          [fr, '23'],
        ],
      ],
      [
        'year',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '2023'],
          [fr, '2023'],
        ],
      ],
      [
        'year',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '2023'],
          [fr, '2023'],
        ],
      ],

      // 'fiscal-year-october'
      [
        'fiscal-year-october',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '24'],
          [fr, '24'],
        ],
      ],
      [
        'fiscal-year-october',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '2024'],
          [fr, '2024'],
        ],
      ],
      [
        'fiscal-year-october',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '2024'],
          [fr, '2024'],
        ],
      ],

      // 'biweek1-sun'
      [
        'biweek1-sun',
        { variant: 'short' },
        testDate,
        [
          [defaultLocale, '11/12 - 11/25'],
          [fr, '12/11 - 25/11'],
        ],
      ],
      [
        'biweek1-sun',
        { variant: 'default' },
        testDate,
        [
          [defaultLocale, '11/12/2023 - 11/25/2023'],
          [fr, '12/11/2023 - 25/11/2023'],
        ],
      ],
      [
        'biweek1-sun',
        { variant: 'long' },
        testDate,
        [
          [defaultLocale, '11/12/2023 - 11/25/2023'],
          [fr, '12/11/2023 - 25/11/2023'],
        ],
      ],
    ];

    for (const c of cases) {
      const [periodTypeCode, options, date, locales] = c;
      describe(periodTypeCode, () => {
        describe(`options: ${JSON.stringify(options)}`, () => {
          for (const [locale, expected] of locales) {
            it(`locale: ${locale.locale}`, () => {
              expect(formatDateWithLocale(locale, date, periodTypeCode, options)).equal(expected);
            });
          }
        });
      });
    }
  });

  describe('should format date string for PeriodType.Day', () => {
    const cases = [
      ['short', defaultLocale, '11/21'],
      ['short', fr, '21/11'],
      ['default', defaultLocale, '11/21/2023'],
      ['default', fr, '21/11/2023'],
      ['long', defaultLocale, 'Nov 21, 2023'],
      ['long', fr, '21 nov. 2023'],
    ] as const;

    for (const c of cases) {
      const [variant, locale, expected] = c;
      it(c.toString(), () => {
        expect(formatDateWithLocale(locale, testDateStr, PeriodType.Day, { variant })).equal(
          expected
        );
      });
    }
  });
});

describe('formatIntl() tokens', () => {
  const cases: [Date, CustomIntlDateTimeFormatOptions, string[]][] = [
    [dt_1M_1d, 'MM/dd/yyyy', ['03/07/2023', '07/03/2023']],
    [dt_2M_2d, 'M/d/yyyy', ['11/21/2023', '21/11/2023']],
    [dt_2M_1d, 'M/d/yyyy', ['11/7/2023', '07/11/2023']],
    [dt_2M_1d, 'M/dd/yyyy', ['11/07/2023', '07/11/2023']],
    [dt_1M_1d, 'M/d/yyyy', ['3/7/2023', '07/03/2023']],
    [dt_1M_1d, 'MM/d/yyyy', ['03/7/2023', '7/03/2023']],
    [dt_2M_2d, 'M/d', ['11/21', '21/11']],
    [dt_2M_2d, 'MMM d, yyyy', ['Nov 21, 2023', '21 nov. 2023']],
    [dt_2M_1d, 'MMM d, yyyy', ['Nov 7, 2023', '7 nov. 2023']],
    [dt_2M_1d, 'MMM do, yyyy', ['Nov 7th, 2023', '7 nov. 2023']],
    [dt_2M_2d, 'MMM', ['Nov', 'nov.']],
    [dt_2M_2d, 'MMMM', ['November', 'novembre']],
    [dt_2M_2d, 'MMM yy', ['Nov 23', 'nov. 23']],
    [dt_2M_2d, 'MMMM yyyy', ['November 2023', 'novembre 2023']],
    [dt_2M_2d, 'yy', ['23', '23']],
    [dt_2M_2d, 'yyyy', ['2023', '2023']],
    [dt_2M_2d, { dateStyle: 'full' }, ['Tuesday, November 21, 2023', 'mardi 21 novembre 2023']],
    [dt_2M_2d, { dateStyle: 'long' }, ['November 21, 2023', '21 novembre 2023']],
    [dt_2M_2d, { dateStyle: 'medium' }, ['Nov 21, 2023', '21 nov. 2023']],
    [dt_2M_2d, { dateStyle: 'medium', withOrdinal: true }, ['Nov 21st, 2023', '21 nov. 2023']],
    [dt_2M_2d, { dateStyle: 'short' }, ['11/21/23', '21/11/2023']],
    [dt_1M_1d, { dateStyle: 'short' }, ['3/7/23', '07/03/2023']],
    [dt_first, DateToken.DayOfMonth_withOrdinal, ['1st', '1er']],

    // time
    [dt_1M_1d_time_pm, [DateToken.Hour_numeric, DateToken.Minute_numeric], ['2:02 PM', '14:02']],
    [dt_1M_1d_time_am, [DateToken.Hour_numeric, DateToken.Minute_numeric], ['1:02 AM', '01:02']],
    [
      dt_1M_1d_time_am,
      [DateToken.Hour_numeric, DateToken.Minute_numeric, DateToken.Hour_wAMPM],
      ['1:02 AM', '1:02 AM'],
    ],
    [
      dt_1M_1d_time_am,
      [DateToken.Hour_2Digit, DateToken.Minute_2Digit, DateToken.Hour_woAMPM],
      ['01:02', '01:02'],
    ],
    [
      dt_1M_1d_time_am,
      [DateToken.Hour_numeric, DateToken.Minute_numeric, DateToken.Second_numeric],
      ['1:02:03 AM', '01:02:03'],
    ],
    [
      dt_1M_1d_time_am,
      [
        DateToken.Hour_numeric,
        DateToken.Minute_numeric,
        DateToken.Second_numeric,
        DateToken.MiliSecond_3,
      ],
      ['1:02:03.004 AM', '01:02:03,004'],
    ],
  ];

  for (const c of cases) {
    const [date, tokens, [expected_default, expected_fr]] = c;
    it(c.toString(), () => {
      expect(formatIntl(defaultLocale, date, tokens)).equal(expected_default);
    });

    it(c.toString() + 'fr', () => {
      expect(formatIntl(fr, date, tokens)).equal(expected_fr);
    });
  }
});

describe('utcToLocalDate()', () => {
  it('in with offset -00 => local', () => {
    const utcDate = '2023-11-21T00:00:00-00:00';
    const localDate = utcToLocalDate(utcDate);
    expect(localDate.toISOString()).equal('2023-11-21T04:00:00.000Z');
  });

  it('in without offset, the utc is already +4, to local: another +4', () => {
    const utcDate = '2023-11-21T00:00:00';
    const localDate = utcToLocalDate(utcDate);
    expect(localDate.toISOString()).equal('2023-11-21T08:00:00.000Z');
  });
});

describe('localToUtcDate()', () => {
  it('in with offset -04 => UTC', () => {
    const localDate = '2023-11-21T00:00:00-04:00';
    const utcDate = localToUtcDate(localDate);
    expect(utcDate.toISOString()).equal('2023-11-21T00:00:00.000Z');
  });

  it('in with offset -00 => UTC', () => {
    const localDate = '2023-11-21T04:00:00-00:00';
    const utcDate = localToUtcDate(localDate);
    expect(utcDate.toISOString()).equal('2023-11-21T00:00:00.000Z');
  });

  it('in without offset == UTC', () => {
    const localDate = '2023-11-21T04:00:00';
    const utcDate = localToUtcDate(localDate);
    expect(utcDate.toISOString()).equal('2023-11-21T04:00:00.000Z');
  });
});

describe('getMonthDaysByWeek()', () => {
  it('default starting Week: Sunday', () => {
    const dates = getMonthDaysByWeek(testDate);
    expect(dates).toMatchInlineSnapshot(`
      [
        [
          2023-10-29T04:00:00.000Z,
          2023-10-30T04:00:00.000Z,
          2023-10-31T04:00:00.000Z,
          2023-11-01T04:00:00.000Z,
          2023-11-02T04:00:00.000Z,
          2023-11-03T04:00:00.000Z,
          2023-11-04T04:00:00.000Z,
        ],
        [
          2023-11-05T04:00:00.000Z,
          2023-11-06T04:00:00.000Z,
          2023-11-07T04:00:00.000Z,
          2023-11-08T04:00:00.000Z,
          2023-11-09T04:00:00.000Z,
          2023-11-10T04:00:00.000Z,
          2023-11-11T04:00:00.000Z,
        ],
        [
          2023-11-12T04:00:00.000Z,
          2023-11-13T04:00:00.000Z,
          2023-11-14T04:00:00.000Z,
          2023-11-15T04:00:00.000Z,
          2023-11-16T04:00:00.000Z,
          2023-11-17T04:00:00.000Z,
          2023-11-18T04:00:00.000Z,
        ],
        [
          2023-11-19T04:00:00.000Z,
          2023-11-20T04:00:00.000Z,
          2023-11-21T04:00:00.000Z,
          2023-11-22T04:00:00.000Z,
          2023-11-23T04:00:00.000Z,
          2023-11-24T04:00:00.000Z,
          2023-11-25T04:00:00.000Z,
        ],
        [
          2023-11-26T04:00:00.000Z,
          2023-11-27T04:00:00.000Z,
          2023-11-28T04:00:00.000Z,
          2023-11-29T04:00:00.000Z,
          2023-11-30T04:00:00.000Z,
          2023-12-01T04:00:00.000Z,
          2023-12-02T04:00:00.000Z,
        ],
      ]
    `);
  });

  it('Starting Week: Monday', () => {
    const dates = getMonthDaysByWeek(testDate, 1);
    expect(dates).toMatchInlineSnapshot(`
      [
        [
          2023-10-30T04:00:00.000Z,
          2023-10-31T04:00:00.000Z,
          2023-11-01T04:00:00.000Z,
          2023-11-02T04:00:00.000Z,
          2023-11-03T04:00:00.000Z,
          2023-11-04T04:00:00.000Z,
          2023-11-05T04:00:00.000Z,
        ],
        [
          2023-11-06T04:00:00.000Z,
          2023-11-07T04:00:00.000Z,
          2023-11-08T04:00:00.000Z,
          2023-11-09T04:00:00.000Z,
          2023-11-10T04:00:00.000Z,
          2023-11-11T04:00:00.000Z,
          2023-11-12T04:00:00.000Z,
        ],
        [
          2023-11-13T04:00:00.000Z,
          2023-11-14T04:00:00.000Z,
          2023-11-15T04:00:00.000Z,
          2023-11-16T04:00:00.000Z,
          2023-11-17T04:00:00.000Z,
          2023-11-18T04:00:00.000Z,
          2023-11-19T04:00:00.000Z,
        ],
        [
          2023-11-20T04:00:00.000Z,
          2023-11-21T04:00:00.000Z,
          2023-11-22T04:00:00.000Z,
          2023-11-23T04:00:00.000Z,
          2023-11-24T04:00:00.000Z,
          2023-11-25T04:00:00.000Z,
          2023-11-26T04:00:00.000Z,
        ],
        [
          2023-11-27T04:00:00.000Z,
          2023-11-28T04:00:00.000Z,
          2023-11-29T04:00:00.000Z,
          2023-11-30T04:00:00.000Z,
          2023-12-01T04:00:00.000Z,
          2023-12-02T04:00:00.000Z,
          2023-12-03T04:00:00.000Z,
        ],
      ]
    `);
  });
});

describe('getWeekStartsOnFromIntl() tokens', () => {
  it('by default, sunday', () => {
    const val = getWeekStartsOnFromIntl();
    expect(val).toBe(DayOfWeek.Sunday);
  });

  it('For en it should be synday', () => {
    const val = getWeekStartsOnFromIntl('en');
    expect(val).toBe(DayOfWeek.Sunday);
  });

  it('For fr it should be monday', () => {
    const val = getWeekStartsOnFromIntl('fr');
    expect(val).toBe(DayOfWeek.Monday);
  });
});

describe('getPeriodTypeByCode()', () => {
  const data = [
    ['custom', PeriodType.Custom],
    ['day', PeriodType.Day],
    ['daytime', PeriodType.DayTime],
    ['time', PeriodType.TimeOnly],
    ['week', PeriodType.Week],
    ['week-sun', PeriodType.WeekSun],
    ['week-mon', PeriodType.WeekMon],
    ['week-tue', PeriodType.WeekTue],
    ['week-wed', PeriodType.WeekWed],
    ['week-thu', PeriodType.WeekThu],
    ['week-fri', PeriodType.WeekFri],
    ['week-sat', PeriodType.WeekSat],
    ['month', PeriodType.Month],
    ['month-year', PeriodType.MonthYear],
    ['quarter', PeriodType.Quarter],
    ['year', PeriodType.CalendarYear],
    ['fiscal-year-october', PeriodType.FiscalYearOctober],
    ['biweek1', PeriodType.BiWeek1],
    ['biweek1-sun', PeriodType.BiWeek1Sun],
    ['biweek1-mon', PeriodType.BiWeek1Mon],
    ['biweek1-tue', PeriodType.BiWeek1Tue],
    ['biweek1-wed', PeriodType.BiWeek1Wed],
    ['biweek1-thu', PeriodType.BiWeek1Thu],
    ['biweek1-fri', PeriodType.BiWeek1Fri],
    ['biweek1-sat', PeriodType.BiWeek1Sat],
    ['biweek2', PeriodType.BiWeek2],
    ['biweek2-sun', PeriodType.BiWeek2Sun],
    ['biweek2-mon', PeriodType.BiWeek2Mon],
    ['biweek2-tue', PeriodType.BiWeek2Tue],
    ['biweek2-wed', PeriodType.BiWeek2Wed],
    ['biweek2-thu', PeriodType.BiWeek2Thu],
    ['biweek2-fri', PeriodType.BiWeek2Fri],
    ['biweek2-sat', PeriodType.BiWeek2Sat],
  ] as const;

  data.forEach(([code, periodType]) => {
    it(code, () => {
      const val = getPeriodTypeByCode(code);
      expect(val).toBe(periodType);
    });
  });
});

describe('getPeriodTypeCode()', () => {
  const data = [
    ['custom', PeriodType.Custom],
    ['day', PeriodType.Day],
    ['daytime', PeriodType.DayTime],
    ['time', PeriodType.TimeOnly],
    ['week', PeriodType.Week],
    ['week-sun', PeriodType.WeekSun],
    ['week-mon', PeriodType.WeekMon],
    ['week-tue', PeriodType.WeekTue],
    ['week-wed', PeriodType.WeekWed],
    ['week-thu', PeriodType.WeekThu],
    ['week-fri', PeriodType.WeekFri],
    ['week-sat', PeriodType.WeekSat],
    ['month', PeriodType.Month],
    ['month-year', PeriodType.MonthYear],
    ['quarter', PeriodType.Quarter],
    ['year', PeriodType.CalendarYear],
    ['fiscal-year-october', PeriodType.FiscalYearOctober],
    ['biweek1', PeriodType.BiWeek1],
    ['biweek1-sun', PeriodType.BiWeek1Sun],
    ['biweek1-mon', PeriodType.BiWeek1Mon],
    ['biweek1-tue', PeriodType.BiWeek1Tue],
    ['biweek1-wed', PeriodType.BiWeek1Wed],
    ['biweek1-thu', PeriodType.BiWeek1Thu],
    ['biweek1-fri', PeriodType.BiWeek1Fri],
    ['biweek1-sat', PeriodType.BiWeek1Sat],
    ['biweek2', PeriodType.BiWeek2],
    ['biweek2-sun', PeriodType.BiWeek2Sun],
    ['biweek2-mon', PeriodType.BiWeek2Mon],
    ['biweek2-tue', PeriodType.BiWeek2Tue],
    ['biweek2-wed', PeriodType.BiWeek2Wed],
    ['biweek2-thu', PeriodType.BiWeek2Thu],
    ['biweek2-fri', PeriodType.BiWeek2Fri],
    ['biweek2-sat', PeriodType.BiWeek2Sat],
  ] as const;

  data.forEach(([code, periodType]) => {
    it(code, () => {
      const val = getPeriodTypeCode(periodType);
      expect(val).toBe(code);
    });
  });
});

describe('hasDayOfWeek()', () => {
  const data = [
    // Week
    [PeriodType.Week, false],
    [PeriodType.WeekSun, true],
    [PeriodType.WeekMon, true],
    [PeriodType.WeekTue, true],
    [PeriodType.WeekWed, true],
    [PeriodType.WeekThu, true],
    [PeriodType.WeekFri, true],
    [PeriodType.WeekSat, true],
    // BiWeek1
    [PeriodType.BiWeek1, false],
    [PeriodType.BiWeek1Sun, true],
    [PeriodType.BiWeek1Mon, true],
    [PeriodType.BiWeek1Tue, true],
    [PeriodType.BiWeek1Wed, true],
    [PeriodType.BiWeek1Thu, true],
    [PeriodType.BiWeek1Fri, true],
    [PeriodType.BiWeek1Sat, true],
    // BiWeek2
    [PeriodType.BiWeek2, false],
    [PeriodType.BiWeek2Sun, true],
    [PeriodType.BiWeek2Mon, true],
    [PeriodType.BiWeek2Tue, true],
    [PeriodType.BiWeek2Wed, true],
    [PeriodType.BiWeek2Thu, true],
    [PeriodType.BiWeek2Fri, true],
    [PeriodType.BiWeek2Sat, true],
    // Other
    [PeriodType.Day, false],
    [PeriodType.Month, false],
    [PeriodType.CalendarYear, false],
  ] as const;

  data.forEach(([periodType, dayOfWeek]) => {
    it(PeriodType[periodType], () => {
      const val = hasDayOfWeek(periodType);
      expect(val).toBe(dayOfWeek);
    });
  });
});

describe('getDayOfWeek()', () => {
  const data = [
    // Week
    [PeriodType.Week, null],
    [PeriodType.WeekSun, DayOfWeek.Sunday],
    [PeriodType.WeekMon, DayOfWeek.Monday],
    [PeriodType.WeekTue, DayOfWeek.Tuesday],
    [PeriodType.WeekWed, DayOfWeek.Wednesday],
    [PeriodType.WeekThu, DayOfWeek.Thursday],
    [PeriodType.WeekFri, DayOfWeek.Friday],
    [PeriodType.WeekSat, DayOfWeek.Saturday],
    // BiWeek1
    [PeriodType.BiWeek1, null],
    [PeriodType.BiWeek1Sun, DayOfWeek.Sunday],
    [PeriodType.BiWeek1Mon, DayOfWeek.Monday],
    [PeriodType.BiWeek1Tue, DayOfWeek.Tuesday],
    [PeriodType.BiWeek1Wed, DayOfWeek.Wednesday],
    [PeriodType.BiWeek1Thu, DayOfWeek.Thursday],
    [PeriodType.BiWeek1Fri, DayOfWeek.Friday],
    [PeriodType.BiWeek1Sat, DayOfWeek.Saturday],
    // BiWeek2
    [PeriodType.BiWeek2, null],
    [PeriodType.BiWeek2Sun, DayOfWeek.Sunday],
    [PeriodType.BiWeek2Mon, DayOfWeek.Monday],
    [PeriodType.BiWeek2Tue, DayOfWeek.Tuesday],
    [PeriodType.BiWeek2Wed, DayOfWeek.Wednesday],
    [PeriodType.BiWeek2Thu, DayOfWeek.Thursday],
    [PeriodType.BiWeek2Fri, DayOfWeek.Friday],
    [PeriodType.BiWeek2Sat, DayOfWeek.Saturday],
    // Other
    [PeriodType.Day, null],
    [PeriodType.Month, null],
    [PeriodType.CalendarYear, null],
  ] as const;

  data.forEach(([periodType, dayOfWeek]) => {
    it(PeriodType[periodType], () => {
      const val = getDayOfWeek(periodType);
      expect(val).toBe(dayOfWeek);
    });
  });
});

describe('replaceDayOfWeek()', () => {
  const data = [
    // Week
    [PeriodType.Week, DayOfWeek.Sunday, PeriodType.WeekSun],
    [PeriodType.WeekSun, DayOfWeek.Sunday, PeriodType.WeekSun],
    [PeriodType.WeekSun, DayOfWeek.Monday, PeriodType.WeekMon],
    [PeriodType.WeekSun, DayOfWeek.Tuesday, PeriodType.WeekTue],
    [PeriodType.WeekSun, DayOfWeek.Wednesday, PeriodType.WeekWed],
    [PeriodType.WeekWed, DayOfWeek.Thursday, PeriodType.WeekThu],
    [PeriodType.WeekWed, DayOfWeek.Friday, PeriodType.WeekFri],
    [PeriodType.WeekSat, DayOfWeek.Saturday, PeriodType.WeekSat],
    // BiWeek1
    [PeriodType.BiWeek1, DayOfWeek.Sunday, PeriodType.BiWeek1Sun],
    [PeriodType.BiWeek1Sun, DayOfWeek.Sunday, PeriodType.BiWeek1Sun],
    [PeriodType.BiWeek1Sun, DayOfWeek.Monday, PeriodType.BiWeek1Mon],
    [PeriodType.BiWeek1Sun, DayOfWeek.Tuesday, PeriodType.BiWeek1Tue],
    [PeriodType.BiWeek1Sun, DayOfWeek.Wednesday, PeriodType.BiWeek1Wed],
    [PeriodType.BiWeek1Wed, DayOfWeek.Thursday, PeriodType.BiWeek1Thu],
    [PeriodType.BiWeek1Wed, DayOfWeek.Friday, PeriodType.BiWeek1Fri],
    [PeriodType.BiWeek1Sat, DayOfWeek.Saturday, PeriodType.BiWeek1Sat],
    // BiWeek2
    [PeriodType.BiWeek2, DayOfWeek.Sunday, PeriodType.BiWeek2Sun],
    [PeriodType.BiWeek2Sun, DayOfWeek.Sunday, PeriodType.BiWeek2Sun],
    [PeriodType.BiWeek2Sun, DayOfWeek.Monday, PeriodType.BiWeek2Mon],
    [PeriodType.BiWeek2Sun, DayOfWeek.Tuesday, PeriodType.BiWeek2Tue],
    [PeriodType.BiWeek2Sun, DayOfWeek.Wednesday, PeriodType.BiWeek2Wed],
    [PeriodType.BiWeek2Wed, DayOfWeek.Thursday, PeriodType.BiWeek2Thu],
    [PeriodType.BiWeek2Wed, DayOfWeek.Friday, PeriodType.BiWeek2Fri],
    [PeriodType.BiWeek2Sat, DayOfWeek.Saturday, PeriodType.BiWeek2Sat],
    // Other
    [PeriodType.Day, DayOfWeek.Sunday, PeriodType.Day],
    [PeriodType.Month, DayOfWeek.Sunday, PeriodType.Month],
    [PeriodType.CalendarYear, DayOfWeek.Sunday, PeriodType.CalendarYear],
  ] as const;

  data.forEach(([periodType, dayOfWeek, expected]) => {
    it(`${PeriodType[periodType]} / ${DayOfWeek[dayOfWeek]}`, () => {
      const val = replaceDayOfWeek(periodType, dayOfWeek);
      expect(val).toBe(expected);
    });
  });
});

describe('isStringDate()', () => {
  it('date only', () => {
    expect(isStringDate('1982-03-30')).true;
  });

  it('date with time (UTC)', () => {
    expect(isStringDate('1982-03-30T11:25:59Z')).true;
  });

  it('date with time (offset)', () => {
    expect(isStringDate('1982-03-30T11:25:59-04:00')).true;
  });

  it('date with time and 3 digit milliseconds (UTC)', () => {
    expect(isStringDate('1982-03-30T11:25:59.123Z')).true;
  });

  it('date with time with 7 digit milliseconds (UTC)', () => {
    expect(isStringDate('1982-03-30T11:25:59.1234567Z')).true;
  });
});

describe('parseDate()', () => {
  it('date only as locale date', () => {
    expect(parseDate('1982-03-30')).toEqual(new Date('1982-03-30T04:00:00.000Z'));
  });

  it('date and time only (hour/minute) as locale date', () => {
    expect(parseDate('1982-03-30T04:00')).toEqual(new Date('1982-03-30T08:00:00.000Z'));
  });

  it('date and time only (hour/minute/second) as locale date', () => {
    expect(parseDate('1982-03-30T04:00:00')).toEqual(new Date('1982-03-30T08:00:00.000Z'));
  });

  it('should not equal UTC date', () => {
    // Just an extra check
    expect(parseDate('1982-03-30')).not.toEqual(new Date('1982-03-30'));
  });

  it('date with timezome (UTC)', () => {
    expect(parseDate('1982-03-30T11:25:59Z')).toEqual(new Date('1982-03-30T11:25:59Z'));
  });

  it('date with time (offset)', () => {
    expect(parseDate('1982-03-30T00:00:00-01:00')).toEqual(new Date('1982-03-30T00:00:00-01:00'));
  });

  it('date with time and 3 digit milliseconds (UTC)', () => {
    expect(parseDate('1982-03-30T11:25:59.123Z')).toEqual(new Date('1982-03-30T11:25:59.123Z'));
  });

  it('date with time with 7 digit milliseconds (UTC)', () => {
    expect(parseDate('1982-03-30T11:25:59.1234567Z')).toEqual(
      new Date('1982-03-30T11:25:59.1234567Z')
    );
  });

  it('invalid date string', () => {
    expect(parseDate('some_string')).toEqual(new Date('Invalid Date'));
  });

  describe('strftime format', () => {
    test.each([
      ['2023-03-07', '%Y-%m-%d', new Date('2023-03-07T04:00:00.000Z')],
      ['3/7/2023', '%m/%d/%Y', new Date('2023-03-07T04:00:00.000Z')],
      ['03/07/2023', '%m/%d/%Y', new Date('2023-03-07T04:00:00.000Z')],
      ['03/07/23', '%m/%d/%y', new Date('2023-03-07T04:00:00.000Z')],
      ['3/7/23', '%m/%d/%y', new Date('2023-03-07T04:00:00.000Z')],
      ['Tuesday, March 7, 2023', '%A, %B %d, %Y', new Date('2023-03-07T04:00:00.000Z')],
      ['11:25:59', '%H:%M:%S', new Date('1900-01-01T15:25:59.000Z')],
      ['2:30 PM', '%I:%M %p', new Date('1900-01-01T18:30:00.000Z')],
      ['2023-03-07 14:30:45', '%Y-%m-%d %H:%M:%S', new Date('2023-03-07T18:30:45.000Z')],
      ['2023-03-07 14:30:45 -07:00', '%Y-%m-%d %H:%M:%S %Z', new Date('2023-03-07T21:30:45.000Z')],
    ])('parseDate(%s, %s) => %s', (date, format, expected) => {
      expect(parseDate(date, format)).toEqual(expected);
    });
  });

  describe('Unicode format', () => {
    test.each([
      ['2023-03-07', 'yyyy-MM-dd', new Date('2023-03-07T04:00:00.000Z')],
      ['3/7/2023', 'M/d/yyyy', new Date('2023-03-07T04:00:00.000Z')],
      ['03/07/2023', 'MM/dd/yyyy', new Date('2023-03-07T04:00:00.000Z')],
      ['3/7/23', 'M/d/yy', new Date('2023-03-07T04:00:00.000Z')],
      ['Tuesday, December 25, 2023', 'EEEE, MMMM dd, yyyy', new Date('2023-12-25T04:00:00.000Z')],
      ['11:25:59', 'HH:mm:ss', new Date('1900-01-01T15:25:59.000Z')],
      ['2:30 PM', 'hh:mm a', new Date('1900-01-01T18:30:00.000Z')],
      ['2023-03-07 14:30:45', 'yyyy-MM-dd HH:mm:ss', new Date('2023-03-07T18:30:45.000Z')],
      ['2023-03-07 14:30:45 -07:00', 'yyyy-MM-dd HH:mm:ss z', new Date('2023-03-07T21:30:45.000Z')],
    ])('parseDate(%s, %s) => %s', (date, format, expected) => {
      expect(parseDate(date, format)).toEqual(expected);
    });
  });
});

describe('timeInterval()', () => {
  test.each([
    ['millisecond', timeMillisecond],
    ['second', timeSecond],
    ['minute', timeMinute],
    ['hour', timeHour],
    ['day', timeDay],
    ['week', timeWeek],
    ['month', timeMonth],
    // ['quarter', timeMonth.every(3)], // TODO: how to verify this?
    ['year', timeYear],
  ])('timeInterval(%s) => %s', (interval, expected) => {
    expect(timeInterval(interval as TimeIntervalType)).toEqual(expected);
  });
});

describe('startOfInterval()', () => {
  test.each([
    ['millisecond', '2023-03-07T14:02:03.004'],
    ['second', '2023-03-07T14:02:03'],
    ['minute', '2023-03-07T14:02'],
    ['hour', '2023-03-07T14:00:00.000'],
    ['day', '2023-03-07'],
    ['week', '2023-03-05'],
    ['month', '2023-03-01'],
    ['quarter', '2023-01-01'],
    ['year', '2023-01-01'],
  ])('startOfInterval(%s, %s) => %s', (interval, expected) => {
    expect(startOfInterval(interval as TimeIntervalType, dt_1M_1d_time_pm)).toEqual(
      parseDate(expected)
    );
  });
});

describe('endOfInterval()', () => {
  test.each([
    ['millisecond', '2023-03-07T14:02:03.004'],
    ['second', '2023-03-07T14:02:03.999'],
    ['minute', '2023-03-07T14:02:59.999'],
    ['hour', '2023-03-07T14:59:59.999'],
    ['day', '2023-03-07T23:59:59.999'],
    ['week', '2023-03-11T23:59:59.999'],
    ['month', '2023-03-31T23:59:59.999'],
    ['quarter', '2023-03-31T23:59:59.999'],
    ['year', '2023-12-31T23:59:59.999'],
  ])('endOfInterval(%s, %s) => %s', (interval, expected) => {
    expect(endOfInterval(interval as TimeIntervalType, dt_1M_1d_time_pm)).toEqual(
      parseDate(expected)
    );
  });
});

describe('intervalOffset()', () => {
  test.each([
    ['millisecond', 1, '2023-11-21T04:00:00.001Z'],
    ['millisecond', -1, '2023-11-21T03:59:59.999Z'],
    ['second', 1, '2023-11-21T04:00:01Z'],
    ['second', -1, '2023-11-21T03:59:59Z'],
    ['minute', 1, '2023-11-21T04:01:00Z'],
    ['minute', -1, '2023-11-21T03:59:00Z'],
    ['hour', 1, '2023-11-21T05:00:00Z'],
    ['hour', -1, '2023-11-21T03:00:00Z'],
    ['day', 1, '2023-11-22'],
    ['day', -1, '2023-11-20'],
    ['week', 1, '2023-11-28'],
    ['week', -1, '2023-11-14'],
    ['month', 1, '2023-12-21'],
    ['month', -1, '2023-10-21'],
    ['quarter', 1, '2024-02-01'],
    ['quarter', -1, '2023-08-01'],
    ['year', 1, '2024-11-21'],
    ['year', -1, '2022-11-21'],
  ])('intervalOffset(%s, %s, %s) => %s', (interval, offset, expected) => {
    expect(intervalOffset(interval as TimeIntervalType, testDate, offset)).toEqual(
      parseDate(expected)
    );
  });
});

describe('isSameInterval()', () => {
  test.each([
    ['day', '2023-03-07T00:00', '2023-03-07T23:59', true],
    ['day', '2023-03-07T11:00', '2023-03-08T12:00', false],
    ['week', '2023-03-07', '2023-03-08', true],
    ['week', '2023-03-07', '2023-03-14', false],
    ['month', '2023-03-07', '2023-03-30', true],
    ['month', '2023-03-07', '2023-04-07', false],
    ['quarter', '2023-03-07', '2023-01-07', true],
    ['quarter', '2023-03-07', '2023-04-07', false],
    ['year', '2023-03-07', '2023-11-21', true],
    ['year', '2023-03-07', '2024-03-07', false],
  ])('isSameInterval(%s, %s, %s) => %s', (interval, date1, date2, expected) => {
    expect(isSameInterval(interval as TimeIntervalType, parseDate(date1), parseDate(date2))).toBe(
      expected
    );
  });
});

describe('intervalDifference()', () => {
  test.each([
    ['day', '2023-03-07T00:00', '2023-03-07T23:59', 0], // Same day
    ['day', '2023-03-07', '2023-03-08', 1], // Next day
    ['day', '2023-01-01', '2023-12-31', 364], // Full year
    ['day', '2023-01-01', '2024-01-01', 365], // Next year
    ['week', '2023-03-05', '2023-03-11', 0], // Same week
    ['week', '2023-03-07', '2023-03-14', 1], // Next week
    ['month', '2023-01-01', '2023-01-31', 0], // Same month
    ['month', '2023-01-01', '2023-02-01', 1], // Next month
    ['quarter', '2023-01-01', '2023-03-31', 0], // Same quarter
    ['quarter', '2023-01-01', '2023-04-01', 1], // Next quarter
    ['year', '2023-01-01', '2023-12-31', 0], // Same year
    ['year', '2023-01-01', '2024-01-01', 1], // Next year
  ])('intervalDifference(%s, %s, %s) => %s', (interval, date1, date2, expected) => {
    expect(
      intervalDifference(interval as TimeIntervalType, parseDate(date1), parseDate(date2))
    ).toEqual(expected);
  });
});

describe('isLeapYear()', () => {
  test.each([
    ['2020-01-01', true],
    ['2021-01-01', false],
    ['2022-01-01', false],
    ['2023-01-01', false],
    ['2024-01-01', true],
  ])('isLeapYear(%s) => %s', (date, expected) => {
    expect(isLeapYear(parseDate(date))).toBe(expected);
  });
});

describe('isDateWithin()', () => {
  test.each([
    ['2023-03-07', '2023-03-06', '2023-03-08', true], // between
    ['2023-03-07', '2023-03-07', '2023-03-08', true], // match start
    ['2023-03-07', '2023-03-06', '2023-03-07', true], // match end
    ['2023-03-07', '2023-03-08', '2023-03-09', false], // outside start
    ['2023-03-07', '2023-03-05', '2023-03-06', false], // outside end
  ])('isDateWithin(%s, %s) => %s', (date, start, end, expected) => {
    expect(
      isDateWithin(parseDate(date), {
        start: parseDate(start),
        end: parseDate(end),
      })
    ).toBe(expected);
  });
});
