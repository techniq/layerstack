---
description: Sequence of events along a line, horizontal or vertical
category: layout
related: [ui/TimelineEvent, ui/Steps]
---

## Usage

```svelte
<script lang="ts">
  import { Timeline } from '@layerstack/ui';
</script>

<Timeline data={[{ start: 'Created', completed: true }, { start: 'Merged' }]} />
```

`compact` moves the line to one side with all values on the other. A shared `icon` and `snapPoint`
are passed to every [`TimelineEvent`](/docs/ui/TimelineEvent) through context.

Where [`Steps`](/docs/ui/Steps) shows progress through a flow, `Timeline` shows events in time —
each can carry a value on either side of the line.

## Basic

:example{name="basic" showCode}

## Layouts

Each event has a `start` and an `end` value, rendered on opposite sides of the line. Supplying both
alternates the events across it; `snapPoint` pulls the marker to the start of the event rather than
centering it.

:example{name="layouts"}

## Vertical and composed

:example{name="vertical"}
