---
title: portal
description: Render component outside current DOM hierarchy
related: [ui/Dialog, ui/Drawer, ui/Backdrop]
---

## Usage

```js
import { portal } from '@layerstack/svelte-actions';
```

## Examples

### basic

:example{component="action-portal" name="basic" showCode}

### first/sibling `.PortalTarget`

:example{component="action-portal" name="first-sibling-portal-target"}

### ancestor `.PortalTarget`

:example{component="action-portal" name="ancestor-portal-target"}

### custom target

:example{component="action-portal" name="custom-target"}

### Destroyable

:example{component="action-portal" name="destroyable"}
