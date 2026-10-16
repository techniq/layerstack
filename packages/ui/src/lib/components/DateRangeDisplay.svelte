<script lang="ts" module>
  import type { DateRange } from '@layerstack/utils/dateRange';

  export type DateRangeDisplayProps = {
    value?: DateRange | null;
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
  };
</script>

<script lang="ts">
  import { PeriodType, getDateFuncsByPeriodType } from '@layerstack/utils';

  import { getSettings } from './settingsState.svelte.js';

  let { value, utc = false }: DateRangeDisplayProps = $props();

  const settings = getSettings();

  const showToValue = $derived.by(() => {
    if (!value?.to) return false;
    if (!value?.from || !value?.periodType) return true;

    const { isSame } = getDateFuncsByPeriodType(settings.localeSettings, value.periodType, { utc });

    switch (value.periodType) {
      case PeriodType.Day:
      case PeriodType.Month:
      case PeriodType.CalendarYear:
      case PeriodType.FiscalYearOctober:
        return !isSame(value.from, value.to);
      default:
        // Week and quarter always show the "to" value
        return true;
    }
  });

  /** Period types that already display a range for a single value are shown by their sub-period */
  function getPeriodType(value: DateRange | null | undefined) {
    const periodType = value?.periodType ?? PeriodType.Day;

    switch (periodType) {
      case PeriodType.WeekSun:
      case PeriodType.WeekMon:
      case PeriodType.WeekTue:
      case PeriodType.WeekWed:
      case PeriodType.WeekThu:
      case PeriodType.WeekFri:
      case PeriodType.WeekSat:
      case PeriodType.Week:
      case PeriodType.BiWeek1Sun:
      case PeriodType.BiWeek1Mon:
      case PeriodType.BiWeek1Tue:
      case PeriodType.BiWeek1Wed:
      case PeriodType.BiWeek1Thu:
      case PeriodType.BiWeek1Fri:
      case PeriodType.BiWeek1Sat:
      case PeriodType.BiWeek1:
      case PeriodType.BiWeek2Sun:
      case PeriodType.BiWeek2Mon:
      case PeriodType.BiWeek2Tue:
      case PeriodType.BiWeek2Wed:
      case PeriodType.BiWeek2Thu:
      case PeriodType.BiWeek2Fri:
      case PeriodType.BiWeek2Sat:
      case PeriodType.BiWeek2:
        return PeriodType.Day;

      case PeriodType.Quarter:
        return PeriodType.Month;

      default:
        return periodType;
    }
  }
</script>

{#if value?.from}
  {settings.format(value.from, getPeriodType(value), { variant: 'long', utc })}
{:else}
  <div>&nbsp;</div>
{/if}

{#if value?.to && showToValue}
  <span> - </span>
  {settings.format(value.to, getPeriodType(value), { variant: 'long', utc })}
{/if}
