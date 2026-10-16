---
description: Menu for switching the locale used by date and number formatting
category: app
related: [ui/Settings, utils/format]
---

## Usage

```svelte
<script lang="ts">
  import { LanguageSelect } from '@layerstack/ui';
</script>

<LanguageSelect />
```

Sets the locale on the app's [settings](/docs/ui/Settings), which drives every
[format preset](/docs/utils/format). Pass `languages` to offer a different set than the default
English/French demo pair.

## Basic

:example{name="basic" showCode}
