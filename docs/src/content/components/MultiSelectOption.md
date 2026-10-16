---
description: A single toggleable row within a MultiSelect
category: inputs
related: [ui/MultiSelect, ui/Checkbox]
---

## Usage

```svelte
<script lang="ts">
  import { MultiSelectOption } from '@layerstack/ui';

  let checked = $state(false);
</script>

<MultiSelectOption bind:checked onChange={() => console.log(checked)}>Apple</MultiSelectOption>
```

`MultiSelectOption` is the row [`MultiSelect`](/docs/ui/MultiSelect) renders by default. Use it
directly when supplying a custom `option` snippet, so custom rows keep the same layout and states.

`variant` controls how the selected state is drawn: `checkbox` (default), `checkmark` (a leading
check that appears when selected), or `fill` (a filled row, no checkbox). Only the `checkbox`
variant toggles `checked` itself — the other two report the click through `onChange` and leave the
state to you.

## Variants

:example{name="variants" showCode}

## Actions

The `actions` snippet renders in a trailing column beside the option, for per-row controls.

:example{name="actions"}
