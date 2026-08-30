<script lang="ts">
  import { Month } from '@layerstack/ui';

  const d = (day: number) => new Date(2026, 7, day);
  let selected = $state<Date | null>(null);
</script>

<div class="grid grid-cols-3 gap-4">
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Outside days</div>
    <Month startOfMonth={d(1)} showOutsideDays hideControls />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Disabled range</div>
    <Month startOfMonth={d(1)} disabledDates={{ from: d(10), to: d(20) }} hideControls />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Disabled predicate</div>
    <!-- Weekends cannot be picked -->
    <Month
      {selected}
      startOfMonth={d(1)}
      disabledDates={(date) => [0, 6].includes(date.getDay())}
      onDateChange={(date) => (selected = date)}
      hideControls
    />
  </div>
</div>
