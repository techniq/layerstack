---
description: CSS grid wrapper driven by props rather than utility classes
category: layout
related: [ui/Stack, ui/Card]
---

## Usage

```svelte
<script lang="ts">
  import { Grid } from '@layerstack/ui';
</script>

<Grid columns={3} gap={8}>…</Grid>
```

Every layout prop maps to a CSS custom property, so values can be anything CSS accepts — not just
the steps a utility scale offers. `gap` is in pixels.

Column templates resolve in order: `templateColumns` → `template` → `autoColumns` → `columns`.

## Basic

:example{name="basic" showCode}

## Auto columns

:example{name="auto-columns"}

## Stacking

`stack` places every child in the same cell, which is useful for overlaying content. See
[`Stack`](/docs/ui/Stack) for a shorthand.

## Templates and flow

:example{name="templates"}
