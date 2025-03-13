---
'@layerstack/tailwind': patch
---

fix(theme.css): Provide default colors (instead of black) for theme variables. Use `color-mix()` to derive `-50`:`-950` shades of all theme colors (primary-100, success-700, etc)
