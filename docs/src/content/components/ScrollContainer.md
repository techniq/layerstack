---
description: Scrollable region that hands its children a `scrollIntoView` helper
category: layout
related: [ui/Overflow, svelte-actions/scroll]
---

## Usage

```svelte
<script lang="ts">
  import { ScrollContainer } from '@layerstack/ui';
</script>

<ScrollContainer class="h-32 overflow-auto">
  {#snippet children({ scrollIntoView })}
    <button onclick={() => scrollIntoView({ block: 'center' })}>Scroll</button>
  {/snippet}
</ScrollContainer>
```

The helper is bound to the container element, so children can scroll it without a `bind:this`.

## Basic

:example{name="basic" showCode}
