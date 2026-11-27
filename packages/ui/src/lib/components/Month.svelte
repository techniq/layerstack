<script lang="ts" module>
  import type { DisabledDate, SelectedDate } from '@layerstack/utils';

  export type MonthProps = {
    selected?: SelectedDate;
    /**
     * Use UTC boundaries rather than local ones, for both period math and display.
     *
     * Declared before `startOfMonth` so that prop's default can read it.
     */
    utc?: boolean;
    /** Bindable.  The month being displayed */
    startOfMonth?: Date;
    /** Hide the month controls, to drive the displayed month externally */
    hideControls?: boolean;
    /** Show days before and after the displayed month */
    showOutsideDays?: boolean;
    /** Dates that cannot be selected */
    disabledDates?: DisabledDate;
    onDateChange?: (date: Date) => void;
  };
</script>

<script lang="ts">
  import {
    PeriodType,
    hasKeyOf,
    startOfInterval,
    endOfInterval,
    intervalOffset,
  } from '@layerstack/utils';
  import { getMonthDaysByWeek, isDateWithin, isSameInterval } from '@layerstack/utils/date';

  import Button from './Button.svelte';
  import DateButton from './DateButton.svelte';
  import MonthListByYear from './MonthListByYear.svelte';
  import { getSettings } from './settingsState.svelte.js';

  let {
    selected,
    utc = false,
    startOfMonth = $bindable(),
    hideControls = false,
    showOutsideDays,
    disabledDates,
    onDateChange,
  }: MonthProps = $props();

  const settings = getSettings();

  const monthInterval = $derived(utc ? ('utcMonth' as const) : ('month' as const));
  const dayInterval = $derived(utc ? ('utcDay' as const) : ('day' as const));

  // Derive the initial month from the selection, then let the controls move it
  $effect.pre(() => {
    if (startOfMonth !== undefined) return;
    startOfMonth =
      (selected instanceof Date && startOfInterval(monthInterval, selected)) ||
      (selected instanceof Array &&
        selected.length &&
        startOfInterval(monthInterval, selected[0])) ||
      (selected &&
        hasKeyOf<{ from: Date }>(selected, 'from') &&
        selected.from &&
        startOfInterval(monthInterval, selected.from)) ||
      startOfInterval(monthInterval, new Date());
  });

  const displayedMonth = $derived(startOfMonth ?? startOfInterval(monthInterval, new Date()));
  const endOfMonth = $derived(endOfInterval(monthInterval, displayedMonth));

  const dateFormat = $derived(settings.format.settings.formats.dates);
  const monthDaysByWeek = $derived(
    getMonthDaysByWeek(displayedMonth, dateFormat.weekStartsOn, { utc })
  );

  const isDateDisabled = $derived((date: Date) => {
    if (disabledDates instanceof Function) return disabledDates(date);
    if (disabledDates instanceof Date) return isSameInterval(dayInterval, date, disabledDates);
    if (disabledDates instanceof Array) {
      return disabledDates.some((d) => isSameInterval(dayInterval, date, d));
    }
    if (disabledDates instanceof Object) {
      return isDateWithin(date, {
        start: startOfInterval(dayInterval, disabledDates.from),
        end: endOfInterval(dayInterval, disabledDates.to || disabledDates.from),
      });
    }
    return false;
  });

  const isCurrentMonth = $derived((day: Date) =>
    isDateWithin(day, { start: displayedMonth, end: endOfMonth })
  );

  let showMonthSelect = $state(false);
</script>

{#if showMonthSelect}
  <div class="max-h-[350px] overflow-auto">
    <MonthListByYear
      selected={displayedMonth}
      {utc}
      onDateChange={(date) => {
        startOfMonth = date;
        showMonthSelect = false;
      }}
    />
  </div>
{:else}
  {#if !hideControls}
    <div class="flex m-2">
      <Button
        icon={settings.icons.chevronLeft}
        class="p-2"
        onclick={() => (startOfMonth = intervalOffset(monthInterval, displayedMonth, -1))}
      />

      <div class="flex flex-1 items-center justify-center">
        <Button onclick={() => (showMonthSelect = true)}>
          {settings.format(displayedMonth, PeriodType.MonthYear, { utc })}
        </Button>
      </div>

      <Button
        icon={settings.icons.chevronRight}
        class="p-2"
        onclick={() => (startOfMonth = intervalOffset(monthInterval, displayedMonth, 1))}
      />
    </div>
  {/if}

  <div class="grid grid-cols-7">
    {#each monthDaysByWeek[0] ?? [] as day (day.getDate())}
      <div class="text-center">
        <span class="text-xs text-surface-content/50">
          {settings.format(day, PeriodType.Day, { custom: 'eee', utc })}
        </span>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-7 grid-rows-6 gap-y-4">
    {#each monthDaysByWeek ?? [] as week, weekIndex (weekIndex)}
      {#each week ?? [] as day (day.valueOf())}
        <DateButton
          date={day}
          periodType={PeriodType.Day}
          {selected}
          hidden={!isCurrentMonth(day) && !showOutsideDays}
          fade={!isCurrentMonth(day) && !!showOutsideDays}
          disabled={isDateDisabled(day)}
          {utc}
          {onDateChange}
        />
      {/each}
    {/each}
  </div>
{/if}
