# @layerstack/docs

Reusable documentation framework and tooling for LayerStack projects (LayerStack, LayerChart, svelte-ux, …).

It turns a folder of markdown + Svelte example files into a full documentation site — markdown rendering, content collections, doc UI components, client-side search, `llms.txt` output, and a build-time CLI — so each project only writes content and a thin layer of glue.

## Contents

- [What it provides](#what-it-provides)
- [How it fits together](#how-it-fits-together)
- [Prerequisites](#prerequisites)
- [Set up a new docs site](#set-up-a-new-docs-site)
  - [1. Dependencies](#1-dependencies)
  - [2. `content-collections.ts`](#2-content-collectionsts)
  - [3. `mdsx.config.js`](#3-mdsxconfigjs)
  - [4. `svelte.config.js`](#4-svelteconfigjs)
  - [5. `vite.config.js`](#5-viteconfigjs)
  - [6. `app.css`](#6-appcss)
  - [7. `src/lib` glue](#7-srclib-glue)
  - [8. Routes](#8-routes)
- [Authoring content](#authoring-content)
- [The `layerstack-docs` CLI](#the-layerstack-docs-cli)
- [Export reference](#export-reference)
- [Reference consumers](#reference-consumers)

## What it provides

- **Markdown rendering** — a shared [mdsx](https://github.com/huntabyte/mdsx) config (`createMdsxConfig`) with GFM, [MDC directives](https://content.nuxt.com/docs/files/markdown#mdc-syntax), [Shiki](https://shiki.style/) syntax highlighting (with diff + line highlighting), automatic heading slugs, and styled markdown element components.
- **Content collections** — a [`@content-collections`](https://www.content-collections.dev/) factory (`createContentConfig`) that turns `src/content/**/*.md` into typed collections (`components`, `utils`, `guides`, `references`, `releases`) with TOC, GitHub source links, and generated API/catalog data attached.
- **Doc UI components** — `Code`, `Json`, `Search`, `TableOfContents`, `ViewSourceButton`, `OpenWithButton`, `ExampleLink`, `ExampleListing`, `ComponentLink`, `RelatedLink`, `ExampleScreenshot`, `LoadingPlaceholder`, … (see [Export reference](#export-reference)).
- **Content & example loaders** — `createContentLoaders` / `createExampleLoaders` wire a docs app's `import.meta.glob` to the framework so `:example{}` directives and dynamic markdown pages resolve.
- **Search** — `initSearch` / `search` build a [FlexSearch](https://github.com/nextapps-de/flexsearch) index over a prerendered `/api/search.json`, surfaced by the `Search` command palette (⌘K).
- **`llms.txt`** — helpers (`processMarkdownContent`, `generateReferenceMarkdown`, `generateGuideMarkdown`, `markdownResponse`, …) to emit LLM-friendly markdown endpoints.
- **CLI (`layerstack-docs`)** — build-time generators for component API JSON, example catalogs, screenshots, StackBlitz bundles, and release notes.

## How it fits together

The framework owns the **mechanics**; the consumer owns the **content** and a small amount of **glue** (mostly because `import.meta.glob` must be evaluated in the consumer's project root).

| Responsibility                                                               | Owner                                                       |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Markdown/mdsx pipeline, content-collection schemas & transforms              | **framework** (`createMdsxConfig`, `createContentConfig`)   |
| Doc UI components, search engine, `llms.txt` string assembly, CLI generators | **framework**                                               |
| `content/**/*.md` + `examples/**/*.svelte` source                            | **consumer**                                                |
| `import.meta.glob` wiring (`src/lib/content.ts`, `examples.ts`)              | **consumer** (thin — calls framework factories)             |
| Routes (`+page.ts`/`+page.svelte` renderers, `llms.txt`, `api/search.json`)  | **consumer** (boilerplate — copy from a reference consumer) |
| App shell, nav menu, theme, analytics                                        | **consumer**                                                |

There are two common shapes of docs site:

- **Hand-authored reference docs** — e.g. LayerStack. Uses the `references` + `guides` collections; source files are inferred by convention; no generators.
- **Generated component docs** — e.g. LayerChart. Uses `components`/`utils`/`guides` collections plus the CLI generators (API tables, example catalogs, screenshots, StackBlitz, releases).

## Prerequisites

- **Svelte 5** and **SvelteKit 2** (peer dependencies).
- A **Tailwind v4** setup with [`@layerstack/tailwind`](../tailwind) (themes + utilities).
- The package is referenced as `workspace:*` inside this monorepo, or `link:`/the published `@layerstack/docs` cross-repo.

The framework bundles most of its own runtime dependencies (mdsx, shiki, content-collections core/markdown, svelte-ux, …). A consumer still installs the **build tooling it invokes directly** — see [Dependencies](#1-dependencies).

## Set up a new docs site

The shape of a docs app:

```
docs-app/
  content-collections.ts        # createContentConfig({ packageName, repo })
  mdsx.config.js                # createMdsxConfig({ exampleComponentPath })
  svelte.config.js              # mdsx preprocessor + `content-collections` alias
  vite.config.js                # tailwind + sveltekit + contentCollections + Icons
  src/
    routes/
      app.css                   # tailwind + @layerstack/*/…css imports
      +layout.svelte            # shell: <Search/>, <TableOfContents/>, nav
      docs/[…]/+page.{ts,svelte}    # markdown renderers (+ llms.txt/+server.ts)
      api/search.json/+server.ts    # prerendered search index
    lib/
      content.ts                # createContentLoaders(...)
      examples.ts               # createExampleLoaders(...)
      components/Example.svelte # renders :example{} directives
    content/                    # *.md docs (reference/ | components/ | utils/ | guides/)
    examples/                   # *.svelte examples referenced from markdown
  generated/                    # CLI output (api/, releases/) — generated sites only
```

The fastest path is to copy a [reference consumer](#reference-consumers) and adjust. The steps below explain each piece.

### 1. Dependencies

```jsonc
{
  "dependencies": {
    "@layerstack/docs": "workspace:*", // or "link:…" / a published version
    "@layerstack/tailwind": "workspace:*",
  },
  "devDependencies": {
    // build tooling the consumer's vite/svelte config invokes directly:
    "@content-collections/core": "…",
    "@content-collections/markdown": "…",
    "@content-collections/vite": "…",
    "mdsx": "…",
    "unplugin-icons": "…",
    "@iconify-json/lucide": "…",
    "@iconify-json/simple-icons": "…",
    "@tailwindcss/vite": "…",
    "@tailwindcss/typography": "…",
    "svelte-ux": "…",
  },
}
```

> The authoritative dependency set is whatever a working [reference consumer](#reference-consumers) declares — copy from there.

### 2. `content-collections.ts`

```ts
import { createContentConfig } from '@layerstack/docs/content-collections';

export default createContentConfig({
  packageName: 'layerstack',
  repo: 'techniq/layerstack',
  branch: 'main', // default: 'next'
  packagesRoot: '../packages', // default: '../packages' — used to infer source files
});
```

`createContentConfig` defines all five collections with their Zod schemas, slug/name derivation, TOC extraction, and GitHub source-URL inference. Options:

| Option               | Default                        | Purpose                                                  |
| -------------------- | ------------------------------ | -------------------------------------------------------- |
| `packageName`        | _(required)_                   | Used for source-link inference and defaults              |
| `repo`               | `` `techniq/${packageName}` `` | GitHub repo for source/edit links                        |
| `branch`             | `'next'`                       | Branch for source/edit links                             |
| `packagesRoot`       | `'../packages'`                | Path (from the docs app) to the monorepo `packages/` dir |
| `referenceDirectory` | `'src/content/reference'`      | Where `references` collection markdown lives             |

### 3. `mdsx.config.js`

```js
import { createMdsxConfig } from '@layerstack/docs/markdown/config';

export const mdsxConfig = createMdsxConfig({
  markdownComponentsPath: '@layerstack/docs/markdown/components',
  exampleComponentPath: '$lib/components', // your local <Example> renderer (and friends)
  liveCodeComponent: '@layerstack/docs/markdown/components/LiveCode.svelte',
});
```

`exampleComponentPath` points at your local components dir so `:example{}` directives render through your own `Example.svelte` chrome. The other two paths are the same for every consumer.

### 4. `svelte.config.js`

```js
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsx } from 'mdsx';
import { mdsxConfig } from './mdsx.config.js';

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.md'], // compile .md as components/routes
  preprocess: [mdsx(mdsxConfig), vitePreprocess()],
  kit: {
    adapter: adapter(),
    alias: {
      $examples: 'src/examples',
      // required virtual module so `import { allReferences } from 'content-collections'` resolves:
      'content-collections': './.content-collections/generated',
    },
  },
};
```

> `@layerstack/docs` is consumed from its built `dist/` (it relies on its `exports` map), so **the framework must be built before the docs app builds.** Don't source-alias it. (You _may_ source-alias the workspace libraries you're documenting for instant HMR — see the LayerStack `svelte.config.js`.)

### 5. `vite.config.js`

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import contentCollections from '@content-collections/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), contentCollections(), Icons({ compiler: 'svelte' })],
});
```

`contentCollections()` regenerates `.content-collections/generated` (the `content-collections` virtual module) on build/dev. `Icons({ compiler: 'svelte' })` powers the `~icons/*` imports the framework and MDC `:icon{}` directives use.

### 6. `app.css`

```css
@import 'tailwindcss';
@import '@layerstack/tailwind/core.css';
@import '@layerstack/tailwind/utils.css';
@import '@layerstack/tailwind/themes/all.css';
@import '@layerstack/docs/styles.css';

/* Tailwind must scan the framework's compiled components for class usage: */
@source '../../node_modules/svelte-ux/dist';
@source '../../node_modules/@layerstack/docs/dist';

@plugin '@tailwindcss/typography';
```

`@layerstack/docs/styles.css` provides Shiki theming, inline-code/code-block/diff/line-number styling, and the `.steps` numbering. The two `@source` lines are required because the framework is dist-resolved (Tailwind won't otherwise see its classes).

### 7. `src/lib` glue

These two files are the only real glue — they hand the consumer's `import.meta.glob` (which must be evaluated in the consumer root) to the framework factories. They're nearly identical across consumers; copy and adjust the collection names.

**`src/lib/examples.ts`**

```ts
import type { Component } from 'svelte';
import { createExampleLoaders } from '@layerstack/docs/examples';

const pathExamples = import.meta.glob<{ default: Component }>([
  '/src/routes/**/*.svelte',
  '/src/content/**/*.svelte',
]);
const rawPathExamples = import.meta.glob<string>(
  ['/src/routes/**/*.svelte', '/src/content/**/*.svelte'],
  { query: '?raw', import: 'default' }
);

export const { loadExample, loadExamples, loadExampleByPath } = createExampleLoaders({
  loadComponentExample: (type, component, name) =>
    import(`../examples/${type}/${component}/${name}.svelte`),
  loadRawExample: async (type, component, name) =>
    (await import(`../examples/${type}/${component}/${name}.svelte?raw`)).default as string,
  loadPathExample: (path) => pathExamples[path]?.(),
  loadRawPathExample: (path) => rawPathExamples[path]?.(),
});
```

**`src/lib/content.ts`**

```ts
import { error } from '@sveltejs/kit';
import { allReferences, allGuides, type Reference, type Guide } from 'content-collections';
import { createContentLoaders, type ContentType } from '@layerstack/docs/content';
import { loadExample, loadExampleByPath } from '$lib/examples.js';

type Metadata = Reference | Guide;

const modules = import.meta.glob<{ default: import('svelte').Component; metadata: Metadata }>(
  '/src/content/**/*.md'
);

export const { getMarkdownComponent, loadExamplesFromMarkdown } = createContentLoaders<Metadata>({
  modules,
  getMetadata: (slug, type: ContentType) =>
    type === 'guides'
      ? allGuides.find((g) => g.slug === slug)
      : allReferences.find((r) => r.slug === slug),
  loadExample,
  loadExampleByPath,
  notFound: () => error(404, 'Could not find the document.'),
});
```

You also provide a local **`src/lib/components/Example.svelte`** that the `:example{}` directive renders — it reads the `examples` context (`@layerstack/docs/context`), resolves a path with `resolveExamplePath` (`@layerstack/docs/content`), and shows the example + source via the framework `Code` component. Copy a reference consumer's.

### 8. Routes

The routes are boilerplate that delegates to the framework — copy them from a [reference consumer](#reference-consumers) and adjust collection/slug shapes. You need:

- **Markdown renderers** — dynamic routes (e.g. `docs/[packageName]/[name]/` and `docs/guides/[name]/`) whose `+page.ts` calls `getMarkdownComponent` + `loadExamplesFromMarkdown`, and whose `+page.svelte` sets the `examples` context (`@layerstack/docs/context`) and renders `<PageComponent />` plus title/related/edit-link chrome.
- **`llms.txt` endpoints** — `+server.ts` files returning `markdownResponse(generateReferenceMarkdown(...) | generateGuideMarkdown(...))`, plus a root `llms.txt` index and a `docs/llms.txt` full dump.
- **Search index** — `routes/api/search.json/+server.ts` with `export const prerender = true` returning the entries the `Search` component fetches. Build entries with `stripMarkdown` (`@layerstack/docs/markdown`) and the `SearchEntry` type (`@layerstack/docs/search`).
- **App shell** — a `+layout.svelte` with `<Search />`, `<TableOfContents items={page.data.metadata.toc} />`, and a nav menu (group collections with `sortCollection` from `@layerstack/docs/collections`). Optionally call `preparePageTransition()` (`@layerstack/docs/page-transitions`) for View-Transition navigation.

## Authoring content

### Directory layout

```
src/content/
  reference/<package>/<item>.md   # references collection (hand-authored)
  components/<Component>.md        # components collection (generated sites)
  utils/<util>.md                 # utils collection
  guides/<name>.md                # guides collection (nest in subdirs → categories)
src/examples/
  components/<item>/<name>.svelte # referenced by :example{name="…"}
  utils/<util>/<name>.svelte
```

### Frontmatter

Common fields (full schemas in [`content-collections/index.js`](src/lib/content-collections/index.js)):

```md
---
title: SelectionState # required (reference/guide); becomes `name`
description: Manage a set of selected items
category: State # optional grouping
related: # cross-links (slug, component, or URL)
  - svelte-state/UniqueState
  - https://example.com
order: 1 # optional manual sort
status: beta # optional badge (reference)
hideTableOfContents: false
---
```

`components`/`utils` collections add `layers`, `withinLayer`, `resize`; `references` add `features`, `kind`, `sourceFile`, `hideUsage`, `packageName`; `releases` are generated from GitHub.

### Source-file inference (reference collection)

A reference doc's source file is inferred from its path —
`src/content/reference/<package>/<item>.md` → `<packagesRoot>/<package>/src/lib/<item>.{ts,svelte.ts}`
(with a camelCase fallback: `Duration` → `duration.ts`, `SelectionState` → `selectionState.svelte.ts`). Add a `sourceFile:` frontmatter (relative to `packagesRoot`) only to override.

### MDC directives

Authored in markdown, rendered by the framework's markdown components:

```md
:example{name="basic" showCode} <!-- inline a Svelte example + its source -->

::note <!-- callout: note | tip | warning | caution -->
Heads up.
::

::steps

### First

### Second

::

:::tabs
::tab{label="npm"}
`npm i …`
::
::tab{label="pnpm"}
`pnpm add …`
::
:::

:icon{name="lucide:check"} :button{label="Label" href="/x" icon="lucide:arrow-right"}
```

### Live code blocks

A fenced ` ```svelte live ` block is written to disk and rendered as an interactive preview above its source (via `remarkLiveCode` → `<LiveCode>`):

````md
```svelte live
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>{count}</button>
```
````

## The `layerstack-docs` CLI

Build-time generators (bin → `dist/cli.js`). Wire them into `package.json` scripts; run heavy/committed artifacts (catalog, screenshots) manually and the rest in `prebuild`:

```jsonc
{
  "scripts": {
    "prebuild": "pnpm generate:api && pnpm generate:stackblitz && pnpm generate:releases",
    "generate:api": "layerstack-docs generate-api ../packages/<pkg>/src/lib/components generated/api",
    "generate:catalog": "layerstack-docs generate-catalog ../packages/<pkg>/src/lib/components src/examples/components src/examples/catalog",
    "generate:screenshots": "layerstack-docs generate-screenshots src/examples/components static/screenshots",
    "generate:stackblitz": "layerstack-docs generate-stackblitz src static/stackblitz-files.json [remote-sources.json]",
    "generate:releases": "layerstack-docs generate-releases techniq/<repo> generated/releases",
  },
}
```

| Command                | Args / flags                                                                                                        | Generates                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `generate-api`         | `<components-dir> <output-dir>`                                                                                     | Per-component prop API JSON (`<Component>.json` + `index.json`) via the TypeScript compiler     |
| `generate-catalog`     | `<components-dir> <examples-dir> <catalog-dir>`                                                                     | Per-component example + cross-usage catalogs                                                    |
| `generate-screenshots` | `<examples-dir> <screenshots-dir> [--base-url <url>] [--route-base <path>] [--all]`                                 | Responsive light/dark WebP screenshots (Playwright + sharp; checksum-skipped unless `--all`)    |
| `generate-stackblitz`  | `<source-dir> <output-file> [remote-sources-file] [--template-dir <dir>] [--source out=src …] [--remote out=src …]` | A StackBlitz/WebContainer file bundle (defaults to the bundled `templates/stackblitz-template`) |
| `generate-releases`    | `<owner/repo> <output-dir>`                                                                                         | GitHub releases → frontmatter markdown files                                                    |

The generated `generated/api/*` and `generated/releases/*` are picked up automatically by the `references`/`components`/`releases` collections.

## Export reference

Import from subpaths (e.g. `import { Code } from '@layerstack/docs/components'`).

**Runtime / browser**

| Subpath                | Key exports                                                                                                                                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.`                    | barrel of `api`, `catalog`, `collections`, `components`, `content`, `context`, `examples`, `markdown`, `page-transitions`, `project-stats`                                                                                                                                          |
| `/components`          | `Code`, `Json`, `Search`, `TableOfContents`, `OpenWithButton`, `ViewSourceButton`, `ExampleLink`, `ExampleListing`, `ComponentLink`, `RelatedLink`, `ExampleScreenshot`, `ImageLink`, `Tabs`, `Steps`, `Step`, `Blockquote`, `LoadingPlaceholder` (also via `/components/*.svelte`) |
| `/markdown/components` | markdown element components (`A`, `Code`, `H1`–`H4`, `P`, `Table`, …) + directive components (`Note`, `Tabs`, `Tab`, `Steps`, `Button`, `LiveCode`)                                                                                                                                 |
| `/content`             | `createContentLoaders`, `resolveExamplePath`, `extractExampleReferences`, `getFirstExampleName`                                                                                                                                                                                     |
| `/examples`            | `createExampleLoaders`, `cleanExampleSource`                                                                                                                                                                                                                                        |
| `/context`             | `examples` (runed context)                                                                                                                                                                                                                                                          |
| `/collections`         | `sortCollection`                                                                                                                                                                                                                                                                    |
| `/search`              | `initSearch`, `search`, type `SearchEntry`                                                                                                                                                                                                                                          |
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
| `/node/component-api`        | `writeComponentAPIs`, `extractComponentAPI`                                                                                                                                                                                       |
| `/node/example-catalog`      | `writeExampleCatalogs`                                                                                                                                                                                                            |
| `/node/screenshots`          | `generateScreenshots`                                                                                                                                                                                                             |
| `/node/stackblitz`           | `generateStackBlitzFiles`, `getDefaultStackBlitzTemplateDir`                                                                                                                                                                      |
| `/node/releases`             | `generateReleases`                                                                                                                                                                                                                |
| `/styles.css`                | shipped CSS                                                                                                                                                                                                                       |

## Reference consumers

Two real apps exercise the framework — copy whichever shape matches your project:

- **LayerStack docs** (`layerstack/docs`, `@layerstack/docs-site`) — hand-authored **reference** docs across many small packages; no generators; `references` + `guides` collections.
- **LayerChart docs** (`layerchart/docs`) — **generated** component docs; uses all five `generate:*` CLI scripts, `components`/`utils`/`guides` collections, screenshots, StackBlitz playground, and releases.
