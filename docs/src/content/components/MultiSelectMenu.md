---
description: MultiSelect rendered inside a menu, anchored to a trigger
category: inputs
related: [ui/MultiSelect, ui/MultiSelectField, ui/Menu]
---

## Usage

```svelte
<script lang="ts">
  import { Button, MultiSelectMenu } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];

  let value = $state<string[]>([]);
  let open = $state(false);
</script>

<div class="relative inline-block">
  <Button onclick={() => (open = !open)}>Filter</Button>
  <MultiSelectMenu {options} bind:value bind:open />
</div>
```

`MultiSelectMenu` wraps [`MultiSelect`](/docs/ui/MultiSelect) in a [`Menu`](/docs/ui/Menu) with
`explicitClose`, so the menu stays open while options are toggled and closes on Cancel or Apply
(except in `mode="immediate"`, where it stays open). Give the trigger a positioned ancestor
(`relative`) so the menu anchors to it.

Use [`MultiSelectField`](/docs/ui/MultiSelectField) when you want a labelled form field rather than
an arbitrary trigger.

## Basic

:example{name="basic" showCode}

## Search

:example{name="search"}
