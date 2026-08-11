import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  endOfInterval,
  formatDate,
  getDateFuncsByPeriodType,
  getMonthDaysByWeek,
  intervalOffset,
  localToUtcDate,
  startOfInterval,
  timeInterval,
  utcToLocalDate,
} from './date.js';
import { getDateRangePresets } from './dateRange.js';
import { PeriodType, type TimeIntervalType } from './date_types.js';
import { defaultLocale } from './locale.js';

/**
 * Timezone-independent invariants: the `utcToLocalDate()` / `localToUtcDate()` pair, and the
 * `utc*` time intervals.
 *
 * The assertions in `date.test.ts` are written against the single offset the suite runs under
 * (`TZ=UTC+4`, which POSIX inverts to UTC-4), so they can only ever exercise one side of the
 * world — which is how a year-boundary bug in `utcToLocalDate()` survived. Everything here
 * must hold in *any* zone, so each block re-runs the same assertions under a different one.
 *
 * Node (>= 16) applies `process.env.TZ` at runtime, so no separate test command or CI step is
 * needed — `pnpm test:unit` covers the whole matrix.
 */
const TIMEZONES = [
  'UTC',
  'America/New_York', // UTC-5/-4, northern DST
  'Asia/Tokyo', // UTC+9, no DST
  'Australia/Sydney', // UTC+10/+11, southern DST
  'Pacific/Kiritimati', // UTC+14, furthest ahead
  'Pacific/Midway', // UTC-11, furthest behind
];

/**
 * Instants on the boundaries where naive conversions break.
 *
 * Both functions rebuild a date from calendar fields, which is inherently lossy across a DST
 * spring-forward gap (the reconstructed wall clock doesn't exist and JS silently shifts it).
 * Keep these clear of 00:00-04:00, the window transitions land in, or the round-trips below
 * will fail for reasons that aren't a bug in the conversion.
 */
const INSTANTS = [
  '2026-08-10T12:00:00.000Z', // midday
  '2026-08-10T23:59:59.999Z', // last ms of the UTC day — next day east of UTC
  '2024-01-01T12:00:00.000Z', // year boundary
  '2026-12-31T23:59:59.999Z', // year boundary
  '2026-03-08T12:30:00.000Z', // northern DST transition day
  '2026-11-01T12:30:00.000Z', // northern DST transition day
  '2026-04-05T12:30:00.000Z', // southern DST transition day
  '2026-06-15T12:34:56.789Z', // sub-second precision
];

