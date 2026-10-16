---
'@layerstack/ui': minor
'@layerstack/svelte-state': patch
---

feat: Migrate the layout/primitive components — `Avatar`, `Breadcrumb`, `Card`, `DividerDot`, `EmptyMessage`, `Grid`, `Header`, `Kbd`, `Maybe`, `ScrollContainer`, `SectionDivider`, `Selection`, `Stack`, `Toggle`, and `ViewportCenter`

`SelectionState.all` is now reactive, so `isAllSelected()` and `isAnySelected()` re-evaluate when the set of values changes.
