import { describe, it, expect } from 'vitest';

import { format } from './format.js';
import { parseDate } from './date.js';
import { PeriodType } from './date_types.js';
import { testDate, testDateStr } from './date.test.js';

describe('format()', () => {
  it('returns empty string for null', () => {
    const actual = format(null);
    expect(actual).equal('');
  });

  it('returns empty string for undefined', () => {
    const actual = format(undefined);
    expect(actual).equal('');
  });

  describe('format based on value type', () => {
    it('integer', () => {
      const actual = format(1234);
      expect(actual).equal('1,234');
    });
    it('decimal', () => {
      const actual = format(1234.5678);
      expect(actual).equal('1,234.57');
    });
    it('date string', () => {
      const actual = format(testDateStr);
      expect(actual).equal('11/21/2023');
    });
    it('date', () => {
      const actual = format(parseDate(testDateStr));
      expect(actual).equal('11/21/2023');
    });
    it('string', () => {
      const actual = format('hello');
      expect(actual).equal('hello');
    });
  });

  describe('formats number', () => {
    // See `number.test.ts` for more number tests
    it('returns original value as string for style "none"', () => {
      const actual = format(1234.5678, 'none');
      expect(actual).equal('1234.5678');
    });

    it('formats with "integer" type', () => {
      const actual = format(1234.5678, 'integer');
      expect(actual).equal('1,235');
    });

    it('formats with "integer" config with default options', () => {
      const actual = format(1234.5678, { type: 'integer' });
      expect(actual).equal('1,235');
    });

    it('formats with "integer" config with extra options', () => {
      const actual = format(1234.5678, {
        type: 'integer',
        options: { maximumSignificantDigits: 2 },
      });
      expect(actual).equal('1,200');
    });

    it('formats with "decimal" config with default options', () => {
      const actual = format(1234.5678, { type: 'decimal' });
      expect(actual).equal('1,234.57');
    });

    it('formats with "decimal" config with locale (es)', () => {
      const actual = format(1234.5678, { type: 'decimal', locale: 'es' });
      expect(actual).equal('1234,57');
    });

    it('formats with "decimal" config with locale (de)', () => {
      const actual = format(1234.5678, { type: 'decimal', locale: 'de' });
      expect(actual).equal('1.234,57');
    });

    it('formats with "decimal" config with extra options', () => {
      const actual = format(1234.5678, { type: 'decimal', options: { fractionDigits: 3 } });
      expect(actual).equal('1,234.568');
    });

    it('formats with "currency" config with default options', () => {
      const actual = format(1234.5678, { type: 'currency' });
      expect(actual).equal('$1,234.57');
    });

    it('formats with "currency" config with extra options (currency)', () => {
      const actual = format(1234.5678, { type: 'currency', options: { currency: 'EUR' } });
      expect(actual).equal('€1,234.57');
    });

    it('formats with "currency" config with extra options (compact notation)', () => {
      const actual = format(1234.5678, {
        type: 'currency',
        options: { notation: 'compact' },
      });
      expect(actual).equal('$1.23K');
    });

    it('formats with "currency" config with extra options (compact notation with short display)', () => {
      const actual = format(1234.5678, {
        type: 'currency',
        options: { notation: 'compact', maximumSignificantDigits: 2 },
      });
      expect(actual).equal('$1.2K');
    });

    it('formats with custom function', () => {
      const actual = format(1234.5678, (value) => Math.round(value).toString());
      expect(actual).equal('1235');
    });
  });

  describe('formats date', () => {
    // See `date.test.ts` for more date tests
    it('formats date with PeriodType (date)', () => {
      const actual = format(testDate, PeriodType.Day);
      expect(actual).equal('11/21/2023');
    });

    it('formats date with period type code (date)', () => {
      const actual = format(testDate, 'day');
      expect(actual).equal('11/21/2023');
    });

    it('formats date with config with default options', () => {
      const actual = format(testDate, { type: 'day' });
      expect(actual).equal('11/21/2023');
    });

    it('formats date with config with locale', () => {
      const actual = format(testDate, { type: 'day', locale: 'es' });
      expect(actual).equal('21/11/2023');
    });

    it('formats date with config with locale', () => {
      const actual = format(testDate, { type: 'day', locale: 'de' });
      expect(actual).equal('21.11.2023');
    });

    it('formats date with config with extra options', () => {
      const actual = format(testDate, { type: 'day', options: { variant: 'short' } });
      expect(actual).equal('11/21');
    });
  });
});
