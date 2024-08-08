<script lang="ts">
	import Preview from '$docs/Preview.svelte';
	import Code from '$docs/Code.svelte';

  import testSource from '$utils/json.test.ts?raw';
</script>

<h1>Usage</h1>

```svelte
<script>
  import { parse, stringify } from '@layerstack/utils';
</script>
```

<h2>Tests</h2>

<Code source={testSource} language='js' />
