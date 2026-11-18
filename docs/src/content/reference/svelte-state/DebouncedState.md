---
title: DebouncedState
description: Track another value, but only adopt it once it has stopped changing
related: [svelte-stores/debounceStore]
---

## Usage

```js
import { DebouncedState } from '@layerstack/svelte-state';

let search = $state('');
const debounced = new DebouncedState(() => search, 300);

debounced.current;
debounced.pending;
```

The source is read through a getter so the dependency is tracked. Each change restarts the delay, so
only the value that survives a quiet period is adopted — which is what makes this useful for
search-as-you-type against a network.

Effects drive it, so create it during component initialization (or inside `$effect.root`).

:example{name="basic" showCode}

`pending` is `true` between a change and the moment it settles, which is enough to show a spinner
without a second piece of state. A value that changes and changes back within the delay settles
nothing, and clears `pending`.
