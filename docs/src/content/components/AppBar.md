---
description: Application header with a drawer toggle, title, and actions
category: app
related: [ui/AppLayout, ui/NavItem, ui/Breadcrumb]
---

## Usage

```svelte
<script lang="ts">
  import { AppBar } from '@layerstack/ui';
</script>

<AppBar title="Dashboard" />
```

Pairs with [`AppLayout`](/docs/ui/AppLayout) — the menu button toggles `settings().showDrawer`,
which the layout reads.

An array `title` renders as a [`Breadcrumb`](/docs/ui/Breadcrumb) and joins with `›` for
`document.title`, which is kept in sync unless `head={false}`.

## Basic

`title` accepts a string or an array — an array renders as a [`Breadcrumb`](/docs/ui/Breadcrumb).
The `actions` snippet fills the trailing edge.

By default the bar also writes `title` to `document.title`; pass `head={false}` to leave the page
title alone.

:example{name="basic" showCode}

## Menu icon

The leading button toggles [`AppLayout`](/docs/ui/AppLayout)'s drawer.

:example{name="menu-icon"}
