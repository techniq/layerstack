---
description: Checkbox with an optional label, indeterminate state, and group binding
category: inputs
related: [ui/Radio, ui/Switch, ui/Selection]
---

## Usage

```svelte
<script lang="ts">
  import { Checkbox } from '@layerstack/ui';

  let checked = $state(false);
</script>

<Checkbox bind:checked>Accept terms</Checkbox>
```

## Basic

:example{name="basic" showCode}

## Groups

Binding a shared `group` array across several checkboxes derives each one's `checked` state from
membership, and toggling adds or removes the checkbox's `value`.

:example{name="group"}

## Sizes and states

`indeterminate` shows a dash instead of a check — the usual "some but not all children selected"
state. `circle` rounds the box.

:example{name="states"}

## Layout

:example{name="layout"}
