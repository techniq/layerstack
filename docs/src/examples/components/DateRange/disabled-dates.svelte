<script lang="ts">
  import { DateRange } from '@layerstack/ui';
  import type { DateRange as DateRangeType } from '@layerstack/utils/dateRange';

  let selected = $state<DateRangeType>({ from: null, to: null, periodType: null });

  // Weekends cannot be picked
  const disabledDates = (date: Date) => [0, 6].includes(date.getDay());
</script>

<DateRange bind:selected {disabledDates} />
