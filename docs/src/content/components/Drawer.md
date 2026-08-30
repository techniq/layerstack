---
description: Panel that slides in from any edge, over a backdrop
category: overlays
related: [ui/Dialog, ui/ResponsiveMenu, ui/AppLayout]
---

## Usage

```svelte
<script lang="ts">
  import { Drawer } from '@layerstack/ui';

  let open = $state(false);
</script>

<Drawer bind:open placement="right">Content</Drawer>
```

Like [`Dialog`](/docs/ui/Dialog), it portals out of the DOM hierarchy, takes focus on open, and
restores it on close. `placement` chooses the edge and the slide direction.

`persistent` ignores backdrop clicks and Escape; `onCloseAttempt` fires when a close is blocked,
and `close({ force: true })` overrides it.

Svelte UX dispatched `open`, `close`, and `closeAttempt` events; these are now the `onOpen`,
`onClose`, and `onCloseAttempt` callback props.

## Basic

:example{name="basic" showCode}

## Placement

:example{name="placement"}

## Persistent

`persistent` ignores backdrop clicks and Escape, so the drawer can only be dismissed by an explicit
action — `close({ force: true })`. `onCloseAttempt` fires each time a dismissal is refused, which is
where an "unsaved changes" prompt goes.

:example{name="persistent"}
