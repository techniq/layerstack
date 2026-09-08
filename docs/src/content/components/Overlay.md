---
description: Translucent layer covering a positioned ancestor, typically for loading state
category: layout
related: [ui/Backdrop, ui/Dialog, ui/Card]
---

## Usage

```svelte
<script lang="ts">
  import { Overlay, ProgressCircle } from '@layerstack/ui';
</script>

<div class="relative">
  …
  <Overlay center>
    <ProgressCircle />
  </Overlay>
</div>
```

`Overlay` is absolutely positioned, so it needs a positioned ancestor. It covers only that element
— see [`Backdrop`](/docs/ui/Backdrop) for a full-viewport layer.

[`Card`](/docs/ui/Card) and [`Dialog`](/docs/ui/Dialog) use it for their `loading` state.

## Basic

:example{name="basic" showCode}

## Variations

:example{name="variations"}
