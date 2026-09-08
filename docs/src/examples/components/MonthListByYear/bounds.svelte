<script lang="ts">
  import { MonthListByYear } from '@layerstack/ui';

  let selected = $state(new Date(2026, 7, 1));
</script>

<!-- Scrolls the selected year into view on mount -->
<div class="h-72 overflow-auto border border-surface-content/10 rounded max-w-sm">
  <MonthListByYear
    {selected}
    minDate={new Date(2024, 0, 1)}
    maxDate={new Date(2028, 11, 31)}
    onDateChange={(date) => (selected = date)}
  />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Selected: {selected.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
</div>
