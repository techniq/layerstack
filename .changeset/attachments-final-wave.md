---
'@layerstack/svelte-attachments': minor
'@layerstack/svelte-actions': patch
---

feat: Port the remaining actions — `styleProps`, `computedStyles`, `sticky`, `stickyContext`, `spotlight`, and `DomTracker` — completing `@layerstack/svelte-attachments`

`multi` is dropped rather than ported. Attachments compose natively, so several `{@attach}` on one element (or `createAttachmentKey` to pass them through a component's props) covers what it existed for.

`DomTracker` keeps its DOM-change tracking, which is what `sticky` and `spotlight` use to reverse exactly the changes they made. Its action map is replaced by `addAttachment()`, which folds another attachment's cleanup into the tracker, plus `addCleanup()` for anything else. The map's original purpose — keeping state across an action's `update()` calls — no longer applies, since an attachment re-runs from scratch rather than updating in place.

fix: `spotlight`, `stickyContext`, and `styleProps` now reverse what they applied. As actions they left classes and custom properties behind, which was invisible only because the element was usually destroyed anyway; an attachment re-runs on change, so the leftovers would accumulate.

fix: `styleProps` removes properties that are no longer present in the object. The action only did this from its second update onward, so properties dropped on the first change lingered.

fix: `stickyContext` no longer writes `NaNpx` when the computed `margin-top` is unresolved.

deprecate: `@layerstack/svelte-actions` is superseded by `@layerstack/svelte-attachments`. It continues to ship, and to receive fixes, while `@layerstack/svelte-table` is migrated off it.
