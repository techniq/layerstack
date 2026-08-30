---
description: A single tab within a Tabs strip
category: navigation
related: [ui/Tabs]
---

## Usage

```svelte
<Tab selected onclick={select}>Label</Tab>
```

Normally rendered for you by [`Tabs`](/docs/ui/Tabs) from its `options`. Use it directly when tabs
need custom content — an icon, a badge, a close button.

`placement` must match the parent's so the selected tab's border opens toward the content.

## Examples

See [`Tabs`](/docs/ui/Tabs) for rendered examples.
