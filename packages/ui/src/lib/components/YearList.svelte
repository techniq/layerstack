<script lang="ts" module>
  import type { DisabledDate, SelectedDate } from '@layerstack/utils';

  import type { DateButtonProps } from './DateButton.svelte';

  export type YearListProps = {
    selected?: SelectedDate;
    minDate?: Date;
    maxDate?: Date;
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
    intervalOffset,
    isSameInterval,
    startOfInterval,
    endOfInterval,
    isDateWithin,
  } from '@layerstack/utils';
  import { getMinSelectedDate, getMaxSelectedDate } from '@layerstack/utils/date';

  import Button from './Button.svelte';
  import DateButton from './DateButton.svelte';

  let {
    selected,
    minDate,
    maxDate,
    format,
    utc = false,
    disabledDates,
    onDateChange,
  }: YearListProps = $props();

  const yearInterval = $derived(utc ? ('utcYear' as const) : ('year' as const));
  const getYear = $derived((date: Date) => (utc ? date.getUTCFullYear() : date.getFullYear()));

  // Seeded from the props, then extended by the "More" buttons
  let minYear = $state<number | undefined>();
  let maxYear = $state<number | undefined>();

  const resolvedMinYear = $derived(
    minYear ??
      (minDate
        ? getYear(minDate)
        : getYear(intervalOffset(yearInterval, getMinSelectedDate(selected) || new Date(), -2)))
  );
  const resolvedMaxYear = $derived(
    maxYear ??
      (maxDate
        ? getYear(maxDate)
        : getYear(intervalOffset(yearInterval, getMaxSelectedDate(selected) || new Date(), 2)))
  );

  const years = $derived(
    Array.from({ length: resolvedMaxYear - resolvedMinYear + 1 }, (_, i) => resolvedMinYear + i)
  );

  // In UTC mode the year starts have to be built from UTC fields, or flooring them with `utcYear`
  // lands in the neighbouring year.
  const yearDates = $derived(
    years.map((year) => (utc ? new Date(Date.UTC(year, 0, 1)) : new Date(year, 0, 1)))
  );

  const isDateDisabled = $derived((date: Date) => {
    if (disabledDates instanceof Function) return disabledDates(date);
    if (disabledDates instanceof Date) return isSameInterval(yearInterval, date, disabledDates);
    if (disabledDates instanceof Array) {
      return disabledDates.some((d) => isSameInterval(yearInterval, date, d));
    }
    if (disabledDates instanceof Object) {
      return isDateWithin(date, {
        start: startOfInterval(yearInterval, disabledDates.from),
        end: endOfInterval(yearInterval, disabledDates.to || disabledDates.from),
      });
    }
    return false;
  });
</script>

<div class="grid">
  <Button onclick={() => (minYear = resolvedMinYear - 1)} class="border-b">More</Button>

  <div class="grid p-2">
    {#each yearDates as year (year.valueOf())}
      <DateButton
        date={year}
        periodType={PeriodType.CalendarYear}
        {selected}
        disabled={isDateDisabled(year)}
        {format}
        {utc}
        {onDateChange}
      />
    {/each}
  </div>

  <Button onclick={() => (maxYear = resolvedMaxYear + 1)} class="border-t">More</Button>
</div>
