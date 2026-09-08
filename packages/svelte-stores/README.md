# LayerStack svelte-stores

> [!WARNING] > **Deprecated** — use [`@layerstack/svelte-state`](https://www.npmjs.com/package/@layerstack/svelte-state) instead.
>
> Svelte 5 runes replace stores. Each store here has a state class equivalent, read through
> properties rather than a `$` prefix:
>
> ```diff
> - const pagination = paginationStore({ total: 100 });
> - {$pagination.page}
> + const pagination = new PaginationState({ total: 100 });
> + {pagination.page}
> ```
>
> `changeStore`, `dirtyStore`, and `mapStore` are dropped rather than replaced — `$effect`,
> `$derived`, and `SvelteMap` cover them directly. See the
> [migration guide](https://next.layerstack.dev/docs/svelte-state) for the full mapping.
>
> This package still ships, and receives fixes only.

![](https://img.shields.io/github/license/techniq/layerstack?style=flat)
[![](https://img.shields.io/github/actions/workflow/status/techniq/layerstack/ci.yml?style=flat)](https://github.com/techniq/layerstack/actions/workflows/ci.yml)

![](https://img.shields.io/github/license/layerstack?style=flat)
[![](https://dcbadge.vercel.app/api/server/697JhMPD3t?style=flat)](https://discord.gg/697JhMPD3t)

See also the companion libraries [LayerChart](https://layerchart.com) for a large collection of composable chart components to build a wide range of visualizations, and [Svelte UX](https://svelte-ux.techniq.dev/) for a collection of components to build highly interactive applications.
