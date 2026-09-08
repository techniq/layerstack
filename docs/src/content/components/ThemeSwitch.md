---
description: Switch that toggles between the light and dark themes
category: app
related: [ui/ThemeSelect, ui/Switch, svelte-state/ThemeState]
---

## Usage

```svelte
<script lang="ts">
  import { ThemeSwitch } from '@layerstack/ui';
</script>

<ThemeSwitch />
```

A [`Switch`](/docs/ui/Switch) wired to the [`ThemeState`](/docs/svelte-state/ThemeState) from
`settings()`. Use [`ThemeSelect`](/docs/ui/ThemeSelect) when there is more than one theme per
scheme, or when "system" should be offered.

Svelte UX dispatched a `themeSet` event; this is now the `onThemeSet` callback prop.

## Basic

:example{name="basic" showCode}

## Customization

`ThemeSwitch` is a [`Switch`](/docs/ui/Switch) with the sun/moon icons in its knob, so every
`Switch` prop passes through.

:example{name="customization"}
