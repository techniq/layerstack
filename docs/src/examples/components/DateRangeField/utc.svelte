<script lang="ts">
  import { DateRangeDisplay, DateRangeField, emptyDateRange } from '@layerstack/ui';
  import type { DateRange } from '@layerstack/utils/dateRange';

  let local = $state<DateRange>(emptyDateRange);
  let utc = $state<DateRange>(emptyDateRange);
</script>

<div class="grid gap-4 max-w-sm">
  <DateRangeField label="Local" bind:value={local} />
  <DateRangeField label="UTC" bind:value={utc} utc />
</div>

<!-- The same picked day differs by the viewer's offset -->
<div class="mt-3 text-sm text-surface-content/70 grid gap-1">
  <div>local: {local.from?.toISOString() ?? '(none)'} → {local.to?.toISOString() ?? '(none)'}</div>
  <div>utc: {utc.from?.toISOString() ?? '(none)'} → {utc.to?.toISOString() ?? '(none)'}</div>
  <div>display: <DateRangeDisplay value={local} /></div>
</div>
