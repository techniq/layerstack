<script lang="ts">
	import Preview from '$docs/Preview.svelte';
</script>

<h1>Usage</h1>

```svelte
<script>
  import { Logger } from '@layerstack/utils';
  const logger = new Logger('MyComponent');

  logger.trace('...');
  logger.debug('...');
  logger.info('...');
  logger.warn('...');
  logger.error('...');
</script>
```

to enable

```js
window.localStorage.logger = 'MyComponent';
window.localStorage.logger = 'MyComponent:INFO';
window.localStorage.logger = 'MyComponent,OtherComponent';
window.localStorage.logger = 'MyComponent:INFO,OtherComponent';
```
