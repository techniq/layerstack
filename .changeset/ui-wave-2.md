---
'@layerstack/ui': minor
'@layerstack/svelte-attachments': minor
'@layerstack/svelte-state': patch
---

feat: Migrate `Badge`, `Collapse`, `Duration`, `ExpansionPanel`, `InfiniteScroll`, `Lazy`, `Overflow`, `Paginate`, `Progress`, and `TreeList`

Adds the `intersection`, `resize`, `mutate`, `overflow`, `remainingViewportHeight`, and `remainingViewportWidth` attachments, each replacing a custom DOM event with a callback.

fix: `PaginationState` was not reactive — `page`, `perPage`, and `total` were plain fields, so nothing derived from them (`totalPages`, `from`, `to`, `hasNext`, ...) updated.

fix: `TimerState.start()` called the global `stop()` instead of `this.stop()`, which aborted in-flight page loads and left the previous interval running.
