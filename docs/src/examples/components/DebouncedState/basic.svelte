<script lang="ts">
  import { TextField } from '@layerstack/ui';
  import { DebouncedState } from '@layerstack/svelte-state';

  let value = $state('');
  const debounced = new DebouncedState(() => value);
</script>

<TextField bind:value label="Value" />
<div class="mt-2">value: {value}</div>
<div>debounced: {debounced.current}</div>
<div>pending: {debounced.pending}</div>
