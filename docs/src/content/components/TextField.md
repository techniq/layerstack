---
description: Text input with label, hint, error, icons, masking, and comparison operators
category: inputs
related: [ui/Field, ui/Input, ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { TextField } from '@layerstack/ui';

  let value = $state('');
</script>

<TextField label="Name" bind:value />
```

## Basic

:example{name="basic" showCode}

## Label placement

:example{name="label-placement"}

## Types

`type` selects both the underlying `input[type]` and its `inputmode`, and adds affordances —
a currency prefix, a percent suffix, or a reveal button for passwords.

:example{name="types"}

## States

:example{name="states"}

## Masking

`mask` formats input as it is typed. A partially entered value is cleared on blur so incomplete
entries never leak into `value`.

:example{name="mask"}

## Operators

With `operators`, the value becomes `{ [operator]: value }` — useful for filter UIs.

:example{name="operators"}

## Changes

Svelte UX dispatched a `change` event. It is now the `onChange` callback prop — custom
callbacks are camelCased, which keeps them distinct from the native `onchange` attribute (still
forwarded to the input):

```svelte
<TextField
  onChange={({ value, inputValue, operator }) => console.log(value)}
  debounceChange={300}
/>
```

`debounceChange` delays the callback (`true` uses `300ms`); `value` itself still updates
immediately, so `bind:value` stays responsive.

## Adornments

Four slots surround the input. `prefix`/`suffix` sit beside the text inside the border (a currency
symbol, a unit); `prepend`/`append` sit outside it, for buttons. `icon`/`iconRight` are shorthand
for the common single-icon case, and `clearable` adds a clear button to `append`.

:example{name="adornments"}

## Multiline

`multiline` renders a `<textarea>` that grows with its content. Give the input a fixed height
through `classes.input` to opt out.

:example{name="multiline"}

## Debounced changes

`debounceChange` delays `onChange` — `true` waits 300ms, a number sets the delay. Useful when the
handler triggers a request.

:example{name="debounce"}
