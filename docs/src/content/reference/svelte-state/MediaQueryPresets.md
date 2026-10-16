---
title: MediaQueryPresets
description: Presets to monitor media query matching, including screen width/height, orientation, print media, prefers dark/light scheme, and prefers reduced motion
---

## Usage

```svelte
<script>
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  const { mdScreen, print } = new MediaQueryPresets();
</script>

{#if mdScreen.current}
  <div>Only visible on 768px+ screens</div>
{/if}

{#if print.current}
  <div>Only visable when printing</div>
{/if}
```

## Examples

:example{name="basic" showCode}
