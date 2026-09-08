---
title: mapStore
description: Store to wrap `Map` to simplify syncing state (set, delete, clear) with Svelte
related: [svelte-stores/uniqueStore]
status: deprecated
---

> **Dropped** — runes cover this directly: use [`SvelteMap`](https://svelte.dev/docs/svelte/svelte-reactivity#SvelteMap) from `svelte/reactivity`.

## Usage

```js
import { mapStore } from '@layerstack/svelte-stores';

const store = mapStore();

// Get a value
$store.get(key);

// Set a value
store.set(key, value);

// Update a value
store.update(key, (value) => value + 1);

// Check if value exists
$store.has(key);

// Delete a value
store.delete(key);

// Delete all values
store.clear();

// Force a reactive update in case of internal changes to entries
store.refresh();
```
