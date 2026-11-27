---
title: input
description: Input element actions — `autoFocus`, `autoHeight`, `blurOnEscape`, `selectOnFocus`, and `debounceEvent`
related: [ui/TextField, ui/Input]
status: deprecated
---

> **Deprecated** — replaced by [`input`](/docs/svelte-attachments/input) in [`@layerstack/svelte-attachments`](/docs/svelte-attachments).

## Usage

```js
import {
  autoFocus,
  autoHeight,
  blurOnEscape,
  selectOnFocus,
  debounceEvent,
} from '@layerstack/svelte-actions';
```

## autoFocus

Auto focus node when rendered

:example{component="action-input" name="auto-focus" showCode}

## selectOnFocus

Selects the text inside a text node when the node is focused

:example{component="action-input" name="select-on-focus"}

## blurOnEscape

Blurs the node when Escape is pressed

:example{component="action-input" name="blur-on-escape"}

## autoHeight

Automatically resize textarea based on content

:example{component="action-input" name="auto-height"}

## debounceEvent

Debounce any event (input, change, etc)

:example{component="action-input" name="debounce-event"}
