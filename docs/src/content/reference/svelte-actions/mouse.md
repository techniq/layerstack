---
title: mouse
description: Mouse interaction actions — `longpress` (press-and-hold) and `movable` (drag tracking)
---

## Usage

```js
import { longpress, movable } from '@layerstack/svelte-actions';
```

## longpress

Dispatch event after element has been pressed for a duration of time

:example{name="longpress"}

## movable

Track mouse position changes from mouse down on node to mouse up

:example{name="movable"}

### With pixel steps / snapping

:example{name="movable-step"}

### With percentage of parent steps / snapping

:example{name="movable-step-percent"}

### x-axis only

:example{name="movable-x-axis"}
