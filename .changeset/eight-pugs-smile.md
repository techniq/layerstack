---
'@layerstack/svelte-actions': patch
'@layerstack/svelte-state': patch
'@layerstack/svelte-stores': patch
'@layerstack/svelte-table': patch
---

fix(exports): Add a `default` condition to package exports so bundlers and runtimes that do not apply the `svelte` condition (plain rolldown, esbuild, Node) can resolve the package and its subpaths
