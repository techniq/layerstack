<script lang="ts">
  import { DateRangeField, emptyDateRange } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';
  import type { DateRange } from '@layerstack/utils/dateRange';

  const today = new Date();
  const daysAgo = (days: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);

  let value = $state<DateRange>(emptyDateRange);

  const quickPresets = [
    { label: 'Last 7 days', value: { from: daysAgo(6), to: today, periodType: PeriodType.Day } },
    { label: 'Last 30 days', value: { from: daysAgo(29), to: today, periodType: PeriodType.Day } },
  ];
</script>

<div class="max-w-sm">
  <DateRangeField bind:value {quickPresets} />
</div>
