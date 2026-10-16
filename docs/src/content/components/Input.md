---
description: Bare input element with optional masking, without the surrounding field chrome
category: inputs
related: [ui/TextField, ui/Field, svelte-attachments/input]
---

## Usage

```svelte
<script lang="ts">
  import { Input } from '@layerstack/ui';

  let value = $state('');
</script>

<Input bind:value />
```

`Input` is the unstyled element used inside [`TextField`](/docs/ui/TextField). Reach for it when
you want the masking behavior without the label, hint, and error chrome.

## Basic

:example{name="basic" showCode}

## Masking

`mask` describes the shape of the value, `replace` lists the characters within it that act as
entry placeholders (`_` by default), and `accept` is the pattern of characters allowed in
(`\d` by default).

:example{name="mask"}

## Changes

`onChange` fires with the masked value on every keystroke. Custom callbacks are camelCased, so it
sits alongside — and is distinct from — the native `onchange` attribute, which is still forwarded
to the element (and fires on commit, per the DOM). Every other native handler is forwarded too.

## Mask types

A mask is a literal template — `_` (or whatever `replace` lists) marks the fillable positions and
every other character is punctuation the input inserts for you. `value` stays the formatted string;
strip the punctuation yourself if the server wants digits only.

`accept` is the lighter option: it filters characters as they are typed without imposing a shape.

:example{name="mask-types"}
