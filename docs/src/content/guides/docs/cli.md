---
title: CLI & generators
description: Build-time generation for component docs via the layerstack-docs CLI.
order: 5
---

`@layerstack/docs` ships a `layerstack-docs` binary with build-time generators. Hand-authored
reference sites (like this one) don't need them; **generated** component-doc sites (like
[LayerChart](https://layerchart.com)) use them to produce API tables, example catalogs,
screenshots, StackBlitz bundles, and release notes.

## Wiring

Run cheap generators in `prebuild`; run heavy/committed artifacts (catalogs, screenshots)
manually.

```jsonc title="package.json"
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

## Commands

| Command                | Arguments                                                                                 | Generates                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `generate-api`         | `<components-dir> <output-dir>`                                                           | Per-component prop API JSON (via the TypeScript compiler)   |
| `generate-catalog`     | `<components-dir> <examples-dir> <catalog-dir>`                                           | Per-component example + cross-usage catalogs                |
| `generate-screenshots` | `<examples-dir> <screenshots-dir> [--base-url] [--route-base] [--all]`                    | Responsive light/dark WebP screenshots (Playwright + sharp) |
| `generate-stackblitz`  | `<source-dir> <output-file> [remote-sources-file] [--template-dir] [--source] [--remote]` | A StackBlitz/WebContainer file bundle                       |
| `generate-releases`    | `<owner/repo> <output-dir>`                                                               | GitHub releases → frontmatter markdown files                |

The output under `generated/api/*` and `generated/releases/*` is picked up automatically by
the `references`/`components`/`releases` collections.

:::note
`generate-stackblitz` uses the package's bundled template at `templates/stackblitz-template`
by default; pass `--template-dir` to override it.
:::
