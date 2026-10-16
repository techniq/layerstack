---
title: DomTracker
description: Apply changes to an element with the ability to reverse them, for authoring attachments
related: [svelte-attachments/sticky, svelte-attachments/spotlight]
---

## Usage

```js
import { DomTracker } from '@layerstack/svelte-attachments';
```

A helper for writing attachments that touch the DOM in several places. Record each change as it is
applied and return `() => tracker.reset()` as the cleanup — only the changes made through the
tracker are reversed, so classes, styles, and attributes set by anything else survive.

```ts
import type { Attachment } from 'svelte/attachments';
import { DomTracker } from '@layerstack/svelte-attachments';

export function highlight(color: string): Attachment<HTMLElement> {
  return (node) => {
    const tracker = new DomTracker(node);

    tracker.addClass('ring-1');
    tracker.addStyle('--ring-color', color);
    tracker.addAttribute('data-highlighted', 'true');

    return () => tracker.reset();
  };
}
```

An attachment re-runs whenever the state it reads changes, and its cleanup runs first, so the
tracker is scoped to a single run — create it inside the attachment rather than outside.

## Methods

| Method                       | Reversed by `reset()` with          |
| ---------------------------- | ----------------------------------- |
| `addClass(...classNames)`    | `classList.remove`                  |
| `addStyle(property, value)`  | `style.removeProperty`              |
| `addAttribute(name, value)`  | `removeAttribute`                   |
| `addEventListener(type, fn)` | `removeEventListener`               |
| `addAttachment(attachment)`  | the cleanup the attachment returned |
| `addCleanup(fn)`             | `fn`                                |

`addAttachment` runs another attachment against the same node and folds its cleanup in, which is how
a composite attachment reuses `sticky`, `dataBackground`, and friends.
