<script lang="ts">
  import { YearList } from '@layerstack/ui';

  let selected = $state(new Date(2026, 0, 1));
  const y = (year: number) => new Date(year, 0, 1);
</script>

<div class="grid grid-cols-2 gap-6 max-w-xl">
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Bounded</div>
    <div class="h-56 overflow-auto border border-surface-content/10 rounded">
      <YearList
        {selected}
        minDate={y(2020)}
        maxDate={y(2032)}
        onDateChange={(date) => (selected = date)}
      />
    </div>
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Disabled range</div>
    <div class="h-56 overflow-auto border border-surface-content/10 rounded">
      <YearList
        selected={y(2026)}
        minDate={y(2020)}
        maxDate={y(2032)}
        disabledDates={{ from: y(2028), to: y(2032) }}
      />
    </div>
  </div>
</div>

<div class="mt-3 text-sm text-surface-content/70">Selected: {selected.getFullYear()}</div>
