---
title: Logger
description: Logging which can be granularly enabled/disabled via local storage and provides styled output
---

## Usage

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

To enable:

```js
window.localStorage.logger = 'MyComponent';
window.localStorage.logger = 'MyComponent:INFO';
window.localStorage.logger = 'MyComponent,OtherComponent';
window.localStorage.logger = 'MyComponent:INFO,OtherComponent';
```
