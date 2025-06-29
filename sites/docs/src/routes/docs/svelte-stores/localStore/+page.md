<script lang="ts">
	import Preview from '$docs/Preview.svelte';
	import Code from '$docs/Code.svelte';

	import localStore from '$svelte-stores/localStore';
	import testSource from '$utils/object.test.ts?raw'
</script>

<h1>Usage</h1>

```svelte
<script>
  import { localStore } from '@layerstack/svelte-stores';
  import { intervalOffset } from '@layerstack/utils';

  const store = localStore('some-key', defaultValue, {
    expiry: intervalOffset('day', new Date(), 1),
  });
</script>
```

<h2>Tests</h2>

<Code source={testSource} language='js' />
