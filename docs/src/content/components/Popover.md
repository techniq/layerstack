---
description: Floating element positioned against an anchor, portaled out of the DOM hierarchy
category: overlays
related: [ui/Menu, svelte-attachments/input]
---

## Usage

```svelte
<script lang="ts">
  import { Popover } from '@layerstack/ui';

  let open = $state(false);
</script>

<div class="relative inline-block">
  <button onclick={() => (open = !open)}>Toggle</button>

  <Popover bind:open placement="bottom-start">
    <div>Floating content</div>
  </Popover>
</div>
```

Positioning uses [floating-ui](https://floating-ui.com/), and the element is portaled to the
nearest `.PortalTarget` or `<body>` so it escapes `overflow` and stacking contexts. By default it
anchors to its parent element — pass `anchorEl` to anchor elsewhere.

## Basic

:example{name="basic" showCode}

## Placement

`autoPlacement` flips to whichever side of the viewport has more room, and `resize` constrains the
popover to the space that remains.

:example{name="placement"}

## Closing

A popover closes on Escape or on a click that starts and ends outside both it and its anchor.
`onClose` reports the reason:

```svelte
<Popover bind:open onClose={(reason) => console.log(reason)} />
```

Svelte UX dispatched a `clickOutside` DOM event from the underlying action. That is now the
`onClickOutside` option of the
[`popover` attachment](https://github.com/techniq/layerstack/blob/main/packages/svelte-attachments/src/lib/popover.ts),
which `Popover` uses to drive `onClose`.
