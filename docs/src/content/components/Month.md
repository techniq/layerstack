---
description: Calendar grid for one month, with controls to move between months
category: date
related: [ui/DateSelect, ui/DateButton, ui/DatePickerField]
---

## Usage

```svelte
<script lang="ts">
  import { Month } from '@layerstack/ui';
</script>

<Month {selected} onDateChange={(date) => (selected = date)} />
```

`startOfMonth` is bindable and derived from `selected` when not supplied. `hideControls` lets an
enclosing component drive the displayed month instead.

`selected` accepts a `Date`, an array of dates, or a `{ from, to }` range — the range case shades
the days between.

`utc` switches both period math and display to UTC boundaries, so a date entered as `08/12` stays
the 12th regardless of the viewer's timezone.

## Basic

:example{name="basic" showCode}

## Selection

`selected` accepts a single `Date`, an array of dates, or a `{ from, to }` range — the calendar
styles each shape differently (a range fills the days between its ends).

:example{name="selection"}

## Disabled and outside days

`disabledDates` takes a date, an array, a `{ from, to }` range, or a predicate. `showOutsideDays`
fills the leading and trailing week with the neighbouring months.

:example{name="disabled-and-outside"}
