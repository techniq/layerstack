---
description: Tilt content in 3D toward the pointer
category: motion
related: [ui/Shine]
---

## Usage

```svelte
<script lang="ts">
  import { Tilt } from '@layerstack/ui';
</script>

<Tilt maxRotation={15}>
  <div>Content</div>
</Tilt>
```

Rotation is applied to the direct children through CSS custom properties, so add a `transition` to
them for smoothing. `setBrightness` additionally varies brightness with the pointer's vertical
position.

## Basic

:example{name="basic" showCode}

## Options

:example{name="options"}
