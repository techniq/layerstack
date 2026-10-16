---
description: Calendar picker for a start/end date range, with period presets
category: date
related: [ui/DateRangeField, ui/DateSelect, ui/DateRangeDisplay]
---

## Usage

```svelte
<script lang="ts">
  import { DateRange } from '@layerstack/ui';
  import type { DateRange as DateRangeType } from '@layerstack/utils/dateRange';

  let selected = $state<DateRangeType>({ from: null, to: null, periodType: null });
</script>

<DateRange bind:selected />
```

`DateRange` is the picker body — a period-type selector, a list of presets ("Last 7 days", "Last
month", …), and a calendar. It has no field or dialog of its own; use
[`DateRangeField`](/docs/ui/DateRangeField) for that.

The first calendar click sets `from` and clears `to`; the second sets `to`, swapping the two if the
range was drawn backwards.

`periodTypes` chooses which period types appear, and `getPeriodTypePresets` replaces the generated
preset list. Set `utc` when the value is keyed on a UTC calendar date (ex. a partition or `ds`
column), so the picker is unaffected by the viewer's timezone or by DST.

## Basic

:example{name="basic" showCode}

## Limiting period types

:example{name="period-types"}

## Disabled dates

`disabledDates` accepts a predicate, a date, an array of dates, or a `{ from, to }` range.

:example{name="disabled-dates"}
