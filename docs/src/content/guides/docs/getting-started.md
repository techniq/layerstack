---
title: Getting started
description: What @layerstack/docs is, and how a documentation site fits together.
order: 1
---

`@layerstack/docs` is a reusable documentation framework. It turns a folder of markdown
and Svelte example files into a full documentation site — markdown rendering, content
collections, doc UI components, client-side search, `llms.txt` output, and a build-time
CLI — so each project only writes content and a thin layer of glue.

These very pages are built with it.

## What it provides

- **Markdown rendering** — a shared [mdsx](https://github.com/huntabyte/mdsx) config with
  GFM, MDC directives, Shiki syntax highlighting, automatic heading slugs, and styled
  element components.
- **Content collections** — a [content-collections](https://www.content-collections.dev/)
  factory that turns `src/content/**/*.md` into typed collections (`references`, `guides`,
  `components`, `utils`, `releases`) with TOC, source links, and generated data attached.
- **Doc UI components** — `Code`, `Search`, `TableOfContents`, `OpenWithButton`,
  `RelatedLink`, `ExampleScreenshot`, and more.
- **Search** — a FlexSearch index served from a prerendered `/api/search.json`, surfaced by
  the `Search` command palette (`⌘K`).
- **`llms.txt`** — helpers that emit LLM-friendly markdown endpoints.
- **CLI (`layerstack-docs`)** — generators for component API JSON, example catalogs,
  screenshots, StackBlitz bundles, and release notes.

## How it fits together

The framework owns the **mechanics**; your app owns the **content** and a small amount of
**glue** (mostly because `import.meta.glob` must be evaluated in your project root).

| Responsibility                                                  | Owner          |
| --------------------------------------------------------------- | -------------- |
| Markdown/mdsx pipeline, content-collection schemas & transforms | **framework**  |
| Doc UI components, search, `llms.txt` assembly, CLI generators  | **framework**  |
| `content/**/*.md` + `examples/**/*.svelte` source               | **you**        |
| `import.meta.glob` wiring (`src/lib/content.ts`, `examples.ts`) | **you** (thin) |
| Routes, app shell, nav, theme                                   | **you**        |

## Two shapes of docs site

- **Hand-authored reference docs** — like LayerStack. Uses the `references` + `guides`
  collections; source files are inferred by convention; no generators.
- **Generated component docs** — like [LayerChart](https://layerchart.com). Uses
  `components`/`utils`/`guides` collections plus the CLI generators (API tables, example
  catalogs, screenshots, StackBlitz, releases).

## Next

- [Setup](/docs/guides/docs/setup) — wire up a new docs site.
- [Authoring content](/docs/guides/docs/authoring) — directory layout, frontmatter, examples.
- [Markdown & directives](/docs/guides/docs/markdown) — the rendering features, live.
- [CLI & generators](/docs/guides/docs/cli) — build-time generation for component docs.
