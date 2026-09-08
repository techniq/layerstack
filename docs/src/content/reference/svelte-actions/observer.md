---
title: observer
description: Actions for ResizeObserver, IntersectionObserver, and MutationObserver
related: [ui/InfiniteScroll, ui/Lazy]
status: deprecated
---

> **Deprecated** — replaced by [`@layerstack/svelte-attachments`](/docs/svelte-attachments).

## Usage

```js
import { resize, intersection, mutate } from '@layerstack/svelte-actions';
```

## use:resize

### Basic

:example{component="action-observer" name="basic" showCode}

### Full coordinates (using `getBoundingClientRect()`)

:example{component="action-observer" name="full-coordinates"}

### Setting CSS variable

:example{component="action-observer" name="setting-css-variable"}

## use:intersection

### Adding class when fully visible

:example{component="action-observer" name="adding-class-when-fully-visible"}

### Show header on scroll away

:example{component="action-observer" name="show-header-on-scroll-away"}

## use:mutate

> TODO
