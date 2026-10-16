---
description: Report how far its content overflows on each axis
category: layout
related: [ui/ScrollContainer, svelte-actions/layout]
---

## Usage

```svelte
<script lang="ts">
  import { Overflow } from '@layerstack/ui';
</script>

<Overflow>
  {#snippet children({ overflowX, overflowY })}
    …
  {/snippet}
</Overflow>
```

Watches both resizes and child mutations, so the values stay accurate as content changes — useful
for conditionally showing scroll affordances or a "show more" control.

## Basic

:example{name="basic" showCode}

## Conditional tooltip

The most common use: only attach a [`Tooltip`](/docs/ui/Tooltip) when the text is actually clipped.

:example{name="conditional-tooltip"}
