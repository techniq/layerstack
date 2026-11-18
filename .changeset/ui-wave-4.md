---
'@layerstack/ui': minor
---

feat: Migrate `BarStack`, `Gooey`, `ScrollingValue`, `Shine`, `SpringValue`, `Tilt`, and `TweenedValue`

`SpringValue`, `TweenedValue`, and `ScrollingValue` now use the `Spring`/`Tween` classes from `svelte/motion` in place of the deprecated `spring`/`tweened` stores.
