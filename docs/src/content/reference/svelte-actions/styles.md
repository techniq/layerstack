---
title: styles
description: Actions to conveniently work with CSS styles
---

## Usage

```js
import { computedStyles, styleProps } from '@layerstack/svelte-actions';
```

## computedStyles

Retrieve all computed styles for element. Useful to resolve CSS variable values or working with `canvas`.

:example{component="action-styles" name="computed-styles" showCode}

## styleProps

Reactively set style properties using a single object.

:example{component="action-styles" name="style-props"}
