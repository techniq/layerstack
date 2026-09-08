---
title: scroll
description: Scroll an element into view, and show where a scroll container can still scroll
related: [svelte-attachments/spotlight, svelte-actions/scroll]
---

## Usage

```js
import { scrollIntoView, scrollShadow, scrollFade } from '@layerstack/svelte-attachments';
```

## scrollIntoView

Smoothly scroll an element into the centre of view when `condition` becomes true.

:example{component="attach-scroll" name="scroll-into-view" showCode}

`onlyIfNeeded` skips the scroll when the element is already visible in its scroll parent, which
avoids yanking the view for something the user can already see. `delay` waits before scrolling.

## scrollShadow

Show an inset shadow on each edge the container can still scroll toward.

:example{component="attach-scroll" name="scroll-shadow"}

The same attachment covers horizontal scrolling — the shadows follow whichever axis overflows.

:example{component="attach-scroll" name="scroll-shadow-horizontal"}

Each edge takes its own `color`, `offset`, `blur`, `spread`, and `scrollRatio`. `scrollRatio` is
how many pixels of scrolling it takes to grow the shadow by one pixel, so it eases in over the
first few pixels rather than snapping to full strength.

The shadows are painted by a sticky `::after` so they sit over the content. A pseudo-element cannot
be styled inline, so the attachment injects that one rule itself rather than depending on a
stylesheet import or a CSS framework — see
[spotlight](/docs/svelte-attachments/spotlight#self-contained-styling) for why it is not a Tailwind
class.

`overflow` is only set when the element is not already scrollable, so an app that manages that
itself is left alone.

## scrollFade

Fade the content out at each scrollable edge instead, using a mask. This needs no injected rule at
all, since a mask can be set inline.

:example{component="attach-scroll" name="scroll-fade"}

`length` caps the fade and `scrollRatio` eases it in, matching `scrollShadow`.
