---
description: Circular progress indicator, determinate or indeterminate
category: feedback
related: [ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { ProgressCircle } from '@layerstack/ui';
</script>

<ProgressCircle value={75} />
```

Omitting `value` (or passing `null`) renders an indeterminate spinner. The circle uses
`currentColor`, so set the color with a text utility class.

## Basic

:example{name="basic" showCode}

## Sizing

`size` sets the overall diameter in pixels and `width` the stroke thickness.

:example{name="sizing"}

## Label

Children render in the center of the circle.

:example{name="label"}

## Track, rotation, and stroke width

:example{name="track-and-rotate"}

## Color

:example{name="colors"}
