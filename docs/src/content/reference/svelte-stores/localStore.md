---
title: localStore
description: Read and write to localStorage with expiration support
---

## Usage

```svelte
<script>
  import { localStore } from '@layerstack/svelte-stores';
  import { intervalOffset } from '@layerstack/utils';

  const store = localStore('some-key', defaultValue, {
    expiry: intervalOffset('day', new Date(), 1),
  });
</script>
```
