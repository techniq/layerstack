---
description: Dropdown menu of actions, anchored to a trigger and dismissed on selection
category: overlays
related: [ui/MenuItem, ui/Popover, ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { Button, Menu, MenuItem } from '@layerstack/ui';

  let open = $state(false);
</script>

<div class="relative inline-block">
  <Button onclick={() => (open = !open)}>Open menu</Button>

  <Menu bind:open>
    <MenuItem onclick={handleProfile}>Profile</MenuItem>
    <MenuItem onclick={handleSignOut}>Sign out</MenuItem>
  </Menu>
</div>
```

`Menu` builds on [`Popover`](/docs/ui/Popover), adding a `<menu>` wrapper, a slide transition, and
focus management. Give the trigger a positioned ancestor (`relative`) so the menu anchors to it.

## Basic

:example{name="basic" showCode}

## Icons and selection

:example{name="icons-and-selection"}

## Keeping the menu open

By default, clicking anywhere inside the menu closes it. `explicitClose` leaves it open so the
`close` callback (passed to the children snippet) can decide.

:example{name="explicit-close"}

## Closing

`onClose` reports why the menu closed — `'item'`, `'escape'`, `'clickOutside'`, or `'unknown'`.

```svelte
<Menu bind:open onClose={(reason) => console.log(reason)} />
```
