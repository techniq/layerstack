---
title: localStore
description: Read and write to localStorage with expiration support
status: deprecated
---

> **Deprecated** — replaced by [`LocalState`](/docs/svelte-state/LocalState) in [`@layerstack/svelte-state`](/docs/svelte-state).

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
