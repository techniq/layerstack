---
description: Navigation built from the headings on the page, tracking the one in view
category: navigation
related: [ui/TreeList, ui/NavItem]
---

## Usage

```svelte
<script lang="ts">
  import { TableOfContents } from '@layerstack/ui';
</script>

<TableOfContents element="main" />
```

Collects headings from `element`, assigns ids to any that lack one, nests them by level into a
[`TreeList`](/docs/ui/TreeList), and marks the heading currently in view with `data-active` — style
it with `data-[active]:` utilities.

`scrollOffset` accounts for a fixed header, so a heading is considered active once it reaches the
bottom of it rather than the top of the viewport.

## Basic

:example{name="basic" showCode}

## Depth and indentation

`maxDepth` limits which heading levels are collected. `itemIndent` nests the list items themselves,
while `linkIndent` leaves the list flat and indents the links by their level — the latter is what
makes a single continuous rail possible.

:example{name="styling"}
