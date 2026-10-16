<script lang="ts">
  import { MonthList } from '@layerstack/ui';

  let selected = $state<Date | null>(null);
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-y-2 max-w-sm">
  <MonthList year={2024} {selected} onDateChange={(date) => (selected = date)} />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Selected: {selected?.toLocaleDateString() ?? '(none)'}
</div>
