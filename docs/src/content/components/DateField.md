---
description: Text input for a date, with masking and an optional calendar picker
category: date
related: [ui/DatePickerField, ui/TextField, ui/Field]
---

## Usage

```svelte
<script lang="ts">
  import { DateField } from '@layerstack/ui';

  let value = $state<Date | null>(null);
</script>

<DateField label="Date" bind:value />
```

Typing is masked to the locale's parsing format, and the text is parsed back into a `Date` as it
changes. `picker` adds a [`DatePickerField`](/docs/ui/DatePickerField) button in the append slot.

With `utc`, entering `08/12/2026` produces `2026-08-12T00:00:00.000Z` rather than local midnight —
the calendar fields are re-mapped onto UTC after parsing, since parsing always builds a local date.

## Basic

:example{name="basic" showCode}

## Variations

The input is masked from `format`, so typing `08122026` fills in the separators. `picker` adds a
calendar button, and `utc` parses to UTC midnight rather than local midnight — use it for values
keyed on a calendar date rather than an instant.

:example{name="variations"}
