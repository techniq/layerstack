---
description: Animate a number toward its target with spring physics
category: motion
related: [ui/TweenedValue, ui/ScrollingValue]
---

## Usage

```svelte
<script lang="ts">
  import { SpringValue } from '@layerstack/ui';
</script>

<SpringValue value={total} format="integer" />
```

Without children it renders the animated number using a [format preset](/docs/utils/format). Supply
a `children` snippet to render it yourself.

`disabled` skips the animation, and a `null` value passes straight through rather than animating to
zero.

Built on `Spring` from `svelte/motion` — Svelte 5's replacement for the deprecated `spring` store.

## Basic

:example{name="basic" showCode}

## Formats and options

`options` are passed to Svelte's `Spring` — lower `stiffness` and `damping` make the value settle
more slowly. `disabled` skips the animation entirely, which is what you want for a value that is
already correct on first render.

:example{name="options"}
