---
description: A Menu on wide viewports, a bottom Drawer on narrow ones
category: overlays
related: [ui/Menu, ui/Drawer]
---

## Usage

```svelte
<script lang="ts">
  import { ResponsiveMenu } from '@layerstack/ui';

  let open = $state(false);
</script>

<ResponsiveMenu bind:open>Content</ResponsiveMenu>
```

Renders a [`Menu`](/docs/ui/Menu) at or above `screenWidth` (768px by default) and a bottom
[`Drawer`](/docs/ui/Drawer) below it — a dropdown is awkward on a phone, and a drawer is heavy on a
desktop.

`menuProps` and `drawerProps` configure each variant. `explicitClose` defaults on for the menu, so
both behave the same way.

## Basic

Below `screenWidth` the content is shown in a bottom [`Drawer`](/docs/ui/Drawer); at or above it, in
an anchored [`Menu`](/docs/ui/Menu). `menuProps` and `drawerProps` configure each independently.

:example{name="basic" showCode}

## Configuring each surface

:example{name="props"}
