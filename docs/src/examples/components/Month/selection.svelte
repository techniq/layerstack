<script lang="ts">
  import { Month } from '@layerstack/ui';

  const d = (day: number) => new Date(2026, 7, day);
</script>

<div class="grid grid-cols-3 gap-4">
  <!-- `selected` takes a single date, an array, or a `{ from, to }` range -->
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Single</div>
    <Month selected={d(12)} startOfMonth={d(1)} hideControls />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Array</div>
    <Month selected={[d(5), d(12), d(19)]} startOfMonth={d(1)} hideControls />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Range</div>
    <Month selected={{ from: d(8), to: d(17) }} startOfMonth={d(1)} hideControls />
  </div>
</div>
