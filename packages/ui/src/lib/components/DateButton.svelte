<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    DateToken,
    PeriodType,
    type CustomIntlDateTimeFormatOptions,
    type SelectedDate,
  } from '@layerstack/utils';

  import type { ButtonProps } from './Button.svelte';

  /** `Day` renders just the day number; other period types use their default format */
  function getCustomFormat(periodType: PeriodType) {
    return periodType === PeriodType.Day ? DateToken.DayOfMonth_numeric : undefined;
  }

  type DateButtonOwnProps = {
    date: Date;
    periodType: PeriodType;
    disabled?: boolean;
    selected?: SelectedDate;
    /** Occupy space without being visible or interactive */
    hidden?: boolean;
    /** Dim the button (ex. days outside the displayed month) */
    fade?: boolean;
    format?: CustomIntlDateTimeFormatOptions;
    variant?: ButtonProps['variant'];
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
    class?: string;
    /** Called with the button's date when clicked */
    onDateChange?: (date: Date) => void;
  };

  export type DateButtonProps = DateButtonOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof DateButtonOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { getDateFuncsByPeriodType, isDateWithin } from '@layerstack/utils';

  import Button from './Button.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const { classes: settingsClasses, defaults } = getComponentSettings('DateButton');
  const settings = getSettings();

  let {
    date,
    periodType,
    disabled = false,
    selected,
    hidden = false,
    fade = false,
    format,
    variant = defaults.variant,
    utc = false,
    class: className,
    onDateChange,
    ...restProps
  }: DateButtonProps = $props();

  const resolvedFormat = $derived(format ?? getCustomFormat(periodType));

  const dateFuncs = $derived(
    getDateFuncsByPeriodType(settings.localeSettings, periodType, { utc })
  );

  const isSelected = $derived.by(() => {
    const { start, end, isSame } = dateFuncs;
    if (selected instanceof Date) return isSame(date, selected);
    if (selected instanceof Array) return selected.some((d) => isSame(date, d));
    if (selected instanceof Object) {
      return selected.from
        ? isDateWithin(date, {
            start: start(selected.from),
            end: end(selected.to ?? selected.from),
          })
        : false;
    }
    return false;
  });

  const isSelectedStart = $derived.by(() => {
    const { isSame } = dateFuncs;
    if (selected instanceof Date) return isSame(date, selected);
    if (selected instanceof Array) return selected.some((d) => isSame(date, d));
    if (selected instanceof Object) return isSame(date, (selected.from ?? selected.to) as Date);
    return false;
  });

  const isSelectedEnd = $derived.by(() => {
    const { isSame } = dateFuncs;
    if (selected instanceof Date) return isSame(date, selected);
    if (selected instanceof Array) return selected.some((d) => isSame(date, d));
    if (selected instanceof Object) return isSame(date, (selected.to ?? selected.from) as Date);
    return false;
  });

  const isCurrent = $derived(dateFuncs.isSame(date, new Date()));

  const isVerticalSelection = $derived(
    periodType === PeriodType.CalendarYear || periodType === PeriodType.FiscalYearOctober
  );
</script>

<div
  {...restProps}
  class={cls(
    'DateButton',
    'inline-flex items-center justify-center',
    isSelectedStart ? 'from-transparent' : 'from-primary',
    isSelectedEnd ? 'to-transparent' : 'to-primary',
    isSelected &&
      (isVerticalSelection ? 'bg-linear-to-b from-50% to-50%' : 'bg-linear-to-r from-50% to-50%'),
    hidden && 'opacity-0 pointer-events-none',
    settingsClasses.root,
    className
  )}
>
  <Button
    class={cls(
      'w-8 h-8 rounded-full text-xs transition-none',
      periodType !== PeriodType.Day && 'flex-1',
      (disabled || fade) && 'opacity-25',
      isCurrent ? 'font-bold' : 'font-normal'
    )}
    variant={isSelected ? 'fill' : (variant ?? 'default')}
    color={isSelected || isCurrent ? 'primary' : 'default'}
    {disabled}
    onclick={() => {
      // `selected` is deliberately not set here — the parent owns it, since it may be a range,
      // an array, or a single date
      onDateChange?.(date);
    }}
  >
    {settings.format(date, periodType, { custom: resolvedFormat, utc })}
  </Button>
</div>
