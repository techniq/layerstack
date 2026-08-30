---
description: Button that reveals content while toggled on
category: state
related: [ui/Toggle, ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { ToggleButton } from '@layerstack/ui';
</script>

<ToggleButton>
  {#snippet children({ on })}{on ? 'Hide' : 'Show'}{/snippet}
  {#snippet toggle()}Revealed content{/snippet}
</ToggleButton>
```

A [`Button`](/docs/ui/Button) paired with [`Toggle`](/docs/ui/Toggle) state. The `toggle` snippet
renders while `on`, wrapped in a transition so its own children get a chance to animate out —
which is what makes it work as a trigger for a `Drawer` or `Dialog`.

`buttonPlacement="after"` renders the button below the revealed content.

## Basic

:example{name="basic" showCode}

## Variations

The `toggle` snippet renders while `on`, transitioned by `transition`/`transitionParams`. Pass
`transition={false}` to mount and unmount immediately — which is what an overlay wants, since
[`Dialog`](/docs/ui/Dialog) and [`Drawer`](/docs/ui/Drawer) animate themselves.

`buttonPlacement` puts the trigger before (default) or after the revealed content.

:example{name="variations"}
