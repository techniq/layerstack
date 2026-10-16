---
title: ThemeState
description: Manage the selected theme, persisting it to local storage and following the system `prefers-color-scheme` setting
related: [svelte-stores/themeStore, svelte-state/MediaQueryPresets]
---

## Usage

```js
import { ThemeState } from '@layerstack/svelte-state';

const theme = new ThemeState({
  light: ['light'],
  dark: ['dark'],
});

theme.theme; // selected theme name, or `null` when following the system setting
theme.dark; // whether the current theme is a dark theme
theme.resolvedTheme; // the theme actually in use
theme.themes; // `{ light, dark }` as configured

theme.setTheme('dark');
theme.setTheme('system'); // follow `prefers-color-scheme`
```

Replaces [`createThemeStore`](/docs/svelte-stores/themeStore) from `@layerstack/svelte-stores`.
Instead of subscribing to a store (`$currentTheme.resolvedTheme`), read the properties directly
(`theme.resolvedTheme`) — they are reactive.

## Behavior

Selecting a theme writes it to `localStorage`, sets `<html data-theme="...">`, and toggles
`<html class="dark">` when the name appears in the `dark` list. Selecting `system` clears both and
follows the `(prefers-color-scheme: dark)` media query, updating as the OS setting changes.

The `dark` class is only managed for the system setting when at least one dark theme is configured,
so a light-only app is never forced into dark mode.

## Basic

:example{name="basic" showCode}

## Server-side rendering

During SSR there is no `localStorage` or `document`, so `setTheme` only records the selection —
`theme` and `dark` still resolve, and the DOM is updated once the constructor re-runs in the
browser.
