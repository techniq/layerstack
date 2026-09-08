---
description: Radio button with an optional label, bound to a shared group
category: inputs
related: [ui/Checkbox, ui/ToggleGroup]
---

## Usage

```svelte
<script lang="ts">
  import { Radio } from '@layerstack/ui';

  let group = $state('a');
</script>

<Radio bind:group value="a" name="example">Option A</Radio>
```

Radios sharing a `name` and a bound `group` behave as one set — the one whose `value` matches
`group` is checked.

## Basic

:example{name="basic" showCode}

## Sizes and states

:example{name="states"}

## Layout

:example{name="layout"}
