---
description: Numeric input with decrement and increment buttons
category: inputs
related: [ui/TextField, ui/RangeField]
---

## Usage

```svelte
<script lang="ts">
  import { NumberStepper } from '@layerstack/ui';

  let value = $state(1);
</script>

<NumberStepper bind:value min={0} max={10} />
```

A [`TextField`](/docs/ui/TextField) of `type="integer"` with stepper buttons in its prepend and
append slots. The buttons disable at `min`/`max`, and the text selects on focus so typing replaces
the value.

`onChange` fires for both typing and the stepper buttons.

## Basic

:example{name="basic" showCode}

## Bounds, step, and density

:example{name="options"}

## Prefix and suffix

The `prefix`/`suffix` snippets render inside the field, between the stepper buttons and the input.

:example{name="prefix-suffix"}
