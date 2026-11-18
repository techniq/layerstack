---
description: Keyboard shortcut display with modifier key symbols
category: elements
related: [ui/QuickSearch]
---

## Usage

```svelte
<script lang="ts">
  import { Kbd } from '@layerstack/ui';
</script>

<Kbd command>K</Kbd>
```

Modifiers render in a fixed order (control, option, shift, command) regardless of prop order, each
wrapped in an `<abbr>` with a readable title.

## Basic

:example{name="basic" showCode}
