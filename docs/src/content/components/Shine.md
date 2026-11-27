---
description: Specular highlight that follows the pointer across its content
category: effects
related: [ui/Tilt, ui/Gooey]
---

## Usage

```svelte
<script lang="ts">
  import { Shine } from '@layerstack/ui';
</script>

<Shine>
  <div>Content</div>
</Shine>
```

Applies an SVG lighting filter whose point light tracks the pointer. The filter is given a unique
id per instance, so several can coexist on a page.

## Basic

:example{name="basic" showCode}

## Options

The highlight follows the pointer across the wrapped content. `depth` exaggerates the relief,
`lightColor` tints the highlight, and `lightRadius` sizes it.

:example{name="options"}
