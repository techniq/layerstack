---
title: sticky
description: Stick an element to the edges of its scroll container — `sticky` and `stickyContext`
related: [ui/Table, svelte-table/actions, svelte-actions/sticky]
---

## Usage

```js
import { sticky, stickyContext } from '@layerstack/svelte-attachments';
```

The two work as a pair. `stickyContext` measures the scroll container once and publishes the
offsets as CSS variables (`--sticky-top`, `--sticky-bottom`); `sticky` positions individual
elements against those variables. Splitting them this way means many sticky elements share a single
measurement rather than each computing its own.

## sticky

Sets `position: sticky` plus an offset for each enabled edge. With no options it sticks to the top.

:example{component="attach-sticky" name="basic" showCode}

The top offset includes the element's own `offsetTop`, so nested headers stack against their parent
rather than all landing at the same place.

## Multiple edges

Enabling more than one edge pins the element in both directions, which is how a table's corner cell
stays visible while scrolling either way. Sticky elements overlap as they scroll, so give them an
explicit `z-index`.

:example{component="attach-sticky" name="table"}

## stickyContext

Establishes the offsets that `sticky` children position against.

- `type: 'page'` (default) — the page scrolls. Measures the element's offset from the top of the
  document, discounting any scrolling ancestor.
- `type: 'container'` — the element itself scrolls. Sets `overflow: scroll` and a zero offset.
