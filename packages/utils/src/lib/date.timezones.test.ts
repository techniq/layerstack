import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { localToUtcDate, utcToLocalDate } from './date.js';

/**
 * Timezone-independent invariants for `utcToLocalDate()` / `localToUtcDate()`.
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
});
