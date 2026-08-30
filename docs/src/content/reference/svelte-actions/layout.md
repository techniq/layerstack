---
title: layout
description: Layout actions — `remainingViewportHeight`, `remainingViewportWidth`, and `overflow`
related: [ui/Overflow]
---

## Usage

```js
import {
  remainingViewportHeight,
  remainingViewportWidth,
  overflow,
} from '@layerstack/svelte-actions';
```

## remainingViewportHeight

Set `height` or `max-height` to viewport height excluding node's current viewport top

> TODO

## remainingViewportWidth

Set `width` or `max-width` to viewport width excluding node's current viewport left

> TODO

## overflow

Watch for overflow changes (x or y) and dispatch `overflow` event with amount

:example{component="action-layout" name="overflow" showCode}
