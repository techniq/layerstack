<script lang="ts">
  import { MonthList } from '@layerstack/ui';

  const m = (month: number) => new Date(2026, month, 1);
  let selected = $state<Date | null>(null);
</script>

<div class="max-w-sm">
  <!-- Only the first half of the year can be picked -->
  <MonthList
    year={2026}
    {selected}
    disabledDates={{ from: m(6), to: m(11) }}
    onDateChange={(date) => (selected = date)}
  />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Selected: {selected?.toLocaleDateString() ?? '(none)'}
</div>