describe.each(TIMEZONES)('TZ=%s', (timeZone) => {
  const original = process.env.TZ;
  beforeAll(() => {
    process.env.TZ = timeZone;
  });
  afterAll(() => {
    process.env.TZ = original;
  });

  describe('utcToLocalDate()', () => {
    it.each(INSTANTS)('reads UTC calendar fields back as local fields (%s)', (iso) => {
      const utc = new Date(iso);
      const local = utcToLocalDate(utc);

      expect(local.getFullYear()).equal(utc.getUTCFullYear());
      expect(local.getMonth()).equal(utc.getUTCMonth());
      expect(local.getDate()).equal(utc.getUTCDate());
      expect(local.getHours()).equal(utc.getUTCHours());
      expect(local.getMinutes()).equal(utc.getUTCMinutes());
      expect(local.getSeconds()).equal(utc.getUTCSeconds());
      expect(local.getMilliseconds()).equal(utc.getUTCMilliseconds());
    });
  });

  describe('localToUtcDate()', () => {
    it.each(INSTANTS)('reads local calendar fields back as UTC fields (%s)', (iso) => {
      const local = new Date(iso);
      const utc = localToUtcDate(local);

      expect(utc.getUTCFullYear()).equal(local.getFullYear());
      expect(utc.getUTCMonth()).equal(local.getMonth());
      expect(utc.getUTCDate()).equal(local.getDate());
      expect(utc.getUTCHours()).equal(local.getHours());
      expect(utc.getUTCMinutes()).equal(local.getMinutes());
      expect(utc.getUTCSeconds()).equal(local.getSeconds());
      expect(utc.getUTCMilliseconds()).equal(local.getMilliseconds());
    });
  });

  describe('round-trip', () => {
    it.each(INSTANTS)('localToUtcDate(utcToLocalDate(d)) === d (%s)', (iso) => {
      expect(localToUtcDate(utcToLocalDate(new Date(iso))).toISOString()).equal(iso);
    });

    it.each(INSTANTS)('utcToLocalDate(localToUtcDate(d)) === d (%s)', (iso) => {
      const date = new Date(iso);
      expect(utcToLocalDate(localToUtcDate(date)).getTime()).equal(date.getTime());
    });
  });

  describe('utc intervals', () => {
    // The whole point of the `utc*` names: identical results in every zone.
    const date = new Date('2026-08-10T17:43:12.500Z');

    it('startOfInterval() floors to the UTC boundary', () => {
      expect(startOfInterval('utcDay', date).toISOString()).equal('2026-08-10T00:00:00.000Z');
      expect(startOfInterval('utcMonth', date).toISOString()).equal('2026-08-01T00:00:00.000Z');
      expect(startOfInterval('utcQuarter', date).toISOString()).equal('2026-07-01T00:00:00.000Z');
      expect(startOfInterval('utcYear', date).toISOString()).equal('2026-01-01T00:00:00.000Z');
    });

    it('endOfInterval() returns the last ms of the UTC interval', () => {
      expect(endOfInterval('utcDay', date).toISOString()).equal('2026-08-10T23:59:59.999Z');
      expect(endOfInterval('utcMonth', date).toISOString()).equal('2026-08-31T23:59:59.999Z');
      expect(endOfInterval('utcQuarter', date).toISOString()).equal('2026-09-30T23:59:59.999Z');
      expect(endOfInterval('utcYear', date).toISOString()).equal('2026-12-31T23:59:59.999Z');
    });

    it('intervalOffset() shifts by whole UTC intervals', () => {
      const utcMidnight = new Date('2026-08-10T00:00:00.000Z');
      expect(intervalOffset('utcDay', utcMidnight, -6).toISOString()).equal(
        '2026-08-04T00:00:00.000Z'
      );
      // `offset` shifts, it does not floor — the day of month is preserved.
      expect(intervalOffset('utcMonth', utcMidnight, 1).toISOString()).equal(
        '2026-09-10T00:00:00.000Z'
      );
    });

    it('offsets across a DST transition without shifting the time of day', () => {
      // `'day'` crosses *local* day boundaries, so a local DST transition inside the range
      // moves the UTC time of day. `'utcDay'` must not.
      const beforeSpringForward = new Date('2026-03-05T00:00:00.000Z');
      expect(intervalOffset('utcDay', beforeSpringForward, 7).toISOString()).equal(
        '2026-03-12T00:00:00.000Z'
      );
    });

    it.each([
      ['millisecond', 'utcMillisecond'],
      ['second', 'utcSecond'],
      ['minute', 'utcMinute'],
      ['hour', 'utcHour'],
      ['day', 'utcDay'],
      ['week', 'utcWeek'],
      ['month', 'utcMonth'],
      ['quarter', 'utcQuarter'],
      ['year', 'utcYear'],
    ] as [TimeIntervalType, TimeIntervalType][])(
      'timeInterval() resolves both %s and %s',
      (local, utc) => {
        expect(timeInterval(local)).toBeDefined();
        expect(timeInterval(utc)).toBeDefined();
      }
    );

    it.each([
      'utcMinute',
      'utcHour',
      'utcDay',
      'utcWeek',
      'utcMonth',
      'utcQuarter',
      'utcYear',
    ] as TimeIntervalType[])('timeInterval(%s) is distinct from its local counterpart', (utc) => {
      // `utcMillisecond`/`utcSecond` are excluded: d3 aliases them to the local intervals,
      // since those boundaries don't depend on the timezone.
      const local = (utc.charAt(3).toLowerCase() + utc.slice(4)) as TimeIntervalType;
      expect(timeInterval(utc)).not.toBe(timeInterval(local));
    });

    it.each([
      ['utcDay', '2026-08-10T00:00:00.000Z'],
      ['utcWeek', '2026-08-09T00:00:00.000Z'], // d3 weeks start Sunday
      ['utcMonth', '2026-08-01T00:00:00.000Z'],
      ['utcQuarter', '2026-07-01T00:00:00.000Z'],
      ['utcYear', '2026-01-01T00:00:00.000Z'],
    ] as [TimeIntervalType, string][])('%s floors to %s in every zone', (interval, expected) => {
      expect(startOfInterval(interval, date).toISOString()).equal(expected);
    });
  });

  describe('{ utc: true }', () => {
    // `2026-08-10T00:00:00Z` is the previous day west of UTC and midday-ish east of it, so any
    // helper that leaks local time reports a different calendar day in at least one zone.
    const date = new Date('2026-08-10T00:00:00.000Z');

    describe('formatDate()', () => {
      it('renders the UTC calendar day for a unicode/strftime format', () => {
        expect(formatDate(date, 'yyyy-MM-dd', { utc: true })).equal('2026-08-10');
      });

      it('renders the UTC calendar day for a period type', () => {
        expect(formatDate(date, PeriodType.Day, { utc: true, variant: 'short' })).equal('8/10');
      });

      it('differs from local formatting exactly when the UTC day differs', () => {
        // Proves `utc` actually takes effect: it must change the output wherever the local and
        // UTC calendar days disagree, and leave it alone where they agree.
        const sameCalendarDay = date.getDate() === date.getUTCDate();
        const asUtc = formatDate(date, PeriodType.Day, { utc: true, variant: 'short' });
        const asLocal = formatDate(date, PeriodType.Day, { variant: 'short' });
        expect(asUtc === asLocal).equal(sameCalendarDay);
      });

      it('renders the UTC month/year', () => {
        expect(formatDate(date, PeriodType.MonthYear, { utc: true })).contains('2026');
        expect(
          formatDate(new Date('2026-12-31T23:59:59.999Z'), PeriodType.CalendarYear, {
            utc: true,
          })
        ).equal('2026');
      });

      it('honours an explicit timeZone in custom Intl options over utc', () => {
        const formatted = formatDate(date, PeriodType.Custom, {
          utc: true,
          custom: { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' },
        });
        expect(formatted).equal('08/10/2026');
      });
    });

    describe('getDateFuncsByPeriodType()', () => {
      it('floors a day on the UTC boundary', () => {
        const { start, end } = getDateFuncsByPeriodType(defaultLocale, PeriodType.Day, {
          utc: true,
        });
        expect(start(date).toISOString()).equal('2026-08-10T00:00:00.000Z');
        expect(end(date).toISOString()).equal('2026-08-10T23:59:59.999Z');
      });

      it('floors a week on the UTC boundary', () => {
        const { start, end } = getDateFuncsByPeriodType(defaultLocale, PeriodType.WeekMon, {
          utc: true,
        });
        // 2026-08-10 is a Monday
        expect(start(date).toISOString()).equal('2026-08-10T00:00:00.000Z');
        expect(end(date).toISOString()).equal('2026-08-16T23:59:59.999Z');
      });

      it('floors a month/quarter/year on the UTC boundary', () => {
        for (const [periodType, from, to] of [
          [PeriodType.Month, '2026-08-01T00:00:00.000Z', '2026-08-31T23:59:59.999Z'],
          [PeriodType.Quarter, '2026-07-01T00:00:00.000Z', '2026-09-30T23:59:59.999Z'],
          [PeriodType.CalendarYear, '2026-01-01T00:00:00.000Z', '2026-12-31T23:59:59.999Z'],
        ] as const) {
          const { start, end } = getDateFuncsByPeriodType(defaultLocale, periodType, { utc: true });
          expect(start(date).toISOString()).equal(from);
          expect(end(date).toISOString()).equal(to);
        }
      });

      it('floors a fiscal year on the UTC boundary', () => {
        const { start, end } = getDateFuncsByPeriodType(
          defaultLocale,
          PeriodType.FiscalYearOctober,
          { utc: true }
        );
        expect(start(date).toISOString()).equal('2025-10-01T00:00:00.000Z');
        expect(end(date).toISOString()).equal('2026-09-30T23:59:59.999Z');
      });

      it('floors a bi-week on the UTC boundary', () => {
        const { start, end } = getDateFuncsByPeriodType(defaultLocale, PeriodType.BiWeek1Sun, {
          utc: true,
        });
        // Whatever the bi-week grid resolves to, both ends must land on UTC midnight/end-of-day
        expect(start(date).toISOString()).match(/T00:00:00\.000Z$/);
        expect(end(date).toISOString()).match(/T00:00:00\.000Z$/);
      });
    });

    it('getMonthDaysByWeek() returns UTC-midnight days', () => {
      const weeks = getMonthDaysByWeek(date, 0, { utc: true });
      for (const day of weeks.flat()) {
        expect(day.toISOString()).match(/T00:00:00\.000Z$/);
      }
    });

    it('getDateRangePresets() derives presets from UTC boundaries', () => {
      const presets = getDateRangePresets(defaultLocale, PeriodType.Day, { utc: true });
      expect(presets.length).toBeGreaterThan(0);
      for (const { value } of presets) {
        expect(value.from!.toISOString()).match(/T00:00:00\.000Z$/);
        expect(value.to!.toISOString()).match(/T23:59:59\.999Z$/);
      }
    });
  });
});
