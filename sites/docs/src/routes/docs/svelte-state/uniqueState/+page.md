<script lang="ts">
	import { Checkbox, TextField } from 'svelte-ux';
	import { uniqueState } from '@layerstack/svelte-state';
	import Preview from '$docs/Preview.svelte';

	const data = Array.from({ length: 5 }).map((_,i) => {
    return {
      id: i + 1
    }
  });

	const state = uniqueState();
</script>

<h1>Usage</h1>

```js
import { uniqueState } from '@layerstack/svelte-state';

const state = uniqueState();
// state.current.has(value)
// state.current.size
// state.add(value);
// state.delete(value);
// state.toggle(value);
```

<h1>Examples</h1>

<h2>Basic</h2>

<Preview>
	{#each data as d}
		<div>
			<Checkbox checked={state.current.has(d.id)} on:change={() => state.toggle(d.id)}>
				{d.id}
			</Checkbox>
		</div>
	{/each}
	selected: {JSON.stringify([...state.current])}
</Preview>
