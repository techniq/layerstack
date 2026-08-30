---
'@layerstack/ui': minor
---

feat: Migrate the theme, tab, step, timeline, and app-shell components — `AppBar`, `AppLayout`, `Drawer`, `LanguageSelect`, `ListItem`, `ResponsiveMenu`, `Settings`, `Step`, `Steps`, `Tab`, `Tabs`, `ThemeInit`, `ThemeSelect`, `ThemeSwitch`, `Timeline`, `TimelineEvent`, and `Tooltip`

`themeSet` is now the `onThemeSet` callback prop on `ThemeSelect`/`ThemeSwitch`, and `Drawer`'s `open`/`close`/`closeAttempt` events are the `onOpen`/`onClose`/`onCloseAttempt` props.
