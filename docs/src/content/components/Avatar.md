---
description: Circular container for a user image, initials, or icon
category: elements
related: [ui/Icon, ui/Header]
---

## Usage

```svelte
<script lang="ts">
  import { Avatar } from '@layerstack/ui';
</script>

<Avatar class="bg-primary text-primary-content">AB</Avatar>
```

Children take precedence over `icon`. Use `size="unset"` to size it yourself.

## Basic

:example{name="basic" showCode}

## Sizes, colors, and icons

Colors are plain utility classes rather than a `color` prop, so any palette works.

:example{name="variations"}
