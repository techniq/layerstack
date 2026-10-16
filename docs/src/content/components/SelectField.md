---
description: Text field that filters a list of options and selects one
category: inputs
related: [ui/MenuField, ui/MultiSelectField, ui/TextField, ui/QuickSearch]
---

## Usage

```svelte
<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];

  let value = $state<string | null>(null);
</script>

<SelectField label="Fruit" {options} bind:value />
```

`SelectField` combines a [`TextField`](/docs/ui/TextField) with a [`Menu`](/docs/ui/Menu) of
options. Typing filters the list; arrow keys move the highlight and `Enter` selects. The field text
is restored to the selected option's label when the menu closes without a new selection.

`selected` is bindable and holds the option matching `value`. A hidden `<input name={name}>` is
rendered so the value participates in native form submission.

For a plain menu with no filtering use [`MenuField`](/docs/ui/MenuField); to select more than one
value use [`MultiSelectField`](/docs/ui/MultiSelectField).

## Basic

:example{name="basic" showCode}

## Grouped options

Options sharing a `group` are rendered under a sticky header.

:example{name="grouped"}

## Inline options

`inlineOptions` renders the list below the input instead of in a menu — useful inside a dialog or
sidebar that is already a popup. This is how [`QuickSearch`](/docs/ui/QuickSearch) is built.

:example{name="inline-options"}

## Async search

`search` replaces the default filter and may return a promise, so options can be fetched as the
user types. Pair it with `loading` to show a spinner.

:example{name="async-search"}

## Stepper and option icons

`stepper` adds previous/next buttons that move through the options. `activeOptionIcon` swaps the
field's icon for the selected option's.

:example{name="stepper"}

## Custom options and actions

`option` replaces the rendering of each row. `beforeOptions`, `afterOptions`, and `actions` add
content around the list — each receives `hide` to close the menu.

:example{name="custom-options"}

## States

:example{name="states"}

## Option values

`value` is not restricted to strings — options can carry objects, and the same value may appear
under more than one `group`. `search` replaces the default case-insensitive label filter.

:example{name="option-values"}
