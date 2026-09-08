---
description: Error message with an optional details dialog for the stack trace
category: overlays
related: [ui/Notification, ui/Dialog]
---

## Usage

```svelte
<script lang="ts">
  import { ErrorNotification } from '@layerstack/ui';
</script>

<ErrorNotification
  title="Request failed"
  description="Could not save your changes."
  message={error.message}
  stackTrace={error.stack}
/>
```

A [`Notification`](/docs/ui/Notification) preset for errors — alert icon, danger coloring, and
newline-aware description. "View Details" appears only when there is a `message` or `stackTrace`,
and opens a [`Dialog`](/docs/ui/Dialog) without dismissing the notification behind it.

## Basic

:example{name="basic" showCode}
