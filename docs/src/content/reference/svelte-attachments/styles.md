---
title: styles
description: Attachments to conveniently work with CSS styles
related: [svelte-attachments/dataBackground, svelte-actions/styles]
---

## Usage

```js
import { computedStyles, styleProps } from '@layerstack/svelte-attachments';
```

## computedStyles

Retrieve all computed styles for an element, and again whenever its `class` or `style` changes.
Useful to resolve CSS variable values or when working with `canvas`.

:example{component="attach-styles" name="computed-styles" showCode}

`getComputedStyle` returns a live object, and the same reference on every call, so assigning it
straight to `$state` will not register as a change. Snapshot the values you need instead — the
example above copies them into a plain object.

## styleProps

Set style properties from a single object, including custom properties.

:example{component="attach-styles" name="style-props"}

The attachment re-runs whenever the object changes, and its cleanup removes what the previous run
applied — so a property that disappears from the object is removed from the element, rather than
lingering. Properties set by anything else are left alone. `null` and `undefined` values are
skipped, and booleans are written as `1`/`0` so they can be fed to `calc()`.
