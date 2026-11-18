---
title: PromiseState
description: Wraps a Promise as reactive loading/data/error state
related: [svelte-state/FetchState, svelte-stores/promiseStore]
---

## Usage

```js
import { PromiseState } from '@layerstack/svelte-state';

const state = new PromiseState(data.streamed);

state.loading;
state.data;
state.error;
state.aborted;

state.setPromise(nextPromise);
```

Useful for SvelteKit streamed data, where a `load` function returns a promise that resolves after
the page has rendered.

Only the most recent promise wins. An earlier one that resolves late is ignored, so a slow response
cannot overwrite a newer result — the common bug when a user retypes faster than the network
answers.

An already-settled promise never flips `loading` to `true`, so re-rendering with cached data does
not flash a spinner.

`aborted` distinguishes a cancelled request (an `AbortError`, typically from an `AbortController`)
from a genuine failure, so the UI can stay quiet rather than reporting an error the user caused.

Passing `undefined` resets everything back to idle.
