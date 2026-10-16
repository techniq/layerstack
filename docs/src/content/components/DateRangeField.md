---
description: Field that opens a dialog to pick a date range
category: date
related: [ui/DateRange, ui/DatePickerField, ui/DateRangeDisplay]
---

## Usage

```svelte
<script lang="ts">
  import { DateRangeField } from '@layerstack/ui';
  import type { DateRange } from '@layerstack/utils/dateRange';

  let value = $state<DateRange>({ from: null, to: null, periodType: null });
</script>

<DateRangeField bind:value />
```

`DateRangeField` shows the current range as text and opens a [`DateRange`](/docs/ui/DateRange)
picker in a dialog. The dialog holds its own pending range — `value` only changes when OK is
pressed, so Cancel leaves it untouched.

`stepper` adds previous/next buttons that shift the range by its own length. `quickPresets` shows a
menu of ranges before opening the full picker. `emptyDateRange` is exported as a convenient initial
value.

## Basic

:example{name="basic" showCode}

## Stepper

:example{name="stepper"}

## Quick presets

:example{name="quick-presets"}

## UTC

Set `utc` when the value is keyed on a UTC calendar date (a partition or `ds` column, say), so the
field is unaffected by the viewer's timezone or by DST.

:example{name="utc"}
