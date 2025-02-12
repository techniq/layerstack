---
'@layerstack/utils': minor
---

refactor(localPoint): Swap `node` and `event` arguments and allow `node` to be optional, defaulting to `event.currentTarget ?? event.target` if not defined
