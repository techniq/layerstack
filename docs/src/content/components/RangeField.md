---
description: Range slider in a labelled field, with stepper buttons and a formatted value
category: inputs
related: [ui/Field, ui/NumberStepper, ui/RangeSlider]
---

## Usage

```svelte
<script lang="ts">
  import { RangeField } from '@layerstack/ui';

  let value = $state(50);
</script>

<RangeField label="Volume" bind:value />
```

The displayed value uses a [format preset](/docs/utils/format), and its width is reserved for the
widest of `min`/`value`/`max` so the slider does not shift as the number changes.

## Basic

:example{name="basic" showCode}

## Bounds, step, and format

:example{name="options"}
