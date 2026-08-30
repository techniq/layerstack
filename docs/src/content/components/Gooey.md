---
description: Merge overlapping shapes into an organic blob
category: effects
related: [ui/Shine, ui/Tilt]
---

## Usage

```svelte
<script lang="ts">
  import { Gooey } from '@layerstack/ui';
</script>

<Gooey blur={10}>
  <div class="size-16 rounded-full bg-primary"></div>
  <div class="size-16 rounded-full bg-primary -ml-6"></div>
</Gooey>
```

A gaussian blur followed by a steep alpha ramp — where blurred edges overlap, the alpha pushes back
above the threshold and the shapes read as one. `blur` is required unless the content is already
blurred by other means.

## Basic

:example{name="basic" showCode}

## Variations

The effect is a blur fed through an `feColorMatrix` that pushes the alpha channel back to hard
edges — so shapes that blur into each other merge into one. `alphaPixel` and `alphaShift` are that
matrix's `a4`/`a5`: large values give the melting "gooey" look, small ones just round and join
adjacent shapes.

:example{name="variations"}
