---
description: Collapse styled as a stacked panel, for settings and detail lists
category: layout
related: [ui/Collapse, ui/ListItem]
---

## Usage

```svelte
<script lang="ts">
  import { ExpansionPanel } from '@layerstack/ui';
</script>

<ExpansionPanel name="Details">Content</ExpansionPanel>
```

A [`Collapse`](/docs/ui/Collapse) with panel styling — rounded on the first and last item, divided
between. `list` controls how first/last are detected: `parent` (siblings), `type` (same element
type), or `group` (nearest `group` class).

`disabled` hides the chevron for a panel with nothing to reveal.

Note that the `actions` snippet renders _inside_ the collapsible area, so it appears only when the
panel is expanded — matching Svelte UX.

## Basic

:example{name="basic" showCode}

## Composition

A [`ListItem`](/docs/ui/ListItem) makes a natural trigger. `disabled` hides the expand affordance
for a row with nothing to reveal, so a mixed list stays aligned.

:example{name="composition"}
