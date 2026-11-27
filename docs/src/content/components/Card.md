---
description: Surface grouping a header, content, and actions
category: elements
related: [ui/Header, ui/Overlay, ui/ProgressCircle]
---

## Usage

```svelte
<script lang="ts">
  import { Card } from '@layerstack/ui';
</script>

<Card title="Title" subheading="Subheading">
  {#snippet contents()}Content{/snippet}
  {#snippet actions()}<Button>Save</Button>{/snippet}
</Card>
```

`title` and `subheading` are passed through to [`Header`](/docs/ui/Header), so arrays render as a
breadcrumb. The `header` snippet replaces the whole default header.

`children` renders directly inside the card; `contents` adds the standard padding.

## Basic

:example{name="basic" showCode}

## Loading

`loading` covers the card with an [`Overlay`](/docs/ui/Overlay) and a spinner.

## Headers

:example{name="headers"}

## Contents and actions

:example{name="slots"}
