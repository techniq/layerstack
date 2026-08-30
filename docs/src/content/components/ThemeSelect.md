---
description: Menu for choosing a theme or following the system color scheme
category: app
related: [ui/ThemeSwitch, ui/ThemeInit, svelte-state/ThemeState]
---

## Usage

```svelte
<script lang="ts">
  import { ThemeSelect } from '@layerstack/ui';
</script>

<ThemeSelect />
```

Adapts to how many themes are configured. With one theme per scheme it offers a simple
Light / Dark / System menu; with several it shows a mode switch plus a swatch picker, and a button
to return to the system setting.

`keyboardShortcuts` binds `Ctrl+T` to toggle the scheme and `Ctrl+Shift+T` to cycle themes within
it.

Svelte UX dispatched a `themeSet` event; this is now the `onThemeSet` callback prop, which receives
`'system'` when reset.

## Basic

:example{name="basic" showCode}

## Options

`lightThemes`/`darkThemes` override the lists given to `settings()`. `keyboardShortcuts` binds
`Ctrl+T` to toggle the color scheme and `Ctrl+Shift+T` to cycle through the themes.

:example{name="options"}
