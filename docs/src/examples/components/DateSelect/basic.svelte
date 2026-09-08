<script lang="ts">
  import { DateSelect, ToggleGroup, ToggleOption } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';

  let periodType = $state(PeriodType.Day);
  let selected = $state<Date | null>(new Date());
</script>

<ToggleGroup bind:value={periodType} variant="outline" inset class="mb-3">
  <ToggleOption value={PeriodType.Day}>Day</ToggleOption>
  <ToggleOption value={PeriodType.Month}>Month</ToggleOption>
  <ToggleOption value={PeriodType.CalendarYear}>Year</ToggleOption>
</ToggleGroup>

<div class="border rounded-sm p-2 w-80 max-h-96 overflow-auto">
  <DateSelect {selected} {periodType} onDateChange={(date) => (selected = date)} />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Selected: {selected?.toLocaleDateString() ?? '(none)'}
</div>
