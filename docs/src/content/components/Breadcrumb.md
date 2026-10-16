---
description: Trail of items separated by a divider
category: navigation
related: [ui/Header, ui/Icon]
---

## Usage

```svelte
<script lang="ts">
  import { Breadcrumb } from '@layerstack/ui';
</script>

<Breadcrumb items={['Home', 'Docs', 'Breadcrumb']} />
```

`null` items are skipped, so optional segments can be passed inline. Supply an `item` snippet to
render something richer than text, and a `dividerSnippet` to replace the chevron.

## Basic

:example{name="basic" showCode}

## Dividers

:example{name="dividers"}

## Custom items

`items` can be any shape — supply an `item` snippet to render it. Entries that are `null` are
skipped, so a sparse path does not have to be filtered first.

:example{name="custom-items"}
