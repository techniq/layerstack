---
title: dataBackground
description: Set background gradient based on data, similar to Excel.  Typically used within a table
related: [svelte-actions/dataBackground, svelte-table/actions]
---

## Usage

```js
import { dataBackground } from '@layerstack/svelte-attachments';
```

Unlike the [action](/docs/svelte-actions/dataBackground) it replaces, `dataBackground` takes a
getter function so it re-runs whenever the options it reads change:

```svelte
<td {@attach dataBackground(() => ({ value, domain }))}>{value}</td>
```

`tween` is read once when the attachment is created, so wrap the element in `{#key ...}` if you need
to change the tween options at runtime.

## Basic

:example{component="attach-dataBackground" name="basic" showCode}

## Tailwind gradient

When `color` is omitted, `--color-from` and `--color-to` fall back to Tailwind's gradient variables,
so gradient utility classes on the element drive the colors.

:example{component="attach-dataBackground" name="tailwind-gradient"}
