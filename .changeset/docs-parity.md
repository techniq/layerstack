---
'@layerstack/docs-site': patch
---

docs: Close the concept gaps against the Svelte UX docs.

Every old component page was compared against the new one and the missing concepts were added —
around 130 new examples across ~55 components, consolidated so one example usually covers what used
to be several sections. Notable additions: `Progress` color/track/color-by-value, `Month`,
`MonthList`, and `YearList` selection and disabled-date shapes, `Steps` points and colors,
`Timeline` layouts, `TextField` adornments/multiline/debounce, `SelectField` states and non-string
option values, `MultiSelect` option variants and slots, `Drawer` placement and persistence,
`Selection` select-all/single/max, and the `Gooey`/`Shine`/`Tilt` effect parameters.

Also fixes five pre-existing type errors in `Table`, `TreeList`, `Popover`, and `Badge` examples.

Examples now collapse their source by default — only the first example on a page keeps `showCode`,
since it doubles as the "how do I use this" sample. The rest are one click away behind **Show code**.
