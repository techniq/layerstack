<script lang="ts">
  import { writable } from 'svelte/store';

	import { Button, TextField } from 'svelte-ux';
	import { dirtyStore } from '@layerstack/svelte-stores';
	import Preview from '$docs/Preview.svelte';

  const value = writable('');
  const isDirty = dirtyStore(value)
</script>

<h1>Usage</h1>

```svelte
<script>
  import { writable } from 'svelte/store';
  import { dirtyStore } from '@layerstack/svelte-stores';

  const value = writable('');
  const isDirty = dirtyStore(value);
</script>
```

<h2>Example</h2>

<Preview>
  <TextField bind:value={$value} />
  <div>isDirty: {$isDirty}</div>
  <Button on:click={() => isDirty.reset()}>Reset</Button>
</Preview>
