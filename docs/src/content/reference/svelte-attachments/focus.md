---
title: focus
description: Move focus to an element when it is rendered, optionally restoring the previously focused element on removal
related: [svelte-attachments/input, svelte-actions/input]
---

## Usage

```js
import { focusMove } from '@layerstack/svelte-attachments';
```

`focusMove` sets `tabIndex = -1` on the node so any element (not just natively focusable ones) can
be focused programmatically, then focuses it. It is used by overlay components such as dialogs,
drawers, and menus.

## Basic

:example{component="attach-focus" name="focus-move" showCode}

## Restore focus and delay

`restoreFocus` returns focus to the previously active element when the node is removed. `delay`
waits before focusing, which is useful when several elements compete for focus on mount — see
`autoFocus` in [input](/docs/svelte-attachments/input), which defaults to a `5ms` delay for exactly
this reason.

:example{component="attach-focus" name="restore-focus"}
