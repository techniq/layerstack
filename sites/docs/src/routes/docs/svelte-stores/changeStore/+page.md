<script lang="ts">
  import { writable } from 'svelte/store';

  import { Button, Pagination, TextField } from 'svelte-ux';
  import { changeStore, paginationStore } from '@layerstack/svelte-stores'

	import Preview from '$docs/Preview.svelte';

  const value = writable('');
  const changed = changeStore(value, (value) => console.log('text changed', value));

  const pagination = paginationStore({ total: 500 });
  const paginationChanged = changeStore(pagination, (value) => console.log('pagination changed', value));
</script>

<h1>Usage</h1>

```svelte
<script>
  import { writable } from 'svelte/store';
  import { changeStore } from '@layerstack/svelte-stores';

  const value = writable('');
  const changed = changeStore(value, (value) => console.log('changed', value));
</script>
```

<h2>Example</h2>

<Preview>
  <TextField bind:value={$value} />
  <div>changed: {JSON.stringify($changed)}</div>
</Preview>

<h2>Pagination</h2>
<Preview>
  <Pagination {pagination} />
  <pre>{JSON.stringify($paginationChanged, null, 2)}</pre>
</Preview>
