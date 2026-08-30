---
description: A single event on a Timeline
category: layout
related: [ui/Timeline]
---

## Usage

```svelte
<TimelineEvent start="Created" completed />
```

`start` renders above (horizontal) or left (vertical) of the line, `end` on the other side.
`completed` colors the point and the line leading up to it.

Orientation, the shared icon, and `snapPoint` come from the enclosing
[`Timeline`](/docs/ui/Timeline).

## Examples

See [`Timeline`](/docs/ui/Timeline) for rendered examples.
