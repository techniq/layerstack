---
title: Authoring content
description: Directory layout, frontmatter, source inference, and examples.
order: 3
---

Docs are plain markdown under `src/content/`, with live Svelte examples under
`src/examples/`. Adding a page is usually just dropping in a `.md` file — the nav, table of
contents, search index, and edit link all derive from it automatically.

## Directory layout

```
src/content/
  reference/<package>/<item>.md   # references collection (hand-authored)
  guides/<name>.md                # guides — nest in subdirs to form categories
src/examples/
  components/<item>/<name>.svelte # referenced by :example{name="…"}
```

This page lives at `src/content/guides/docs/authoring.md` — the `docs/` subdirectory becomes
the **Docs** category you see in the sidebar.

## Frontmatter

```md
---
title: SelectionState # required; becomes the page `name`
description: Manage a set of selected items
related: # cross-links (slug, or full URL)
  - svelte-state/UniqueState
order: 1 # optional manual sort within a group
status: beta # optional badge (reference)
hideTableOfContents: false
---
```

Guides accept `title`, `description`, `category`, `order`, `draft`. References add `related`,
`features`, `status`, `kind`, `sourceFile`, `hideUsage`, and more. Full schemas live in the
framework's `content-collections` config.

## Source-file inference (reference)

A reference doc's source file is inferred from its path —
`src/content/reference/<package>/<item>.md` → `<packagesRoot>/<package>/src/lib/<item>.{ts,svelte.ts}`
(with a camelCase fallback: `Duration` → `duration.ts`, `SelectionState` →
`selectionState.svelte.ts`). Add a `sourceFile:` frontmatter only to override.

## Examples

Reference a Svelte example from markdown with the `:example` directive:

```md
:example{name="basic" showCode}
```

Only the _first_ example on a page carries `showCode` — it doubles as the "here is how you use
this" sample. Every later example starts collapsed behind a **Show code** button, so the page reads
as a gallery rather than a wall of source.

The `name` resolves to `src/examples/components/<item>/<name>.svelte`. Supported props:
`name`, `component`, `path`, `showCode`, `highlight` (e.g. `"7"` or `"7-9"`), and `class`.
The example's `?raw` source powers both the show-code toggle and the inlined `llms.txt`
output.

:::note
For all the markdown rendering features — callouts, tabs, steps, code highlighting, live
code — see [Markdown & directives](/docs/guides/docs/markdown).
:::
