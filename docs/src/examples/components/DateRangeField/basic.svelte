<script lang="ts">
  import { DateRangeField, emptyDateRange } from '@layerstack/ui';
  import type { DateRange } from '@layerstack/utils/dateRange';

  let value = $state<DateRange>(emptyDateRange);
</script>

<div class="grid gap-4 max-w-sm">
  <DateRangeField bind:value />
  <DateRangeField bind:value label="Period" clearable />
  <DateRangeField bind:value dense />
</div>
