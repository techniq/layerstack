---
title: LocalState
description: State backed by localStorage, with optional expiry
related: [svelte-state/ThemeState, svelte-stores/localStore]
---

## Usage

```js
import { LocalState } from '@layerstack/svelte-state';

const state = new LocalState('sidebar-width', 240);

state.current; // read
state.current = 320; // write, and persist
state.reset(); // back to the initial value
state.clear(); // remove from storage, keeping `current`
```

Reads once on construction and writes on every change. Values go through `@layerstack/utils`'
`stringify`/`parse`, so `Date` and other types JSON alone would flatten survive the round trip.

Server-side there is no `localStorage`: the initial value is used and nothing is persisted.

## Override

`override` supplies the value directly and skips reading storage — useful when a URL param or
server-provided setting should win for one render.

```js
const state = new LocalState('theme', 'light', { override: fromUrl });
```

## Expiry

`expiry` stores the value alongside an [`Expiry`](/docs/utils/object), and anything past its
expiration is dropped on read. It can be a value applied on every write, or a function that derives
the next expiry from the previous one (with expired entries already pruned), which is how a sliding
window is expressed:

```js
const recent = new LocalState('recent-searches', [], {
  expiry: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});
```

When everything stored has expired, the initial value is used.
