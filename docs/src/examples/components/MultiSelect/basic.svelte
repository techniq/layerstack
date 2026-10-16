<script lang="ts">
  import { MultiSelect } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
  ];

  let value = $state<string[]>(['banana']);
</script>

<div class="max-w-xs rounded border border-surface-content/10">
  <MultiSelect {options} bind:value />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value.join(', ') || '(none)'}</div>
