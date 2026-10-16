---
description: Form field that opens a multi-select menu and summarizes the selection
category: inputs
related: [ui/MultiSelect, ui/MultiSelectMenu, ui/SelectField, ui/Field]
---

## Usage

```svelte
<script lang="ts">
  import { MultiSelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];

  let value = $state<string[]>([]);
</script>

<MultiSelectField label="Fruit" {options} bind:value />
```

`MultiSelectField` pairs a read-only [`TextField`](/docs/ui/TextField) with a
[`MultiSelectMenu`](/docs/ui/MultiSelectMenu). The field shows a summary of the selection —
override it with `formatSelected`.

## Basic

:example{name="basic" showCode}

## Summarizing the selection

`formatSelected` receives the selected `value`s and the matching `options` — note that
`options` here is the _selected_ subset, not the full list.

:example{name="format-selected"}

## Search and max

Props forwarded to the menu go through `menuProps`; `max` and `mode` are lifted to the field for
convenience.

:example{name="search-and-max"}
