<script lang="ts">
  import { DatePickerField } from '@layerstack/ui';

  let value = $state<Date | null>(new Date());
</script>

<div class="grid gap-4 max-w-sm">
  <DatePickerField bind:value />
  <DatePickerField bind:value stepper clearable />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Value: {value?.toLocaleDateString() ?? '(none)'}
</div>
