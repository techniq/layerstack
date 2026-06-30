---
title: uniqueStore
description: Store to manage unique values using `Set` with improved ergonomics and better control of updates
related: [svelte-stores/selectionStore, svelte-stores/mapStore, components/MultiSelect]
---

## Usage

```js
import { uniqueStore } from '@layerstack/svelte-stores';

const store = uniqueStore();
// $store.has(value)
// $store.size
// store.add(value);
// store.delete(value);
// store.toggle(value);
```

## Example

:example{name="basic" showCode}
