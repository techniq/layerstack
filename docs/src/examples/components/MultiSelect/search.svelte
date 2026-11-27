<script lang="ts">
  import { MultiSelect } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
    { label: 'Elderberry', value: 'elderberry' },
  ];

  let value = $state<string[]>([]);
</script>

<div class="max-w-xs rounded border border-surface-content/10">
  <MultiSelect {options} bind:value search />
</div>
