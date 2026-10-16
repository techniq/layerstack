---
description: Modal dialog with a backdrop, focus management, and an actions footer
category: overlays
related: [ui/Backdrop, ui/Overlay, ui/Button]
---

## Usage

```svelte
<script lang="ts">
  import { Button, Dialog } from '@layerstack/ui';

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open</Button>

<Dialog bind:open>
  {#snippet title()}Confirm{/snippet}

  <div class="px-6 py-3">Are you sure?</div>

  {#snippet actions()}
    <Button>Cancel</Button>
    <Button variant="fill" color="primary">Confirm</Button>
  {/snippet}
</Dialog>
```

The dialog is portaled to `<body>`, takes focus when it opens, and restores focus to whatever was
focused before when it closes.

Every snippet receives `{ open, close }`, so content can dismiss the dialog itself.

## Basic

:example{name="basic" showCode}

## Actions

Clicking any button inside the `actions` snippet closes the dialog. A button can opt out by calling
`e.stopPropagation()`.

## Persistent

`persistent` ignores backdrop clicks and Escape. `onCloseAttempt` fires when a close is blocked,
and `close({ force: true })` overrides it.

:example{name="persistent"}

## Loading

:example{name="loading"}

## Callbacks

Svelte UX dispatched `open`, `close`, and `closeAttempt` events. These are now the `onOpen`,
`onClose`, and `onCloseAttempt` callback props. None of them fire on mount — only on an actual
transition.
