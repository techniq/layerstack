<script lang="ts">
  import { Duration } from '@layerstack/ui';
  import { DurationUnits } from '@layerstack/utils';

  const start = new Date(Date.now() - 1000 * 60 * 60 * 26);
  const fixedEnd = new Date(Date.now() - 1000 * 60 * 60 * 24);
</script>

<div class="grid gap-2 text-sm">
  <div>Ticking since 26h ago: <Duration {start} /></div>
  <div>Fixed range: <Duration {start} end={fixedEnd} /></div>
  <div>Long variant: <Duration {start} end={fixedEnd} variant="long" /></div>
  <div>
    Minutes and up: <Duration {start} end={fixedEnd} minUnits={DurationUnits.Minute} />
  </div>
</div>
