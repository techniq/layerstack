import { parseDate } from './date.js';
import { round } from './number.js';

// TODO: Support months or weeks?

export type DurationOption = {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  years?: number;
};

export enum DurationUnits {
  Year,
  Day,
  Hour,
  Minute,
  Second,
  Millisecond,
}

export class Duration {
  #milliseconds = 0;
  #seconds = 0;
  #minutes = 0;
  #hours = 0;
  #days = 0;
  #years = 0;

  constructor(
    options: {
      start?: Date | string;
      end?: Date | string | null;
      duration?: DurationOption;
    } = {}
  ) {
    const startDate = typeof options.start === 'string' ? parseDate(options.start) : options.start;
    const endDate = typeof options.end === 'string' ? parseDate(options.end) : options.end;

    const differenceInMs = startDate
      ? Math.abs(Number(endDate || new Date()) - Number(startDate))
      : undefined;

    if (!Number.isFinite(differenceInMs) && options.duration == null) {
      return;
    }

    this.#milliseconds = options.duration?.milliseconds ?? differenceInMs ?? 0;
    this.#seconds = options.duration?.seconds ?? 0;
    this.#minutes = options.duration?.minutes ?? 0;
    this.#hours = options.duration?.hours ?? 0;
    this.#days = options.duration?.days ?? 0;
    this.#years = options.duration?.years ?? 0;

    if (this.#milliseconds >= 1000) {
      const carrySeconds = (this.#milliseconds - (this.#milliseconds % 1000)) / 1000;
      this.#seconds += carrySeconds;
      this.#milliseconds = this.#milliseconds - carrySeconds * 1000;
    }

    if (this.#seconds >= 60) {
      const carryMinutes = (this.#seconds - (this.#seconds % 60)) / 60;
      this.#minutes += carryMinutes;
      this.#seconds = this.#seconds - carryMinutes * 60;
    }

    if (this.#minutes >= 60) {
      const carryHours = (this.#minutes - (this.#minutes % 60)) / 60;
      this.#hours += carryHours;
      this.#minutes = this.#minutes - carryHours * 60;
    }

    if (this.#hours >= 24) {
      const carryDays = (this.#hours - (this.#hours % 24)) / 24;
      this.#days += carryDays;
      this.#hours = this.#hours - carryDays * 24;
    }

    if (this.#days >= 365) {
      const carryYears = (this.#days - (this.#days % 365)) / 365;
      this.#years += carryYears;
      this.#days = this.#days - carryYears * 365;
    }
  }

  get years() {
    return this.#years;
  }

  get days() {
    return this.#days;
  }

  get hours() {
    return this.#hours;
  }

  get minutes() {
    return this.#minutes;
  }

  get seconds() {
    return this.#seconds;
  }

  get milliseconds() {
    return this.#milliseconds;
  }

  valueOf() {
    return (
      this.#milliseconds +
      this.#seconds * 1000 +
      this.#minutes * 60 * 1000 +
      this.#hours * 60 * 60 * 1000 +
      this.#days * 24 * 60 * 60 * 1000 +
      this.#years * 365 * 24 * 60 * 60 * 1000
    );
  }

  toJSON() {
    return {
      years: this.#years,
      days: this.#days,
      hours: this.#hours,
      minutes: this.#minutes,
      seconds: this.#seconds,
      milliseconds: this.#milliseconds,
    };
  }

  format(
    options: {
      minUnits?: DurationUnits;
      totalUnits?: number;
      fractional?: boolean;
      variant?: 'short' | 'long';
    } = {}
  ) {
    const { minUnits = 99, totalUnits = 99, fractional = false, variant = 'short' } = options;

    let sentenceArr = [];

    const unitNames =
      variant === 'short'
        ? ['y', 'd', 'h', 'm', 's', 'ms']
        : ['years', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

    const unitValues = [
      this.years,
      this.days,
      this.hours,
      this.minutes,
      this.seconds,
      this.milliseconds,
    ];

    const filteredUnitValues = unitValues.filter((x, i) => i <= minUnits);

    // Combine unit numbers and names
    for (let [i, unitValue] of filteredUnitValues.entries()) {
      if (sentenceArr.length >= totalUnits) {
        break;
      }

      let unitName = unitNames[i];
      const isLastUnit =
        i === filteredUnitValues.length - 1 ||
        (unitValue !== 0 && sentenceArr.length + 1 >= totalUnits);

      if (fractional && isLastUnit) {
        // Last unit, add fractional part of next unit
        let fraction = 0;
        switch (i) {
          case DurationUnits.Millisecond:
            // No more units
            break;
          case DurationUnits.Second:
            unitValue += round(this.milliseconds / 1000, 2);
            break;
          case DurationUnits.Minute:
            unitValue += round(this.seconds / 60, 2);
            break;
          case DurationUnits.Hour:
            unitValue += round(this.minutes / 60, 2);
            break;
          case DurationUnits.Day:
            unitValue += round(this.hours / 24, 2);
            break;
          case DurationUnits.Year:
            unitValue += round(this.days / 365, 2);
            break;
        }
      }

      // Hide `0` values unless last unit (and none shown before)
      if (unitValue !== 0 || (sentenceArr.length === 0 && isLastUnit)) {
        switch (variant) {
          case 'short':
            sentenceArr.push(unitValue + unitName);
            break;

          case 'long':
            if (unitValue === 1) {
              // Trim off plural `s`
              unitName = unitName.slice(0, -1);
            }
            sentenceArr.push(unitValue + ' ' + unitName);
            break;
        }
      }
    }

    const sentence = sentenceArr.join(variant === 'long' ? ' and ' : ' ');
    return sentence;
  }

  toString() {
    return this.format();
  }

  /**
   * Returns the ISO 8601 duration string representation of the duration.
   * @returns ISO 8601 duration string (e.g. "P3Y6M4DT12H30M5S")
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   */
  toISOString() {
    let str = 'P';
    if (this.#years) str += this.#years + 'Y';
    if (this.#days) str += this.#days + 'D';
    if (this.#hours || this.#minutes || this.#seconds || this.#milliseconds) str += 'T';
    if (this.#hours) str += this.#hours + 'H';
    if (this.#minutes) str += this.#minutes + 'M';
    if (this.#seconds || this.#milliseconds) {
      str += this.#seconds;
      if (this.#milliseconds) str += '.' + this.#milliseconds;
      str += 'S';
    }
    if (str === 'P') str = 'PT0S'; // zero duration
    return str;
  }
}
