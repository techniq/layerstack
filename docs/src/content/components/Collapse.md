---
description: Show and hide content behind a trigger, individually or as an accordion
category: layout
related: [ui/ExpansionPanel, ui/Icon]
---

## Usage

```svelte
<script lang="ts">
  import { Collapse } from '@layerstack/ui';
</script>

<Collapse name="Section">Content</Collapse>
```

## Basic

:example{name="basic" showCode}

## Accordion

Binding a shared `group` across several `Collapse`s, each with its own `value`, keeps only one open
at a time. Clicking the open one closes it.

:example{name="accordion"}

## Callbacks

Svelte UX dispatched a `change` event; this is now `onChange`, which receives `{ open, name }` and
does not fire on mount.

## Customization

:example{name="customization"}
