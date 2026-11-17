---
title: Setup
description: Wire up a new documentation site with @layerstack/docs.
order: 2
---

A docs app is a SvelteKit project that depends on `@layerstack/docs` and follows this shape:

```
docs-app/
  content-collections.ts        # createContentConfig({ packageName, repo })
  mdsx.config.js                # createMdsxConfig({ exampleComponentPath })
  svelte.config.js              # mdsx preprocessor + `content-collections` alias
  vite.config.js                # tailwind + sveltekit + contentCollections + Icons
  src/
    routes/
      app.css                   # tailwind + @layerstack/*/…css imports
      docs/[…]/+page.{ts,svelte}    # markdown renderers (+ llms.txt/+server.ts)
      api/search.json/+server.ts    # prerendered search index
    lib/
      content.ts                # createContentLoaders(...)
      examples.ts               # createGlobExampleLoaders(...)
    content/                    # *.md docs (reference/ | guides/ | …)
    examples/                   # *.svelte examples referenced from markdown
```

:::tip
The fastest path is to copy this site (`@layerstack/docs-site`) or
[LayerChart's docs](https://github.com/techniq/layerchart/tree/main/docs) and adjust.
:::

## Content collections

```ts title="content-collections.ts"
import { createContentConfig } from '@layerstack/docs/content-collections';

export default createContentConfig({
  packageName: 'layerstack',
  repo: 'techniq/layerstack',
  packagesRoot: '../packages', // used to infer source files
});
```

The factory defines all five collections with their schemas, slug/name derivation, TOC
extraction, and GitHub source-URL inference — you author zero schema logic.

## Markdown

```js title="mdsx.config.js"
import { createMdsxConfig } from '@layerstack/docs/markdown/config';

export const mdsxConfig = createMdsxConfig({
  markdownComponentsPath: '@layerstack/docs/markdown/components',
  exampleComponentPath: '$lib/components', // your local <Example> renderer
  liveCodeComponent: '@layerstack/docs/markdown/components/LiveCode.svelte',
});
```

## SvelteKit & Vite

```js title="svelte.config.js"
extensions: ['.svelte', '.md'],
preprocess: [mdsx(mdsxConfig), vitePreprocess()],
kit: {
  alias: {
    $examples: 'src/examples',
    // required so `import { allReferences } from 'content-collections'` resolves:
    'content-collections': './.content-collections/generated',
  },
},
```

```js title="vite.config.js"
plugins: [tailwindcss(), sveltekit(), contentCollections(), Icons({ compiler: 'svelte' })],
```

:::warning
`@layerstack/docs` is consumed from its built `dist/` (it relies on its `exports` map), so
**the framework must be built before the docs app builds.** Don't source-alias it.
:::

## Styles

```css title="app.css"
@import 'tailwindcss';
@import '@layerstack/tailwind/core.css';
@import '@layerstack/tailwind/utils.css';
@import '@layerstack/tailwind/themes/all.css';
@import '@layerstack/docs/styles.css';

/* Tailwind must scan the framework's compiled components: */
@source '../../node_modules/svelte-ux/dist';
@source '../../node_modules/@layerstack/docs/dist';

@plugin '@tailwindcss/typography';
```

## The `src/lib` glue

Two small files hand your `import.meta.glob` (which must live in your project root) to the
framework factories.

```ts title="src/lib/examples.ts"
import type { Component } from 'svelte';
import { createGlobExampleLoaders } from '@layerstack/docs/examples';

export const { loadExample, loadExamples, loadExampleByPath } = createGlobExampleLoaders({
  loadComponentExample: (type, component, name) =>
    import(`../examples/${type}/${component}/${name}.svelte`),
  loadRawExampleModule: (type, component, name) =>
    import(`../examples/${type}/${component}/${name}.svelte?raw`),
  pathExamples: import.meta.glob<{ default: Component }>([
    '/src/routes/**/*.svelte',
    '/src/content/**/*.svelte',
  ]),
  rawPathExamples: import.meta.glob<string>(
    ['/src/routes/**/*.svelte', '/src/content/**/*.svelte'],
    { query: '?raw', import: 'default' }
  ),
});
```

```ts title="src/lib/content.ts"
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

## Routes

The dynamic renderers, `llms.txt` endpoints, and `api/search.json` are boilerplate that
delegates to the framework — copy them from this site and adjust collection/slug shapes.
Build the search index with `buildSearchEntries` from `@layerstack/docs/search`, and add
`<Search />` + `<TableOfContents>` to your shell layout.

Next: [Authoring content](/docs/guides/docs/authoring).
