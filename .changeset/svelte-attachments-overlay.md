---
'@layerstack/svelte-attachments': minor
'@layerstack/svelte-table': patch
---

feat: Add `portal`, `popover`, and `scrollIntoView` attachments. `popover` takes an `onClickOutside` callback in place of the `clickOutside` custom event.

`tableOrderStore().onHeaderClick` now accepts either `{ column }` or a `CustomEvent`-shaped `{ detail: { column } }`, so it works with both `@layerstack/ui`'s `Table` and Svelte UX's.
