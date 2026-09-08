---
description: Field that opens a calendar dialog to pick a date
category: date
related: [ui/DateField, ui/DateSelect, ui/Dialog]
---

## Usage

```svelte
<script lang="ts">
  import { DatePickerField } from '@layerstack/ui';

  let value = $state<Date | null>(null);
</script>

<DatePickerField bind:value />
```

The dialog holds its own pending selection — `value` only changes when OK is pressed, so Cancel
leaves it untouched.

`stepper` adds previous/next buttons that move by `periodType`. `iconOnly` renders just a calendar
button, which is how [`DateField`](/docs/ui/DateField) embeds it.

## Basic

:example{name="basic" showCode}

## Variations

:example{name="variations"}
