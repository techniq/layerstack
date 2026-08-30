---
description: Segmented control with a sliding indicator, optionally driving panels
category: inputs
related: [ui/ToggleOption, ui/TogglePanel, ui/Radio]
---

## Usage

```svelte
<script lang="ts">
  import { ToggleGroup, ToggleOption } from '@layerstack/ui';

  let value = $state('week');
</script>

<ToggleGroup bind:value>
  <ToggleOption value="day">Day</ToggleOption>
  <ToggleOption value="week">Week</ToggleOption>
</ToggleGroup>
```

Options are radio inputs under the hood, so keyboard and form behavior come for free. The selection
indicator crossfades between options rather than being redrawn.

`value` matches either an option's `value` or its index.

## Basic

:example{name="basic" showCode}

## Variants

:example{name="variants"}

## Panels

Pair with [`TogglePanel`](/docs/ui/TogglePanel) in the `panes` snippet to build a tab set — panels
are matched to options by registration order.

:example{name="panels"}
