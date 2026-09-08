---
description: Toggle control styled as a sliding switch
category: inputs
related: [ui/Checkbox, ui/Toggle]
---

## Usage

```svelte
<script lang="ts">
  import { Switch } from '@layerstack/ui';

  let checked = $state(false);
</script>

<Switch bind:checked />
```

A styled `<input type="checkbox">`, so it participates in forms and keyboard navigation normally.
`checked` also accepts `null` for an indeterminate state.

## Basic

:example{name="basic" showCode}

## Sizes, colors, and states

:example{name="states"}

## Labels and knob content

Wrap the switch in a `<label>` to make the text toggle it. The `children` snippet renders inside the
knob and receives the current `checked` value.

:example{name="labels-and-icons"}
