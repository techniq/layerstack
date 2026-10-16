---
description: Navigation link that knows whether it is the active route
category: app
related: [ui/AppLayout, ui/Icon]
---

## Usage

```svelte
<script lang="ts">
  import { NavItem } from '@layerstack/ui';
  import { page } from '$app/state';
</script>

<NavItem currentUrl={page.url} path="/docs" text="Docs" />
```

Adds an `is-active` class (and `classes.active`) when `path` matches `currentUrl`, and scrolls
itself into view when active — so the current item is visible in a long sidebar on load.

On narrow viewports it also closes the app drawer on click, via `settings().showDrawer`.

## Basic

:example{name="basic" showCode}
