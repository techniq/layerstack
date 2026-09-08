---
description: Provide app-wide settings — locale, theme, icons, and component defaults
category: app
related: [ui/ThemeInit, ui/ThemeSelect]
---

## Usage

```svelte
<script lang="ts">
  import { Settings } from '@layerstack/ui';
</script>

<Settings themes={{ light: ['light'], dark: ['dark'] }}>
  <App />
</Settings>
```

A component form of the `settings()` function, for when configuration is more natural in markup
than in a script. It also renders [`ThemeInit`](/docs/ui/ThemeInit) by default.

Everything reachable through `getSettings()` — locale and formatting, the current theme, icons,
per-component defaults and classes — comes from here.

```js
import { settings } from '@layerstack/ui';

settings({
  themes: { light: ['light'], dark: ['dark'] },
  components: { Button: { variant: 'fill', color: 'primary' } },
});
```

## Basic

`components` sets per-component default props and classes for everything below it. Props given
directly on a component still win, so the defaults are a starting point rather than a lock.

Nest `Settings` to scope different defaults to part of a page.

:example{name="basic" showCode}
