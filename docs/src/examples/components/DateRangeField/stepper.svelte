<script lang="ts">
  import { DateRangeField } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';
  import type { DateRange } from '@layerstack/utils/dateRange';

  const today = new Date();
  let value = $state<DateRange>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    periodType: PeriodType.Month,
  });
</script>

<div class="max-w-sm">
  <DateRangeField bind:value stepper center />
</div>
