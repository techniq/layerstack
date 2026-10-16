---
description: Content panel shown when its matching ToggleOption is selected
category: state
related: [ui/ToggleGroup, ui/ToggleOption]
---

## Usage

```svelte
<ToggleGroup value="a">
  <ToggleOption value="a">A</ToggleOption>

  {#snippet panes()}
    <TogglePanel>Panel A</TogglePanel>
  {/snippet}
</ToggleGroup>
```

Panels pair with options by registration order — the first `TogglePanel` belongs to the first
`ToggleOption`, and so on.

## Examples

See [`ToggleGroup`](/docs/ui/ToggleGroup) for rendered examples.
