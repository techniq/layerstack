---
description: Row in a list, with an icon, title, subheading, and actions
category: layout
related: [ui/Avatar, ui/ExpansionPanel, ui/TreeList]
---

## Usage

```svelte
<script lang="ts">
  import { ListItem } from '@layerstack/ui';
</script>

<ul>
  <ListItem title="Profile" subheading="Your details" icon={mdiAccount} avatar />
</ul>
```

`avatar` wraps the icon in an [`Avatar`](/docs/ui/Avatar), and accepts an object of its props.
`list` controls how first/last rounding is detected — the same options as
[`ExpansionPanel`](/docs/ui/ExpansionPanel).

## Basic

:example{name="basic" showCode}

## Variations

Items round their first and last corners and space themselves based on `list` — `type` (siblings of
the same component, the default), `parent` (any children of a shared parent), or `group` (nearest
ancestor with a `group` class, which is what `animate:flip` wrappers need).

:example{name="variations"}
