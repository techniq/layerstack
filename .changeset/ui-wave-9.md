---
'@layerstack/ui': minor
---

feat: Port the select cluster — `SelectField`, `MenuButton`, `MenuField`, `MultiSelect`, `MultiSelectField`, `MultiSelectMenu`, `MultiSelectOption` — plus `DateRange`, `DateRangeField`, and `QuickSearch`.

Notable changes from Svelte UX:

- Every non-native event is now a callback prop: `onChange`, `onInputChange`, `onApply`, `onCancel`, `onClose`.
- `MultiSelect` tracks the last applied selection internally rather than through `dirtyStore`/`changeStore`, so `Apply` enables only when the staged selection actually differs.
- `SelectField` compares options by `value` rather than by reference. Reference comparison broke once `selected` became a bindable prop, since what is read back is a `$state` proxy of what was written, never the same object as the entry in `options`.
- `emptyDateRange` is now exported from the package root.
