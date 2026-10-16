---
description: Small count or dot anchored to a corner of its content
category: feedback
related: [ui/Avatar, ui/Icon]
---

## Usage

```svelte
<script lang="ts">
  import { Badge } from '@layerstack/ui';
</script>

<Badge value={3}>
  <Icon data={mdiBell} />
</Badge>
```

A badge with a value of `0` scales to nothing rather than unmounting, so it animates in and out.
`dot` renders a marker with no content, and `circle` adjusts the offset for a round anchor such as
an [`Avatar`](/docs/ui/Avatar).

The `valueSnippet` replaces the numeric content — supplying it also drops the default background so
the snippet can style itself, and defaults `value` to `1` so the badge is visible.

## Basic

:example{name="basic" showCode}

## Anchors and styling

A badge wraps the element it decorates. `value` hides itself at `0`, `dot` drops the number, and
`circle` nudges the position inward for a round anchor such as an [`Avatar`](/docs/ui/Avatar).

:example{name="anchors"}

## Placement

:example{name="placement"}
