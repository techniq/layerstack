---
description: Two-thumb slider for selecting a numeric range
category: inputs
related: [ui/RangeField, svelte-actions/mouse]
---

## Usage

```svelte
<script lang="ts">
  import { RangeSlider } from '@layerstack/ui';

  let value = $state<[number, number]>([20, 70]);
</script>

<RangeSlider bind:value min={0} max={100} />
```

Three drag targets: each thumb moves one end, and the middle grip moves the whole range while
preserving its width. Clicking the track moves whichever end is nearer. Double-clicking a thumb
jumps it to the corresponding bound, and double-clicking the grip expands to the full range.

Once focused, left/right arrows move whichever part was last dragged.

Dragging uses the [`movable`](https://github.com/techniq/layerstack/blob/main/packages/svelte-attachments/src/lib/mouse.ts)
attachment, which reports moves through `onMove` callbacks rather than custom DOM events.

## Basic

:example{name="basic" showCode}

## Bounds, step, and tooltips

Dragging the bar between the thumbs moves the whole range; dragging a thumb moves that end. Steps
snap both.

:example{name="options"}
