---
description: Linear progress bar built on the native `<progress>` element
category: feedback
related: [ui/ProgressCircle]
---

## Usage

```svelte
<script lang="ts">
  import { Progress } from '@layerstack/ui';
</script>

<Progress value={40} max={100} />
```

Colors come from the `--color` (bar) and `--track-color` (track) custom properties, so a utility
class such as `[--color:var(--color-success)]` restyles it without overriding the pseudo-element
rules each browser needs.

`value` is relative to `max` (which defaults to `1`), so `value={0.4}` and `value={40} max={100}`
draw the same bar. A `null` value renders as indeterminate.

## Basic

:example{name="basic" showCode}

## Color and track

Both the bar and the groove behind it are custom properties, so a utility class restyles them
without having to override the `::-webkit-progress-value` / `::-moz-progress-bar` rules each
browser needs.

:example{name="colors"}

## Color based on value

:example{name="color-by-value"}
