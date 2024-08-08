<script lang="ts">
	import { Checkbox, TextField } from 'svelte-ux';
	import { mapStore } from '@layerstack/svelte-stores';
	import Preview from '$docs/Preview.svelte';

	const items = Array.from({ length: 5 }).map((_,i) => {
    return {
      id: i + 1
    }
  });

	const selected = mapStore();
</script>

<h1>Usage</h1>

```js
import { mapStore } from '@layerstack/svelte-stores';

const store = mapStore();

// Get a value
$store.get(key);

// Set a value
store.set(key, value);

// Update a value
store.update(key, (value) => value + 1);

// Check if value exists
$store.has(key);

// Delete a value
store.delete(key);

// Delete all values
store.clear();

// Force a reactive update in case of internal changes to entries
store.refresh();
```
