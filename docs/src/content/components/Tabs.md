---
description: Tab strip with content, positionable on any edge
category: navigation
related: [ui/Tab, ui/ToggleGroup]
---

## Usage

```svelte
<script lang="ts">
  import { Tabs } from '@layerstack/ui';

  let value = $state('a');
</script>

<Tabs bind:value {options}>
  {#snippet content({ value })}…{/snippet}
</Tabs>
```

Pass `options` for the common case, or a `children` snippet of [`Tab`](/docs/ui/Tab)s for full
control. `placement` moves the strip to any edge and flips the borders to match.

For a segmented control rather than tabs, see [`ToggleGroup`](/docs/ui/ToggleGroup).

## Basic

:example{name="basic" showCode}

## Placement

:example{name="placement"}

## Composition and styling

:example{name="composition"}
