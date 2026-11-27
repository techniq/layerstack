---
title: spotlight
description: Render a spotlight that follows the pointer behind an element
related: [ui/Shine, svelte-actions/mouse, svelte-actions/spotlight]
---

## Usage

```js
import { spotlight } from '@layerstack/svelte-attachments';
```

The spotlight is drawn on a `::before` pseudo-element with two radial gradients — one clipped to the
padding box for the surface, one to the border box for the border. Both are `fixed`, so they read
`--x` and `--y` as viewport coordinates. Set those once on a shared ancestor and a single listener
drives every spotlight below it.

## Self-contained styling

Nothing to import, and no CSS framework required. The gradients live on a `::before`, which cannot
be styled inline, so the attachment injects that one rule into the document the first time it runs
— once per document, via a constructable stylesheet, falling back to a `<style>` element.

It is deliberately not a Tailwind class. Tailwind only emits utilities it finds while **scanning
source files**, and a class a library adds from JavaScript is never scanned — custom `@utility`
definitions included. That is exactly how this attachment's predecessor broke when the docs moved to
Tailwind v4: every rule that drew the effect was missing from the output.

The injected rules sit in a `@layer` and their selectors are wrapped in `:where()`, so they carry
effectively no specificity and any rule you write wins — including one targeting the same
`::before`, which is worth knowing since an element has only one. `position` and `isolation` are set inline instead, and only when the element is
not already positioned, so an app that positions it itself is left alone.

The practical rule: an attachment may set inline styles freely, and may ship its own CSS, but must
never depend on a framework generating a class whose name only ever appears inside the library.

## Using global context and options

Each option is written to the element as a `--default-spotlight-*` custom property, with `hover`
values going to `--hover-spotlight-*`.

:example{component="attach-spotlight" name="global-context-and-options" showCode}

## Using global context and CSS variables

Setting `--spotlight-*` directly composes better with Tailwind's variants — `hover:` and `dark:`
work without the attachment knowing about them — and takes precedence over the options above.

:example{component="attach-spotlight" name="global-context-and-css-variables"}

## Line

A small radius with a fully opaque color stop reads as a moving line rather than a glow.

:example{component="attach-spotlight" name="line"}
