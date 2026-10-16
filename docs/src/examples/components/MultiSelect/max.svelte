<script lang="ts">
  import { MultiSelect } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
  ];

  let value = $state<string[]>([]);
</script>

<div class="max-w-xs rounded border border-surface-content/10">
  <MultiSelect {options} bind:value max={2} mode="immediate" />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Pick up to 2: {value.join(', ') || '(none)'}
</div>
