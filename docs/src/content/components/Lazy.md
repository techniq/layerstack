---
description: Defer rendering content until it scrolls into view
category: layout
related: [ui/InfiniteScroll, svelte-actions/observer]
---

## Usage

```svelte
<script lang="ts">
  import { Lazy } from '@layerstack/ui';
</script>

<Lazy height={40}>
  <ExpensiveThing />
</Lazy>
```

`height` reserves space before the content mounts — match it to the rendered height to avoid
scroll bouncing. `offset` expands the intersection area so content mounts just before it comes
into view.

`unmount` releases content once it scrolls away again, capturing its rendered height first so the
placeholder stays accurate.

## Basic

:example{name="basic" showCode}
