---
description: Conditionally wrap content in a component without duplicating it
category: utility
related: [ui/Card]
---

## Usage

```svelte
<script lang="ts">
  import { Maybe } from '@layerstack/ui';
</script>

<Maybe this={condition ? Card : null} title="Wrapped">
  <div>Always rendered</div>
</Maybe>
```

Avoids repeating children across both branches of an `{#if}`. Remaining props are forwarded to the
wrapper when there is one.

## Basic

:example{name="basic" showCode}
