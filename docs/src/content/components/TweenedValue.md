---
description: Animate a number toward its target over a fixed duration
category: motion
related: [ui/SpringValue, ui/ScrollingValue]
---

## Usage

```svelte
<script lang="ts">
  import { TweenedValue } from '@layerstack/ui';
</script>

<TweenedValue value={total} format="integer" options={{ duration: 800 }} />
```

Like [`SpringValue`](/docs/ui/SpringValue), but with an explicit duration and easing rather than
spring physics. Built on `Tween` from `svelte/motion`.

## Basic

:example{name="basic" showCode}

## Formats and options

`options` are passed to Svelte's `Tween` — `duration`, `delay`, `easing`, and `interpolate`.
`disabled` skips the animation entirely.

:example{name="options"}
