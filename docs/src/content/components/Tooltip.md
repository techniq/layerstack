---
description: Contextual label shown on hover or keyboard focus
category: overlays
related: [ui/Popover, ui/Menu]
---

## Usage

```svelte
<script lang="ts">
  import { Tooltip } from '@layerstack/ui';
</script>

<Tooltip title="Saves your changes">
  <Button>Save</Button>
</Tooltip>
```

Built on [`Popover`](/docs/ui/Popover), anchored to the trigger's first child. The wrapper uses
`display: contents`, so it does not disturb the surrounding layout.

`delay` (500ms by default) is skipped when moving between adjacent tooltips within half a second,
so scanning a toolbar does not stutter. Keyboard focus also shows it immediately, while a click
dismisses it.

## Basic

:example{name="basic" showCode}

## Placement and offset

:example{name="placement"}

## Custom content

:example{name="custom"}
