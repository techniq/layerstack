---
description: Scrollable list of selectable years
category: date
related: [ui/MonthListByYear, ui/DateSelect]
---

## Usage

```svelte
<YearList {selected} {onDateChange} />
```

Starts a couple of years either side of the selection and extends a year at a time via the "More"
buttons. In `utc` mode the year starts are built from UTC fields, which would otherwise floor into
the neighbouring year.

## Basic

:example{name="basic" showCode}

## Bounds and disabled years

:example{name="bounds"}
