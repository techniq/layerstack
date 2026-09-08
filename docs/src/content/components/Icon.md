---
description: Render an icon from an SVG path, an icon component, a Font Awesome definition, inline SVG markup, or a remote SVG URL
category: elements
related: [svelte-attachments/input]
---

## Usage

```svelte
<script lang="ts">
  import { Icon } from '@layerstack/ui';
  import { mdiHome } from '@mdi/js';
</script>

<Icon data={mdiHome} />
```

`data` is deliberately permissive — it accepts whichever form your icon set provides:

| Value                         | Renders                                      |
| ----------------------------- | -------------------------------------------- |
| SVG path string               | `<svg>` with a single `<path>`               |
| Icon component                | the component, sized to match                |
| Font Awesome `IconDefinition` | `<svg>` with the definition's `viewBox`/path |
| Inline `<svg>` markup         | `<span>` wrapping the markup                 |
| URL                           | `<span>` wrapping the fetched markup         |

## Basic

:example{name="basic" showCode}

## Icon components

:example{name="component"}

## Sizing

`size` sets both `width` and `height` and defaults to `1.2em`, so icons scale with the surrounding
text. An explicit `width` or `height` overrides it.

:example{name="sizing"}

## Styling

`class` is merged onto the rendered element. For multi-path icons, `classes.path` accepts a single
class applied to every path, or an array applied per path.

:example{name="classes"}

## Accessibility

An icon with no `title` or `desc` is `role="presentation"` and hidden from assistive technology —
the right default for decorative icons next to a text label. Supplying `title` (and optionally
`desc`) switches it to `role="img"` and wires up `aria-labelledby`.

:example{name="accessibility"}

## Remote SVG

`svgUrl` (or a URL passed as `data`) fetches the markup and renders it inline. Requests are cached
and shared across every `Icon` instance, so the same URL is only fetched once.

```svelte
<Icon svgUrl="https://example.com/icon.svg" />
```
