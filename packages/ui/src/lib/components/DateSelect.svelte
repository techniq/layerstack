<script lang="ts" module>
  import { PeriodType, type DisabledDate, type SelectedDate } from '@layerstack/utils';

  export type DateSelectProps = {
    selected?: SelectedDate;
    periodType?: PeriodType;
    /** Which end of a range is being picked */
    activeDate?: 'from' | 'to';
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
    /** Dates that cannot be selected */
    disabledDates?: DisabledDate;
    onDateChange?: (date: Date) => void;
  };
</script>

<script lang="ts">
  /*
    TODO (carried over from Svelte UX):
      - [ ] Set max-height / overflow on MonthListByYear, YearList
  */
  import { startOfInterval } from '@layerstack/utils';

  import Month from './Month.svelte';
  import MonthListByYear from './MonthListByYear.svelte';
  import YearList from './YearList.svelte';

  let {
    selected = null,
    periodType = PeriodType.Day,
    activeDate = 'from',
    utc = false,
    disabledDates,
    onDateChange,
  }: DateSelectProps = $props();

  const startOfMonth = $derived.by(() => {
    const active = (selected as Record<string, Date> | null)?.[activeDate];
    return active ? startOfInterval(utc ? 'utcMonth' : 'month', active) : undefined;
  });
</script>

{#if periodType === PeriodType.Month || periodType === PeriodType.Quarter}
  <MonthListByYear {selected} {utc} {onDateChange} />
{:else if periodType === PeriodType.CalendarYear || periodType === PeriodType.FiscalYearOctober}
  <YearList {selected} {disabledDates} {utc} {onDateChange} />
{:else}
  <!-- Day, Week, etc -->
  <Month {selected} {disabledDates} {startOfMonth} {utc} {onDateChange} />
{/if}
