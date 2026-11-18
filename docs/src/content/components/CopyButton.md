---
description: Button that copies a value to the clipboard and confirms it
category: utility
related: [ui/Button, ui/Code]
---

## Usage

```svelte
<script lang="ts">
  import { CopyButton } from '@layerstack/ui';
</script>

<CopyButton value="text to copy" />
```

`value` accepts a string, or a function evaluated at click time when the value is derived. A
[`Button`](/docs/ui/Button) underneath, so it takes every `Button` prop.

The confirmation clears after `messageDuration` (3s by default); `message={null}` disables it.

## Basic

:example{name="basic" showCode}

## Variations

All [`Button`](/docs/ui/Button) props pass through. `value` may be a function, which is called at
click time so the copied text can be computed then.

:example{name="variations"}
