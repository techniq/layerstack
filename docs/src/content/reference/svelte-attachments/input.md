---
title: input
description: Input element attachments — `autoFocus`, `autoHeight`, `blurOnEscape`, `selectOnFocus`, and `debounceEvent`
related: [svelte-attachments/focus, svelte-actions/input]
---

## Usage

```js
import {
  autoFocus,
  autoHeight,
  blurOnEscape,
  selectOnFocus,
  debounceEvent,
} from '@layerstack/svelte-attachments';
```

## autoFocus

Auto focus node when rendered

:example{component="attach-input" name="auto-focus" showCode}

## selectOnFocus

Selects the text inside a text node when the node is focused

:example{component="attach-input" name="select-on-focus"}

## blurOnEscape

Blurs the node when Escape is pressed

:example{component="attach-input" name="blur-on-escape"}

## autoHeight

Automatically resize textarea based on content

:example{component="attach-input" name="auto-height"}

## debounceEvent

Debounce any event (input, change, etc)

:example{component="attach-input" name="debounce-event"}
