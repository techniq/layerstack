---
description: Form wrapper with a draft copy, schema validation, and undo
category: state
related: [ui/TextField, ui/Button, svelte-state/FormState]
---

## Usage

```svelte
<script lang="ts">
  import { Button, Form, TextField } from '@layerstack/ui';
</script>

<Form initial={{ name: '' }} onChange={(value) => console.log(value)}>
  {#snippet children({ form })}
    <TextField label="Name" bind:value={form.draft.name} />
    <Button type="submit">Save</Button>
  {/snippet}
</Form>
```

`Form` holds a [`FormState`](/docs/svelte-state/FormState): edits go to `form.draft`, and nothing
outside the form sees them until a commit succeeds. Submitting commits, resetting reverts.

Without an `action`, the form never reaches the server — `method` stays undefined and submit is
prevented. Set `action` (and optionally `method`) to submit for real; validation still has to pass
first.

## Basic

Bind inputs straight to `form.draft`. `form.isDirty` and `form.canUndo` drive the buttons.

:example{name="basic" showCode}

## Validation

`schema` accepts any zod-compatible schema. A failed `commit()` populates `form.errors`, keyed by
the schema's issue paths, and leaves `form.state` untouched.

:example{name="validation"}

## Bringing your own state

Pass a `FormState` you own when the value needs to be read or driven from outside the form.

:example{name="own-state"}

## Snippet context

The `children` snippet receives `{ form }`:

| Member             | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `form.draft`       | Deeply reactive working copy — bind inputs to this       |
| `form.state`       | Last committed value                                     |
| `form.errors`      | Validation messages from the last failed commit          |
| `form.isDirty`     | Whether the draft differs from `state`                   |
| `form.canUndo`     | Whether there is a commit to undo                        |
| `form.commit()`    | Validate and promote the draft; returns `false` on error |
| `form.revert()`    | Discard the draft                                        |
| `form.revertAll()` | Discard the draft and every commit                       |
| `form.undo()`      | Restore the value from before the last commit            |
