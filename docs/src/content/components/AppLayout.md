---
description: App shell with a fixed header and a responsive navigation drawer
category: app
related: [ui/AppBar, ui/NavItem, ui/Drawer]
---

## Usage

```svelte
<script lang="ts">
  import { AppLayout } from '@layerstack/ui';
</script>

<AppLayout>
  {#snippet nav()}<Nav />{/snippet}

  <AppBar title="Dashboard" />
  <main>…</main>
</AppLayout>
```

Below the `md` breakpoint the drawer becomes temporary — overlaid on a backdrop and dismissed on
click. Above it, the drawer is permanent and the content shifts to make room.

Open state lives on `settings().showDrawer`, so [`AppBar`](/docs/ui/AppBar)'s menu button and
[`NavItem`](/docs/ui/NavItem) (which closes the drawer on navigation) stay in sync without props.

`headerPosition="inset"` runs the nav full-height with the header beside it, rather than the header
spanning the full width.
