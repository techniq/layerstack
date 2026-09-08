---
'@layerstack/ui': minor
---

feat: Migrate `Form`, the last remaining Svelte UX component.

- The nine slot props collapse to a single `{ form }` snippet argument — a `FormState` carrying
  `draft`, `state`, `errors`, `isDirty`, `canUndo`, `commit`, `revert`, `revertAll`, and `undo`.
- `on:change` is the `onChange(value)` callback prop, and no longer fires on mount.
- `refresh()`/`current` are gone: `form.draft` is deeply reactive, so `bind:value={form.draft.name}`
  is enough.
- A `form` prop accepts externally owned `FormState`, for reading or driving the form from outside.
