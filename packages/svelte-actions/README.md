# LayerStack svelte-actions

> [!WARNING] > **Deprecated** — use [`@layerstack/svelte-attachments`](https://www.npmjs.com/package/@layerstack/svelte-attachments) instead.
>
> Svelte 5 [attachments](https://svelte.dev/docs/svelte/@attach) replace actions. Every action here
> has an attachment equivalent, taking its options up front rather than as a second argument:
>
> ```diff
> - <div use:sticky={{ top: true }}>
> + <div {@attach sticky({ top: true })}>
> ```
>
> `multi` is dropped rather than replaced — attachments compose natively. See the
> [migration guide](https://next.layerstack.dev/docs/svelte-attachments) for the full mapping.
>
> This package still ships so that `@layerstack/svelte-table` keeps working while it is migrated,
> and receives fixes only.

![](https://img.shields.io/github/license/techniq/layerstack?style=flat)
[![](https://img.shields.io/github/actions/workflow/status/techniq/layerstack/ci.yml?style=flat)](https://github.com/techniq/layerstack/actions/workflows/ci.yml)

![](https://img.shields.io/github/license/layerstack?style=flat)
[![](https://dcbadge.vercel.app/api/server/697JhMPD3t?style=flat)](https://discord.gg/697JhMPD3t)

See also the companion libraries [LayerChart](https://layerchart.com) for a large collection of composable chart components to build a wide range of visualizations, and [Svelte UX](https://svelte-ux.techniq.dev/) for a collection of components to build highly interactive applications.
