---
description: Label, hint, error, and affordance wrapper for building custom form controls
category: inputs
related: [ui/TextField, ui/Input]
---

## Usage

```svelte
<script lang="ts">
  import { Field } from '@layerstack/ui';
</script>

<Field label="Custom control">
  {#snippet children({ id })}
    <input {id} />
  {/snippet}
</Field>
```

`Field` provides the chrome — label placement, hint/error text, prepend/append affordances, and
the clear button — around a control you supply. [`TextField`](/docs/ui/TextField) is the
text-input flavor built on the same layout.

The `children` snippet receives the generated `id` so the control can be associated with the
label.

## Basic

:example{name="basic" showCode}

## Snippets

`prepend` and `append` sit outside the input area; `prefix` and `suffix` sit inside it, next to
the value.

:example{name="snippets"}

## Clearable

:example{name="clearable"}

## Label placement

:example{name="label-placement"}

## Wrapping controls

`Field` supplies only the chrome — label, border, error, adornments — so any control can sit inside
it. The `children` snippet receives the generated `id` to associate with the label.

:example{name="controls"}
