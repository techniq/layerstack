---
description: Scrollable list of years, each with its twelve months
category: date
related: [ui/MonthList, ui/DateSelect]
---

## Usage

```svelte
<MonthListByYear {selected} {onDateChange} />
```

Starts a couple of years either side of the selection and extends ten years at a time via the
"More" buttons at each end.

## Basic

:example{name="basic" showCode}

## Bounds and scrolling

`minDate`/`maxDate` bound which years are listed, and the selected year is scrolled into view on
mount — put it in a scrollable container to see that.

:example{name="bounds"}
