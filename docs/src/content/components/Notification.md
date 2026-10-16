---
description: Dismissible message with an icon, description, and actions
category: overlays
related: [ui/ErrorNotification, ui/Dialog]
---

## Usage

```svelte
<script lang="ts">
  import { Notification } from '@layerstack/ui';
</script>

<Notification
  title="Changes saved"
  description="Your profile has been updated."
  actions={{ Undo: undo, Dismiss: () => {} }}
/>
```

`actions` is a `{ label: handler }` map, so the common case needs no markup. Clicking any action
closes the notification — opt out with `e.stopPropagation()`.

`actionsPlacement` puts actions inline, below the text, or in a split column down the right edge.
`variant="fill"` colors the whole surface rather than just the icon.

`onClose` fires after the exit transition finishes, which is the right moment to remove it from a
queue.

## Basic

:example{name="basic" showCode}

## Content and actions

:example{name="variations"}

## Colors and variants

:example{name="colors"}
