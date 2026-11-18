---
description: Field that opens a menu of options, without a text input
category: overlays
related: [ui/SelectField, ui/MenuButton, ui/Field]
---

## Usage

```svelte
<script lang="ts">
  import { MenuField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];

  let value = $state('apple');
</script>

<MenuField label="Fruit" {options} bind:value />
```

`MenuField` is the non-searchable sibling of [`SelectField`](/docs/ui/SelectField) — it renders a
[`Field`](/docs/ui/Field) showing the selected label rather than a text input, so the value can only
be changed from the menu (or the stepper). Prefer `SelectField` once the list is long enough to
want filtering.

`selected` is bindable and holds the option matching `value`.

## Basic

:example{name="basic" showCode}

## Grouped options

Options sharing a `group` are rendered under a sticky header.

:example{name="grouped"}

## Stepper

`stepper` adds previous/next buttons that move through the options, wrapping at either end.

:example{name="stepper"}

## Custom display

The `selection` snippet replaces the field's displayed value.

:example{name="selection"}

## Icons and menu options

Options can carry an `icon`, and `menuProps` reaches the underlying [`Menu`](/docs/ui/Menu) for
placement, width, and transition settings.

:example{name="icons-and-menu"}
