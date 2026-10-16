---
description: Button whose label reflects the selected option and whose menu changes it
category: overlays
related: [ui/MenuField, ui/Menu, ui/SelectField]
---

## Usage

```svelte
<script lang="ts">
  import { MenuButton } from '@layerstack/ui';

  const options = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ];

  let value = $state('day');
</script>

<MenuButton {options} bind:value />
```

Use `MenuButton` when the current selection belongs on the trigger itself — a period picker in a
toolbar, for example. For a labelled form control use [`MenuField`](/docs/ui/MenuField), and for a
searchable list use [`SelectField`](/docs/ui/SelectField).

All remaining props are forwarded to the underlying [`Button`](/docs/ui/Button), so `variant`,
`size`, `color`, and `icon` work as usual.

## Basic

:example{name="basic" showCode}

## Custom label

The `selection` snippet replaces the generated label and receives the matching option.

:example{name="selection"}

## Custom menu

The `children` snippet replaces the generated menu items entirely. It receives `options`,
`selected`, `setValue`, and `close`.

:example{name="custom-menu"}

## Icons and menu options

:example{name="icons-and-menu"}
