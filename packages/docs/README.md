# @layerstack/docs

Reusable documentation framework and tooling for LayerStack projects (LayerStack, LayerChart, svelte-ux, …).

It turns a folder of markdown + Svelte example files into a full documentation site — markdown rendering, content collections, doc UI components, client-side search, `llms.txt` output, and a build-time CLI — so each project only writes content and a thin layer of glue.

> **📚 Guides** — _getting started_, _setup_, _authoring_, _markdown & directives_, and the
> _CLI_ — are written **with** this framework and live at
> [`docs/src/content/guides/docs/`](https://github.com/techniq/layerstack/tree/main/docs/src/content/guides/docs)
> (rendered at `/docs/guides/docs`). Start there for the full walkthrough; this README is a
> quick orientation plus the export reference.

## What it provides

- **Markdown rendering** — a shared [mdsx](https://github.com/huntabyte/mdsx) config (`createMdsxConfig`) with GFM, [MDC directives](https://content.nuxt.com/docs/files/markdown#mdc-syntax), [Shiki](https://shiki.style/) highlighting (diff + line highlighting), heading slugs, and styled element components.
- **Content collections** — a [content-collections](https://www.content-collections.dev/) factory (`createContentConfig`) that turns `src/content/**/*.md` into typed collections (`references`, `guides`, `components`, `utils`, `releases`) with TOC, GitHub source links, and generated API/catalog data attached.
- **Doc UI components** — `Code`, `Search`, `TableOfContents`, `OpenWithButton`, `RelatedLink`, `ExampleScreenshot`, … (see [Export reference](#export-reference)).
- **Content & example loaders** — `createContentLoaders` / `createGlobExampleLoaders` wire a docs app's `import.meta.glob` to the framework.
- **Search** — a FlexSearch index (`buildSearchEntries` → `/api/search.json`) surfaced by the `Search` command palette (⌘K).
- **`llms.txt`** — helpers to emit LLM-friendly markdown endpoints.
- **CLI (`layerstack-docs`)** — generators for component API JSON, example catalogs, screenshots, StackBlitz bundles, and release notes.

## How it fits together

The framework owns the **mechanics**; the consumer owns the **content** and a small amount of **glue** (mostly because `import.meta.glob` must be evaluated in the consumer's project root).

| Responsibility                                                  | Owner                     |
| --------------------------------------------------------------- | ------------------------- |
| Markdown/mdsx pipeline, content-collection schemas & transforms | **framework**             |
| Doc UI components, search, `llms.txt` assembly, CLI generators  | **framework**             |
| `content/**/*.md` + `examples/**/*.svelte` source               | **you**                   |
| `import.meta.glob` wiring (`src/lib/content.ts`, `examples.ts`) | **you** (thin)            |
| Routes, app shell, nav, theme                                   | **you** (copy a consumer) |

Two common shapes: **hand-authored reference docs** (LayerStack — `references` + `guides`, no generators) and **generated component docs** (LayerChart — `components`/`utils`/`guides` plus the CLI generators).

## Quick start

Requires **Svelte 5** + **SvelteKit 2** and a **Tailwind v4** setup with [`@layerstack/tailwind`](../tailwind). A docs app wires up a handful of files — the
[Setup guide](https://github.com/techniq/layerstack/blob/main/docs/src/content/guides/docs/setup.md)
has the full walkthrough:

```ts
// content-collections.ts
export default createContentConfig({ packageName: 'layerstack', repo: 'techniq/layerstack' });
```

```js
// mdsx.config.js
export const mdsxConfig = createMdsxConfig({ exampleComponentPath: '$lib/components' });
```

- `svelte.config.js` — `.md` extension, the `mdsx` preprocessor, and a `content-collections` alias.
- `vite.config.js` — `tailwindcss()`, `sveltekit()`, `contentCollections()`, `Icons()`.
- `app.css` — import `@layerstack/tailwind/*` + `@layerstack/docs/styles.css`.
- `src/lib/{content,examples}.ts` — hand your `import.meta.glob` to `createContentLoaders` / `createGlobExampleLoaders`.
- Routes (`+page.ts`/`+page.svelte`, `llms.txt`, `api/search.json`) — boilerplate; copy a [reference consumer](#reference-consumers).

> `@layerstack/docs` is consumed from its built `dist/`, so **the framework must be built before a docs app builds.** Don't source-alias it.

## Export reference

Import from subpaths (e.g. `import { Code } from '@layerstack/docs/components'`).

**Runtime / browser**

| Subpath                | Key exports                                                                                                                                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.`                    | barrel of `api`, `catalog`, `collections`, `components`, `content`, `context`, `examples`, `markdown`, `page-transitions`, `project-stats`                                                                                                                                          |
| `/components`          | `Code`, `Json`, `Search`, `TableOfContents`, `OpenWithButton`, `ViewSourceButton`, `ExampleLink`, `ExampleListing`, `ComponentLink`, `RelatedLink`, `ExampleScreenshot`, `ImageLink`, `Tabs`, `Steps`, `Step`, `Blockquote`, `LoadingPlaceholder` (also via `/components/*.svelte`) |
| `/markdown/components` | markdown element components (`A`, `Code`, `H1`–`H4`, `P`, `Table`, …) + directive components (`Note`, `Tabs`, `Tab`, `Steps`, `Button`, `LiveCode`)                                                                                                                                 |
| `/content`             | `createContentLoaders`, `resolveExamplePath`, `extractExampleReferences`, `getFirstExampleName`                                                                                                                                                                                     |
| `/examples`            | `createGlobExampleLoaders`, `createExampleLoaders`, `cleanExampleSource`                                                                                                                                                                                                            |
| `/context`             | `examples` (runed context)                                                                                                                                                                                                                                                          |
| `/collections`         | `sortCollection`                                                                                                                                                                                                                                                                    |
| `/search`              | `initSearch`, `search`, `buildSearchEntries`, `extractHeadingContents`, type `SearchEntry`                                                                                                                                                                                          |
| `/utils`               | `stripIndent`                                                                                                                                                                                                                                                                       |
| `/page-transitions`    | `preparePageTransition`                                                                                                                                                                                                                                                             |
| `/project-stats`       | `getProjectStats`                                                                                                                                                                                                                                                                   |
| `/api`, `/catalog`     | type-only (`ComponentAPI`, `ComponentCatalog`, …)                                                                                                                                                                                                                                   |

**Build-time / Node**

| Subpath                      | Key exports                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/content-collections`       | `createContentConfig`, the five Zod schemas                                                                                                                                                                                       |
| `/markdown/config`           | `createMdsxConfig`, `prettyCodeOptions`, `remarkComponents`, `remarkLiveCode`, `rehypeCodeBlocks`, `shikiDiffTransformer`                                                                                                         |
| `/markdown`                  | `extractTocFromMarkdown`, `stripMarkdown`                                                                                                                                                                                         |
| `/markdown/rehype/live-code` | `remarkLiveCode`                                                                                                                                                                                                                  |
| `/llms`                      | `processMarkdownContent`, `inlineExampleDirectives`, `generateReferenceMarkdown`, `generateGuideMarkdown`, `linkListSection`, `groupBySlugSegment`, `generateApiTable`, `markdownResponse`, `trimCode`, `extractFrontmatterTitle` |
| `/node/*`                    | `writeComponentAPIs`, `writeExampleCatalogs`, `generateScreenshots`, `generateStackBlitzFiles`, `generateReleases` (the `layerstack-docs` CLI wraps these)                                                                        |
| `/styles.css`                | shipped CSS                                                                                                                                                                                                                       |

## Reference consumers

Two real apps exercise the framework — copy whichever shape matches your project:

- **LayerStack docs** (`docs/`, `@layerstack/docs-site`) — hand-authored **reference** docs across many small packages; no generators; `references` + `guides` collections.
- **LayerChart docs** (`layerchart/docs`) — **generated** component docs; uses all five `generate:*` CLI scripts, `components`/`utils`/`guides` collections, screenshots, StackBlitz playground, and releases.
