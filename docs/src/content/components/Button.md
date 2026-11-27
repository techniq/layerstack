---
description: Clickable button or link with variant, color, size, icon, and loading support
category: elements
related: [ui/ButtonGroup, ui/Icon, ui/ProgressCircle]
---

## Usage

```svelte
<script lang="ts">
  import { Button } from '@layerstack/ui';
</script>

<Button variant="fill" color="primary">Save</Button>
```

Renders a `<button>`, or an `<a>` when `href` is set.

## Variants

:example{name="variants" showCode}

## Colors

:example{name="colors"}

## Sizes

:example{name="sizes"}

## Icons

`icon` accepts the same values as [`Icon`](/docs/ui/Icon)'s `data` prop, or an object of `Icon`
props for finer control. A button with an icon and no children becomes a round icon-only button —
set `iconOnly` explicitly to override that.

:example{name="icons"}

## Loading

`loading` swaps the icon for a [`ProgressCircle`](/docs/ui/ProgressCircle).

:example{name="loading"}

## States

:example{name="states"}

## Attachments

Svelte UX's `actions` prop is gone. Pass [attachments](/docs/svelte-attachments/input) directly —
they travel through the rest props onto the underlying element:

```svelte
<script lang="ts">
  import { Button } from '@layerstack/ui';
  import { autoFocus } from '@layerstack/svelte-attachments';
</script>

<Button {@attach autoFocus()}>Focused on mount</Button>
```

## Defaults

Set app-wide defaults (and classes) for every `Button` via `settings()`:

```js
import { settings } from '@layerstack/ui';

settings({
  components: {
    Button: { variant: 'fill', color: 'primary', classes: 'shadow-sm' },
  },
});
```

A `Button` inside a [`ButtonGroup`](/docs/ui/ButtonGroup) inherits the group's `variant`, `color`,
`size`, and `rounded` unless it sets its own. Precedence is: explicit prop → group → `settings()` →
built-in default.
