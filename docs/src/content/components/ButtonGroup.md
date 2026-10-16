---
description: Visually join a set of related buttons and share their variant, color, size, and rounding
category: elements
related: [ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { Button, ButtonGroup } from '@layerstack/ui';
</script>

<ButtonGroup variant="outline" color="primary">
  <Button>Left</Button>
  <Button>Right</Button>
</ButtonGroup>
```

Inner rounding is removed so the buttons read as one control, and each `Button` inherits the
group's `variant`, `color`, `size`, and `rounded` unless it sets its own.

## Basic

:example{name="basic" showCode}

## Variants

:example{name="variants"}

## Selection

A button can override the group to indicate selection.

:example{name="selection"}
