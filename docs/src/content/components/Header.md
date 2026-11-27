---
description: Title and subheading row with slots for an avatar and actions
category: app
related: [ui/Card, ui/Breadcrumb, ui/Avatar]
---

## Usage

```svelte
<script lang="ts">
  import { Header } from '@layerstack/ui';
</script>

<Header title="Title" subheading="Subheading" />
```

Passing an array for `title` or `subheading` renders it as a [`Breadcrumb`](/docs/ui/Breadcrumb).
The `titleSnippet` and `subheadingSnippet` snippets replace either entirely — they are named with
a suffix because `title` is already a prop.

## Basic

:example{name="basic" showCode}
