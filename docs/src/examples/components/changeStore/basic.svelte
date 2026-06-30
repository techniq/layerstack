<script lang="ts">
  import { writable } from 'svelte/store';
  import { TextField } from 'svelte-ux';
  import { changeStore } from '@layerstack/svelte-stores';

  const value = writable('');
  const changed = changeStore(value, (value) => console.log('changed', value));
</script>

<TextField bind:value={$value} />
<div>changed: {JSON.stringify($changed)}</div>
