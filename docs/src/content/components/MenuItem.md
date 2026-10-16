---
description: Selectable row within a menu, rendered as a full-width borderless button
category: overlays
related: [ui/Menu, ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { MenuItem } from '@layerstack/ui';
</script>

<MenuItem icon={mdiAccount} selected onclick={handleClick}>Profile</MenuItem>
```

`MenuItem` is a [`Button`](/docs/ui/Button) with `variant="none"` and menu-appropriate padding. It
accepts every `Button` prop.

Two things happen automatically so menu items look consistent regardless of app configuration:
it ignores any enclosing [`ButtonGroup`](/docs/ui/ButtonGroup), and it opts its inner `Button` out
of the app's `Button` defaults and classes set through `settings()`.

## Examples

See [`Menu`](/docs/ui/Menu) for rendered examples.

## Scrolling into view

`scrollIntoView` scrolls the item into view when it becomes visible — useful for revealing the
selected item when a long menu opens.

```svelte
<MenuItem selected={isSelected} scrollIntoView={isSelected}>{label}</MenuItem>
```
