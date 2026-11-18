---
description: Render a date range as text, collapsing to a single date when equal
category: date
related: [ui/DateField, utils/format]
---

## Usage

```svelte
<script lang="ts">
  import { DateRangeDisplay } from '@layerstack/ui';
</script>

<DateRangeDisplay value={{ from, to, periodType }} />
```

Shows one date when `from` and `to` are the same period, and both otherwise. Period types that
already span a range on their own — weeks, bi-weeks, quarters — always show both ends, and are
formatted by their sub-period (a week reads as days, a quarter as months).

## Basic

:example{name="basic" showCode}
