<script lang="ts">
  import { ToggleGroup, ToggleOption } from '@layerstack/ui';

  let value = $state('week');
</script>

<ToggleGroup bind:value variant="outline" inset>
  <ToggleOption value="day">Day</ToggleOption>
  <ToggleOption value="week">Week</ToggleOption>
  <ToggleOption value="month">Month</ToggleOption>
</ToggleGroup>

<div class="mt-3 text-sm text-surface-content/70">Selected: {value}</div>
