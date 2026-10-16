---
title: FormState
description: Editable form state with a working draft, schema validation, and undo
related: [ui/Form, svelte-stores/formStore]
---

## Usage

```js
import { FormState } from '@layerstack/svelte-state';

const form = new FormState({ name: '', email: '' }, { schema });

form.draft; // deeply reactive working copy — bind inputs to this
form.state; // last committed value
form.errors; // validation messages from the last failed commit
form.isDirty; // draft differs from `state`
form.canUndo; // there is a commit to undo

form.commit(); // validate and promote the draft; `false` when validation failed
form.revert(); // discard the draft
form.revertAll(); // discard the draft and every commit
form.undo(); // restore the value from before the last commit
```

Replaces [`formStore`](/docs/svelte-stores/formStore) from `@layerstack/svelte-stores`. Because
`draft` is a `$state` proxy, `bind:value={form.draft.name}` is all that is needed — the immer draft
the store used was not reactive, which is why it also exposed `current` and `refresh()`.

Most consumers will reach for the [`Form`](/docs/ui/Form) component, which owns a `FormState` and
wires submit/reset to `commit()`/`revert()`.

## Validation

`schema` is typed structurally as anything with a zod-compatible `safeParse`, so the package
depends on no particular validation library:

```ts
type FormSchema<T> = {
  safeParse(
    value: unknown
  ):
    | { success: true; data: T }
    | { success: false; error: { issues: readonly { path: PropertyKey[]; message: string }[] } };
};
```

A failed `commit()` leaves `state` untouched, keeps the invalid draft so it can be corrected, and
fills `errors` — nested to mirror the issue paths, so `z.object({ address: z.object({ city }) })`
produces `errors.address.city`.

## Undo

Each successful `commit()` pushes the previous value onto a history capped by `historyLimit`
(100 by default). `undo()` pops it; `revertAll()` clears the history and restores the value the
state was constructed with.

Nothing is shared with the object passed to the constructor — editing the draft never writes
through to it.

## Basic

:example{name="basic" showCode}
