---
'@layerstack/svelte-state': minor
'@layerstack/svelte-stores': patch
---

feat: Port the remaining stores — `DebouncedState`, `LocalState`, `PromiseState`, `FetchState`, `GraphState`, `QueryParamState`, and `QueryParamsState` — completing `@layerstack/svelte-state`

`changeStore`, `dirtyStore`, and `mapStore` are dropped rather than ported. Runes cover them directly: `$effect` with a captured previous value, a `$derived` comparison against the initial value, and `SvelteMap` from `svelte/reactivity`. `matchMedia` and its presets were already covered by `MediaQueryPresets` over Svelte's `MediaQuery`.

Where a store took another store, the class takes a getter so the dependency is tracked — `debounceStore(value)` becomes `new DebouncedState(() => value)`.

`QueryParamsState` reads `page` from `$app/state` rather than the `$app/stores` readable, and takes `gotoOptions` to forward navigation options. The store passed the whole page object in `goto`'s options position instead.

`FetchState.dispose()` replaces the cleanup the store ran when its last subscriber went away, since nothing subscribes any more. Wire it up with `$effect(() => state.dispose)` where a shared `FetchErrors` collection needs pruning.

fix: `fetchStore` and `graphStore` sent, and matched against, a `Content-Type` of `application/json.js` — a mangled `application/json`. No real response ever matched it, so JSON bodies fell through to `arrayBuffer()` rather than being parsed.

fix: `promiseStore` raced the promise against an immediate value to detect one that had already settled, which made an already-rejected promise reject the race itself. That escaped as an unhandled rejection and left `error` unset. Detection no longer runs through the race.

fix: `promiseStore` claimed the current promise only after that race, so two calls in the same tick could both proceed and the loser could overwrite the winner. `PromiseState` claims it synchronously.

fix: `fetchStore` re-added the previous error to the shared errors collection on every subsequent request, since the `loading: true` update carries the error forward. The collection could only grow.

deprecate: `@layerstack/svelte-stores` is superseded by `@layerstack/svelte-state`. It continues to ship, and to receive fixes.
