---
description: Nested list rendered recursively from a tree of nodes
category: navigation
related: [ui/ListItem]
---

## Usage

```svelte
<script lang="ts">
  import { TreeList } from '@layerstack/ui';
</script>

<TreeList {nodes}>
  {#snippet children({ node })}
    {node.name}
  {/snippet}
</TreeList>
```

Nodes come from `@layerstack/utils`' `TreeNode` shape. `classes.ul`/`classes.li` and `props.ul`/
`props.li` accept either a static value or a function of the node, so depth-dependent styling
works without a wrapper.

Each `<li>` carries `data-level`, which is handy for indentation via CSS.

## Basic

:example{name="basic" showCode}
