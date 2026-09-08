---
description: The twelve months of a year as selectable buttons
category: date
related: [ui/MonthListByYear, ui/DateSelect]
---

## Usage

```svelte
<MonthList year={2024} {selected} {onDateChange} />
```

Defaults to short month names. In `utc` mode the month starts are built from UTC fields rather than
floored locally, which would otherwise land in the neighbouring month.

## Basic

:example{name="basic" showCode}

## Formats and selection

`format` accepts a [`DateToken`](/docs/utils/format), so months can read as short names, full names,
or numbers. `selected` takes the same shapes as [`Month`](/docs/ui/Month) — a date, an array, or a
range.

:example{name="formats-and-selection"}

## Disabled months

:example{name="disabled"}
