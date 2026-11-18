---
description: Single horizontal bar split into proportional, clickable segments
category: visualization
related: [ui/Progress]
---

## Usage

```svelte
<script lang="ts">
  import { BarStack } from '@layerstack/ui';
</script>

<BarStack {data} onItemClick={(item) => select(item)} />
```

Each item's `value` becomes its flex grow factor, so segments size proportionally without any
percentage math. Items with a value of `0` are skipped entirely rather than collapsing to a sliver.

For a full charting solution, reach for [LayerChart](https://layerchart.com) instead — this is for
a compact inline breakdown.

Svelte UX dispatched an `itemClick` event; this is now the `onItemClick` callback prop.

## Basic

:example{name="basic" showCode}

## Customization

Segments are sized against `total`, which defaults to the sum of `data`. The `bar` snippet replaces
just the colored bar, while `children` replaces the whole segment — the latter is how a label ends
up under the bar rather than inside it.

:example{name="customization"}
