---
description: Elapsed time between two dates, ticking live when the end is open
category: date
related: [utils/Duration, svelte-state/TimerState]
---

## Usage

```svelte
<script lang="ts">
  import { Duration } from '@layerstack/ui';
</script>

<Duration start={createdAt} />
```

With no `end`, the duration ticks against the current time. The update interval adapts to what is
actually displayed — once the value is large enough that seconds are no longer shown, it drops to
once a minute rather than once a second.

Formatting is [`Duration`](/docs/utils/Duration) from `@layerstack/utils`; `minUnits`, `totalUnits`,
and `variant` are passed through.

## Basic

:example{name="basic" showCode}
