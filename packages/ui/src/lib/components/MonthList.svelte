<script lang="ts" module>
  import type { DisabledDate, SelectedDate } from '@layerstack/utils';

  import type { DateButtonProps } from './DateButton.svelte';

  export type MonthListProps = {
    year?: number;
    selected?: SelectedDate;
    /** Defaults to the short month name */
    format?: DateButtonProps['format'];
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
    /** Dates that cannot be selected */
    disabledDates?: DisabledDate;
    onDateChange?: (date: Date) => void;
  };
</script>

<script lang="ts">
  import {
    PeriodType,
    isSameInterval,
    startOfInterval,
    endOfInterval,
    isDateWithin,
  } from '@layerstack/utils';
  import { getMonths } from '@layerstack/utils/date';

  import DateButton from './DateButton.svelte';

  let {
    year,
    selected,
    format = 'MMM',
    utc = false,
    disabledDates,
    onDateChange,
  }: MonthListProps = $props();

  const monthInterval = $derived(utc ? ('utcMonth' as const) : ('month' as const));

  // `getMonths()` builds *local* month starts.  In UTC mode they have to be built from UTC fields
  // instead, or flooring them with `utcMonth` lands in the neighbouring month.
  const months = $derived(
    utc
      ? Array.from(
          { length: 12 },
          (_, i) => new Date(Date.UTC(year ?? new Date().getUTCFullYear(), i, 1))
        )
      : getMonths(year)
  );

  const isDateDisabled = $derived((date: Date) => {
    if (disabledDates instanceof Function) return disabledDates(date);
    if (disabledDates instanceof Date) return isSameInterval(monthInterval, date, disabledDates);
    if (disabledDates instanceof Array) {
      return disabledDates.some((d) => isSameInterval(monthInterval, date, d));
    }
    if (disabledDates instanceof Object) {
      return isDateWithin(date, {
        start: startOfInterval(monthInterval, disabledDates.from),
        end: endOfInterval(monthInterval, disabledDates.to || disabledDates.from),
      });
    }
    return false;
  });
</script>

{#each months ?? [] as month (month.valueOf())}
  <DateButton
    date={month}
    periodType={PeriodType.Month}
    {selected}
    disabled={isDateDisabled(month)}
    {format}
    {utc}
    {onDateChange}
  />
{/each}
