---
description: Numbered progress indicator for a multi-step flow
category: layout
related: [ui/Step, ui/Timeline]
---

## Usage

```svelte
<script lang="ts">
  import { Steps } from '@layerstack/ui';
</script>

<Steps data={[{ label: 'Cart', completed: true }, { label: 'Payment' }]} />
```

Points are numbered by a CSS counter, so no index bookkeeping is needed. `completed` colors a step
and the line leading up to it. `vertical` is passed to each [`Step`](/docs/ui/Step) through context.

## Basic

:example{name="basic" showCode}

## Points and icons

:example{name="points"}

## Vertical and colors

:example{name="vertical-and-colors"}
