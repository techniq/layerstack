<script lang="ts" module>
  import type { SelectedDate } from '@layerstack/utils';

  export type MonthListByYearProps = {
    selected?: SelectedDate;
    minDate?: Date;
    maxDate?: Date;
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
    onDateChange?: (date: Date) => void;
  };
</script>

<script lang="ts">
  import { intervalOffset } from '@layerstack/utils';
  import { getMinSelectedDate, getMaxSelectedDate } from '@layerstack/utils/date';

  import Button from './Button.svelte';
  import MonthList from './MonthList.svelte';

  let { selected, minDate, maxDate, utc = false, onDateChange }: MonthListByYearProps = $props();

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
</script>

<div class="grid divide-y">
  <Button onclick={() => (minYear = resolvedMinYear - 10)}>More</Button>

  {#each years ?? [] as year (year)}
    <div class="grid grid-cols-[auto_1fr] items-center gap-2 p-2">
      <div class="text-xl font-bold">
        {year}
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-y-4">
        <MonthList {year} {selected} {utc} {onDateChange} />
      </div>
    </div>
  {/each}

  <Button onclick={() => (maxYear = resolvedMaxYear + 10)}>More</Button>
</div>
