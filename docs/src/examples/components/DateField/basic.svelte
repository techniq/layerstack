<script lang="ts">
  import { DateField } from '@layerstack/ui';

  let value = $state<Date | null>(new Date());
</script>

<div class="grid gap-4 max-w-sm">
  <DateField label="Date" bind:value />
  <DateField label="With picker" bind:value picker clearable />

  <div class="text-sm text-surface-content/70">
    Value: {value?.toISOString() ?? 'null'}
  </div>
</div>
