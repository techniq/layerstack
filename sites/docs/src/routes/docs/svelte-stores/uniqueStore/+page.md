<script lang="ts">
	import { Checkbox, TextField, uniqueStore } from 'svelte-ux';
	import Preview from '$docs/Preview.svelte';

	const data = Array.from({ length: 5 }).map((_,i) => {
    return {
      id: i + 1
    }
  });

	const selected = uniqueStore();
</script>

<h1>Usage</h1>

```js
import { uniqueStore } from '@layerchart/svelte-stores';

const store = uniqueStore();
// $store.has(value)
// $store.size
// store.add(value);
// store.delete(value);
// store.toggle(value);
```

<h1>Examples</h1>

<h2>Basic</h2>

<Preview>
	{#each data as d}
		<div>
			<Checkbox checked={$selected.has(d.id)} on:change={() => selected.toggle(d.id)}>
				{d.id}
			</Checkbox>
		</div>
	{/each}
	selected: {JSON.stringify([...$selected])}
</Preview>
