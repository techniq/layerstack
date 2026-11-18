---
description: A single selectable option within a ToggleGroup
category: inputs
related: [ui/ToggleGroup, ui/TogglePanel]
---

## Usage

```svelte
<ToggleOption value="day">Day</ToggleOption>
```

Must be used inside a [`ToggleGroup`](/docs/ui/ToggleGroup), which supplies its styling and
selection state. The `children` snippet receives `{ selected }` for content that reacts to
selection.

## Examples

See [`ToggleGroup`](/docs/ui/ToggleGroup) for rendered examples.
