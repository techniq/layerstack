---
'@layerstack/svelte-state': minor
---

feat: Add `FormState` — the runes replacement for `@layerstack/svelte-stores`' `formStore`.

`draft` is a deeply reactive copy that inputs bind to directly, so the `refresh()`/`current` dance
the immer-draft-based store required is gone. `commit()` validates against an optional schema and
promotes the draft to `state`; `revert()`, `revertAll()`, and `undo()` walk it back. `isDirty` and
`canUndo` replace `dirtyStore`.

The schema is typed structurally (anything with a zod-compatible `safeParse`), so the package
depends on neither zod nor immer.
