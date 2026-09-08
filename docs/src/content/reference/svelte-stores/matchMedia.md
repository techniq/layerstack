---
title: matchMedia
description: Store to monitor media query matching, including screen width/height, orientation, print media, prefers dark/light scheme, and prefers reduced motion
status: deprecated
---

> **Deprecated** — replaced by [`MediaQueryPresets`](/docs/svelte-state/MediaQueryPresets) in [`@layerstack/svelte-state`](/docs/svelte-state).

## Usage

The returned store is truthy while its media query matches, so it can be used directly in markup (`{#if $isLargeScreen}…{/if}`).

```svelte
<script>
  import { matchMedia } from '@layerstack/svelte-stores';
  const isLargeScreen = matchMedia('(min-width: 768px)');
</script>
```

Convenient width helper:

```svelte
<script>
  import { matchMediaWidth } from '@layerstack/svelte-stores';
  const isLargeScreen = matchMediaWidth(768);
</script>
```

Convenient presets (Tailwind defaults) — `smScreen`, `mdScreen`, `lgScreen`, `xlScreen`, `xxlScreen` — plus `screen`, `print`, `darkColorScheme`, and `motionReduce`:

```svelte
<script>
  import { mdScreen, print } from '@layerstack/svelte-stores';
</script>
```

## Example

:example{name="basic" showCode}
