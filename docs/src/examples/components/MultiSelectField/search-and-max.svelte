<script lang="ts">
  import { MultiSelectField } from '@layerstack/ui';

  const options = Array.from({ length: 30 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
  }));

  let value = $state<string[]>([]);
</script>

<div class="max-w-sm">
  <MultiSelectField
    label="Options"
    {options}
    bind:value
    max={3}
    menuProps={{ search: true, infiniteScroll: true }}
  />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Pick up to 3: {value.join(', ') || '(none)'}
</div>
