---
description: Shorthand for the common single-axis and overlaid Grid layouts
category: layout
related: [ui/Grid]
---

## Usage

```svelte
<script lang="ts">
  import { Stack } from '@layerstack/ui';
</script>

<Stack horizontal gap={8}>…</Stack>
```

A [`Grid`](/docs/ui/Grid) preset. Exactly one of `vertical`, `horizontal`, or `stack` must be set —
with none of them, nothing renders. Remaining props pass through to `Grid`.

## Basic

:example{name="basic" showCode}

## Justification and templates

`Stack` is [`Grid`](/docs/ui/Grid) with a single axis, so every `Grid` prop applies — `justify`
distributes items along that axis, and `template` sizes the tracks explicitly.

:example{name="justify-and-template"}

## Stacking

`stack` places every child in the same cell, which is how badges and corner controls are layered
over content without absolute positioning.

:example{name="stacked"}
