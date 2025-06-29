import { describe, it, expect } from 'vitest';

import { Duration, DurationUnits } from './duration.js';
import { intervalOffset } from './date.js';

describe('Duration', () => {
  it('default', () => {
    const actual = new Duration();
    expect(actual.years).equal(0);
    expect(actual.days).equal(0);
    expect(actual.hours).equal(0);
    expect(actual.minutes).equal(0);
    expect(actual.seconds).equal(0);
    expect(actual.milliseconds).equal(0);
  });

  it('start/end range with strings', () => {
    const actual = new Duration({ start: '2025-05-19', end: '2025-05-20' });
    expect(actual.years).equal(0);
    expect(actual.days).equal(1);
    expect(actual.hours).equal(0);
    expect(actual.minutes).equal(0);
    expect(actual.seconds).equal(0);
    expect(actual.milliseconds).equal(0);
  });

  it('start/end range with Date objects', () => {
    const actual = new Duration({ start: new Date('2025-05-19'), end: new Date('2025-05-20') });
    expect(actual.years).equal(0);
    expect(actual.days).equal(1);
    expect(actual.hours).equal(0);
    expect(actual.minutes).equal(0);
    expect(actual.seconds).equal(0);
    expect(actual.milliseconds).equal(0);
  });

  it('start-only should use `now` for end', () => {
    const start = intervalOffset('day', new Date(), -10);
    const actual = new Duration({ start });
    expect(actual.years).equal(0);
    expect(actual.days).equal(10);
    expect(actual.hours).equal(0);
    expect(actual.minutes).equal(0);
    expect(actual.seconds).equal(0);
    // expect(actual.milliseconds).equal(0); // Ignoring just in case test timing is off
  });

  it('duration option', () => {
    const actual = new Duration({ duration: { seconds: 10 } });
    expect(actual.years).equal(0);
    expect(actual.days).equal(0);
    expect(actual.hours).equal(0);
    expect(actual.minutes).equal(0);
    expect(actual.seconds).equal(10);
    expect(actual.milliseconds).equal(0);
  });

  it('duration option with carryover seconds', () => {
    const actual = new Duration({ duration: { seconds: 90 } });
    expect(actual.years).equal(0);
    expect(actual.days).equal(0);
    expect(actual.hours).equal(0);
    expect(actual.minutes).equal(1);
    expect(actual.seconds).equal(30);
    expect(actual.milliseconds).equal(0);
  });

  it('duration option with carryover minutes', () => {
    const actual = new Duration({ duration: { minutes: 90 } });
    expect(actual.years).equal(0);
    expect(actual.days).equal(0);
    expect(actual.hours).equal(1);
    expect(actual.minutes).equal(30);
    expect(actual.seconds).equal(0);
    expect(actual.milliseconds).equal(0);
  });

  it('duration option with carryover hours', () => {
    const actual = new Duration({ duration: { hours: 30 } });
    expect(actual.years).equal(0);
    expect(actual.days).equal(1);
    expect(actual.hours).equal(6);
    expect(actual.minutes).equal(0);
    expect(actual.seconds).equal(0);
    expect(actual.milliseconds).equal(0);
  });

  it('duration comparison with explicit duration', () => {
    const duration1 = new Duration({ duration: { seconds: 10 } });
    const duration2 = new Duration({ duration: { seconds: 11 } });

    expect(duration1 < duration2).equal(true);
    expect(duration2 > duration1).equal(true);
    expect(duration1 != duration2).equal(true);
  });

  it('duration comparison with dates', () => {
    const duration1 = new Duration({ start: '2025-05-19', end: '2025-05-20' });
    const duration2 = new Duration({ start: '2025-05-19', end: '2025-05-21' });

    expect(duration1 < duration2).equal(true);
    expect(duration2 > duration1).equal(true);
  });

  it('duration comparison with dates and duration', () => {
    const duration = new Duration({ start: '2025-05-19', end: '2025-05-20' });

    const durationSame = new Duration({ duration: { days: 1 } });
    // TODO: Why is `valueOf()` not called implicitly?
    // expect(duration == durationSame).equal(true);
    expect(duration.valueOf() == durationSame.valueOf()).equal(true);

    const durationMore = new Duration({ duration: { days: 2 } });
    expect(duration < durationMore).equal(true);

    const durationLess = new Duration({ duration: { hours: 3 } });
    expect(duration > durationLess).equal(true);
  });

  it('toJSON', () => {
    const duration = new Duration({
      duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
    });
    const json = duration.toJSON();
    expect(json).eql({
      years: 0,
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      milliseconds: 5,
    });
  });

  it('toJSON', () => {
    const duration = new Duration({
      duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
    });
    const string = JSON.stringify(duration);
    expect(string).eql('{"years":0,"days":1,"hours":2,"minutes":3,"seconds":4,"milliseconds":5}');
  });

  it('reconstruct from JSON', () => {
    const duration = new Duration({
      duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
    });
    const json = JSON.parse(JSON.stringify(duration));
    const duration2 = new Duration({ duration: json });

    expect(duration2.years).equal(0);
    expect(duration2.days).equal(1);
    expect(duration2.hours).equal(2);
    expect(duration2.minutes).equal(3);
    expect(duration2.seconds).equal(4);
    expect(duration2.milliseconds).equal(5);
  });

  describe('format', () => {
    it('default', () => {
      const duration = new Duration({
        duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
      });
      const actual = duration.format();
      expect(actual).equal('1d 2h 3m 4s 5ms');
    });

    it('long variant', () => {
      const duration = new Duration({
        duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
      });
      const actual = duration.format({ variant: 'long' });
      expect(actual).equal('1 day and 2 hours and 3 minutes and 4 seconds and 5 milliseconds');
    });

    it('minUnits', () => {
      const duration = new Duration({
        duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
      });
      const actual = duration.format({ minUnits: DurationUnits.Hour });
      expect(actual).equal('1d 2h');
    });

    it('totalUnits', () => {
      const duration = new Duration({
        duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
      });
      const actual = duration.format({ totalUnits: 3 });
      expect(actual).equal('1d 2h 3m');
    });
  });

  it('toString', () => {
    const duration = new Duration({
      duration: { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
    });
    const actual = duration.toString();
    expect(actual).equal('1d 2h 3m 4s 5ms');
  });
});
