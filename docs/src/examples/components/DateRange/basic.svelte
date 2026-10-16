<script lang="ts">
  import { DateRange, DateRangeDisplay } from '@layerstack/ui';
  import type { DateRange as DateRangeType } from '@layerstack/utils/dateRange';

  let selected = $state<DateRangeType>({ from: null, to: null, periodType: null });
</script>

<DateRange bind:selected />

<div class="mt-3 text-sm text-surface-content/70">
  Selected: <DateRangeDisplay value={selected} />
</div>
