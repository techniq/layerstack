---
description: Command-palette style search dialog
category: navigation
related: [ui/SelectField, ui/Dialog, ui/Kbd]
---

## Usage

```svelte
<script lang="ts">
  import { QuickSearch } from '@layerstack/ui';

  const options = [
    { label: 'Dashboard', value: '/dashboard' },
    { label: 'Settings', value: '/settings' },
  ];

  let open = $state(false);
</script>

<QuickSearch {options} bind:open onChange={({ value }) => goto(value)} />
```

`QuickSearch` renders a search button plus a [`Dialog`](/docs/ui/Dialog) containing an inline
[`SelectField`](/docs/ui/SelectField). The input is focused and selected as the dialog opens, and
the dialog closes once an option is chosen.

The button shows a `⌘K` hint but does not register the shortcut — bind `open` and add the key
handler yourself, so the shortcut can live wherever it makes sense for your app.

Options with a `group` are collected under a header, which is the usual way to split "Pages" from
"Actions".

## Basic

:example{name="basic" showCode}

## Keyboard shortcut

:example{name="keyboard-shortcut"}
