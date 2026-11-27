---
description: Full-viewport dimming layer, optionally blurred and portaled
category: overlays
related: [ui/Overlay, ui/Dialog]
---

## Usage

```svelte
<script lang="ts">
  import { Backdrop } from '@layerstack/ui';
</script>

<Backdrop blur portal onclick={close} />
```

Fixed to the viewport and centered, so children render in the middle. `portal` moves it out of the
current DOM hierarchy to escape `overflow` and stacking contexts.
[`Dialog`](/docs/ui/Dialog) renders one automatically.

## Basic

:example{name="basic" showCode}
