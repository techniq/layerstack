---
description: Searchable list of checkboxes with Cancel/Apply actions
category: inputs
related: [ui/MultiSelectField, ui/MultiSelectMenu, ui/MultiSelectOption, ui/SelectField]
---

## Usage

```svelte
<script lang="ts">
  import { MultiSelect } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];

  let value = $state<string[]>([]);
</script>

<MultiSelect {options} bind:value onChange={({ value }) => console.log(value)} />
```

`MultiSelect` is the list itself, without a trigger. Wrap it in a menu with
[`MultiSelectMenu`](/docs/ui/MultiSelectMenu), or in a form field with
[`MultiSelectField`](/docs/ui/MultiSelectField).

Selected options float to the top of the list (animated with `duration`) unless `maintainOrder` is
set. The reorder happens on _apply_, not while toggling, so options do not jump under the pointer.

## Basic

:example{name="basic" showCode}

## Modes

In the default `actions` mode changes are staged until Apply is pressed — `Apply` stays disabled
until the selection differs from the last applied one. `mode="immediate"` reports every toggle and
hides the buttons.

:example{name="modes"}

## Search

`search` shows a filter box. Pass a function to replace the default (case-insensitive label)
filter; it may return a promise.

:example{name="search"}

## Max selection

`max` caps the number of selected values — unselected options are disabled once the cap is reached.

:example{name="max"}

## Indeterminate and custom options

`indeterminateSelected` marks values as partially selected (ex. a group where only some children
are selected). The `option` snippet replaces the rendering of each row and receives `onChange` to
toggle it.

:example{name="custom-options"}

## Async apply

`onApply` is awaited before the change is reported, and the Apply button shows a spinner while it
runs.

```svelte
<MultiSelect
  {options}
  bind:value
  onApply={async ({ value }) => {
    await saveFilters(value);
  }}
/>
```

## Option variants and order

`optionProps.variant` picks how each row draws its selected state. `maintainOrder` keeps the list in
its original order rather than floating selected options to the top.

:example{name="variants-and-order"}

## Surrounding content and long lists

`beforeOptions`, `afterOptions`, and `actions` each receive the live `selection`, so a header can
show a count or a footer can add a Clear button. `infiniteScroll` renders a long list in chunks.

:example{name="slots"}
