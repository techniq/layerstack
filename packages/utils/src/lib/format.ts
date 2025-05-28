import {
  formatDateWithLocale,
  getPeriodTypeNameWithLocale,
  getDayOfWeekName,
  isStringDate,
  periodTypeMappings,
} from './date.js';
import { formatNumberWithLocale } from './number.js';
import type { FormatNumberOptions, FormatNumberStyle } from './number.js';
import { defaultLocale, type LocaleSettings } from './locale.js';
import {
  PeriodType,
  type FormatDateOptions,
  DayOfWeek,
  type PeriodTypeCode,
} from './date_types.js';

export type CustomFormatter = (value: any) => string;
export type FormatType = FormatNumberStyle | PeriodType | PeriodTypeCode | CustomFormatter;
export type FormatConfig =
  | { type: FormatNumberStyle; options?: FormatNumberOptions }
  | { type: PeriodType | PeriodTypeCode; options?: FormatDateOptions };

// re-export for convenience
export type { FormatNumberStyle, PeriodType, PeriodTypeCode };

/**
 * Generic format which can handle Dates, Numbers, or custom format function
 */
export function format(value: null | undefined, format?: FormatType): string;
export function format(value: null | undefined, config: { type: FormatType }): string;
export function format(
  value: number,
  format?: FormatNumberStyle | CustomFormatter,
  options?: FormatNumberOptions
): string;
export function format(
  value: number,
  config: { type: FormatNumberStyle | CustomFormatter; options?: FormatNumberOptions }
): string;
export function format(
  value: string | Date,
  format?: PeriodType | PeriodTypeCode | CustomFormatter,
  options?: FormatDateOptions
): string;
export function format(
  value: string | Date,
  config: { type: PeriodType | PeriodTypeCode | CustomFormatter; options?: FormatDateOptions }
): string;
export function format(
  value: any,
  formatOrConfig?:
    | FormatType
    | { type: FormatType; options?: FormatNumberOptions | FormatDateOptions },
  options?: FormatNumberOptions | FormatDateOptions
): any {
  if (formatOrConfig && typeof formatOrConfig === 'object' && 'type' in formatOrConfig) {
    return formatWithLocale(defaultLocale, value, formatOrConfig.type, formatOrConfig.options);
  }
  return formatWithLocale(defaultLocale, value, formatOrConfig as FormatType, options);
}

// null | undefined
export function formatWithLocale(
  settings: LocaleSettings,
  value: null | undefined,
  format?: FormatType,
  options?: FormatNumberOptions | FormatDateOptions
): string;
export function formatWithLocale(
  settings: LocaleSettings,
  value: null | undefined,
  config: FormatConfig
): string;

// number
export function formatWithLocale(
  settings: LocaleSettings,
  value: number,
  format?: FormatNumberStyle | CustomFormatter,
  options?: FormatNumberOptions
): string;
export function formatWithLocale(
  settings: LocaleSettings,
  value: number,
  config: FormatConfig
): string;

// Date
export function formatWithLocale(
  settings: LocaleSettings,
  value: string | Date,
  format?: PeriodType | PeriodTypeCode | CustomFormatter,
  options?: FormatDateOptions
): string;
export function formatWithLocale(
  settings: LocaleSettings,
  value: string | Date,
  config: FormatConfig
): string;

export function formatWithLocale(
  settings: LocaleSettings,
  value: any,
  formatOrConfig?: FormatType | FormatConfig,
  options?: FormatNumberOptions | FormatDateOptions
) {
  const format =
    formatOrConfig && typeof formatOrConfig === 'object' && 'type' in formatOrConfig
      ? formatOrConfig.type
      : (formatOrConfig as FormatType);

  const formatOptions =
    formatOrConfig &&
    typeof formatOrConfig === 'object' &&
    'type' in formatOrConfig &&
    'options' in formatOrConfig
      ? formatOrConfig.options
      : options;

  if (typeof format === 'function') {
    return format(value);
  } else if (
    value instanceof Date ||
    isStringDate(value) ||
    (format &&
      (format in PeriodType ||
        Object.values(periodTypeMappings).includes(format as PeriodTypeCode)))
  ) {
    return formatDateWithLocale(
      settings,
      value,
      format as PeriodType | PeriodTypeCode,
      formatOptions as FormatDateOptions
    );
  } else if (typeof value === 'number') {
    return formatNumberWithLocale(
      settings,
      value,
      format as FormatNumberStyle,
      formatOptions as FormatNumberOptions
    );
  } else if (typeof value === 'string') {
    // Keep original value if already string
    return value;
  } else if (value == null) {
    return '';
  } else {
    // Provide some reasonable fallback for objects/etc (maybe use stringify() instead)
    return `${value}`;
  }
}

export type FormatFunction = ((
  value: number | null | undefined,
  style: FormatNumberStyle,
  options?: FormatNumberOptions
) => string) &
  ((
    value: Date | string | null | undefined,
    period: PeriodType | PeriodTypeCode,
    options?: FormatDateOptions
  ) => string);

export interface FormatFunctionProperties {
  getPeriodTypeName: (period: PeriodType) => string;
  getDayOfWeekName: (day: DayOfWeek) => string;
  settings: LocaleSettings;
}

export type FormatFunctions = FormatFunction & FormatFunctionProperties;

export function buildFormatters(settings: LocaleSettings): FormatFunctions {
  const mainFormat = (
    value: any,
    style: FormatNumberStyle | PeriodType | PeriodTypeCode,
    options?: FormatNumberOptions | FormatDateOptions
  ) => formatWithLocale(settings, value, style, options);

  mainFormat.settings = settings;

  mainFormat.getDayOfWeekName = (day: DayOfWeek) => getDayOfWeekName(day, settings.locale);
  mainFormat.getPeriodTypeName = (period: PeriodType) =>
    getPeriodTypeNameWithLocale(settings, period);

  return mainFormat;
}
