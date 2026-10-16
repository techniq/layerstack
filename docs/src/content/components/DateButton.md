---
description: A single selectable date within a calendar
category: date
related: [ui/Month, ui/MonthList, ui/YearList]
---

## Usage

```svelte
<DateButton date={day} periodType={PeriodType.Day} {selected} {onDateChange} />
```

Rendered for you by [`Month`](/docs/ui/Month), [`MonthList`](/docs/ui/MonthList), and
[`YearList`](/docs/ui/YearList).

It never writes to `selected` — it reports the clicked date through `onDateChange` and lets the
parent decide, since the selection may be a single date, an array, or a range.

`hidden` keeps its layout space (used for days outside the month), while `fade` dims it.

## Basic

:example{name="basic" showCode}
