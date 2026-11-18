---
description: Inline script that applies the stored theme before first paint
category: app
related: [ui/Settings, ui/ThemeSelect, svelte-state/ThemeState]
---

## Usage

```svelte
<script lang="ts">
  import { ThemeInit } from '@layerstack/ui';
</script>

<ThemeInit />
```

Renders a small script into `<head>` that reads the persisted theme and applies it synchronously,
avoiding a flash of the wrong color scheme on load.

[`Settings`](/docs/ui/Settings) renders this for you unless `themeInit={false}`, so you rarely need
it directly.
