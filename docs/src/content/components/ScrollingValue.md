---
description: Odometer-style number that scrolls between values
category: motion
related: [ui/SpringValue, ui/TweenedValue]
---

## Usage

```svelte
<script lang="ts">
  import { ScrollingValue } from '@layerstack/ui';
</script>

<ScrollingValue {value} />
```

Renders the current and next values stacked in the same cell and slides between them, so digits
roll rather than swap. `single` wraps from 9 back to 0 for a single-digit display, and `axis="x"`
scrolls horizontally.

## Basic

:example{name="basic" showCode}

## Axis, digits, and formatting

`single` wraps from 9 back to 0, so splitting a number into digits gives an odometer where each
column scrolls independently. `format` renders the value however you like — the scroll still
follows the numeric value.

:example{name="variations"}
