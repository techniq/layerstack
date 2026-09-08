---
description: Date picker that adapts its layout to the period type
category: date
related: [ui/Month, ui/MonthListByYear, ui/YearList]
---

## Usage

```svelte
<script lang="ts">
  import { DateSelect } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';
</script>

<DateSelect {selected} periodType={PeriodType.Day} {onDateChange} />
```

Chooses the right surface for the period being picked — a [`Month`](/docs/ui/Month) grid for days
and weeks, [`MonthListByYear`](/docs/ui/MonthListByYear) for months and quarters, and
[`YearList`](/docs/ui/YearList) for years.

## Basic

:example{name="basic" showCode}
