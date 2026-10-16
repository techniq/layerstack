<script lang="ts">
  import { DateRange } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';
  import type { DateRange as DateRangeType } from '@layerstack/utils/dateRange';

  let selected = $state<DateRangeType>({ from: null, to: null, periodType: PeriodType.Month });
</script>

<DateRange
  bind:selected
  periodTypes={[PeriodType.Day, PeriodType.Month, PeriodType.CalendarYear]}
/>
