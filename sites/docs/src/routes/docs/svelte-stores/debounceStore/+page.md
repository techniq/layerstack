<script lang="ts">
  import { writable } from 'svelte/store';

	import { TextField } from 'svelte-ux';
	import { debounceStore } from '@layerstack/svelte-stores';
	import Preview from '$docs/Preview.svelte';

  const value = writable(null);
  const debouncedValue = debounceStore(value)
</script>

<h1>Usage</h1>

```svelte
<script>
  import { writable } from 'svelte/store';
  import { debounceStore } from '@layerstack/svelte-stores';

  const value = writable('');
  const debouncedValue = debounceStore(value);
</script>
```

<h2>Example</h2>

<Preview>
  <TextField bind:value={$value} />
  <div>value: {$value}</div>
  <div>debouncedValue: {$debouncedValue}</div>
</Preview>
