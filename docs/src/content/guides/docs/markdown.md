---
title: Markdown & directives
description: Syntax highlighting, callouts, tabs, steps, live code, and more — rendered live.
order: 4
---

Every page is markdown processed by the framework's [mdsx](https://github.com/huntabyte/mdsx)
pipeline: GFM, [MDC directives](https://content.nuxt.com/docs/files/markdown#mdc-syntax), and
[Shiki](https://shiki.style/) highlighting. Each feature below shows its source followed by
the rendered result.

## Code blocks

Supported meta: `title`, `live`, `diff`, `showLineNumbers`, and line highlighting like
`{2,5-7}`.

````md
```svelte
<script lang="ts">
  let { data } = $props();
</script>

<div>Hello</div>
```
````

```svelte
<script lang="ts">
  let { data } = $props();
</script>

<div>Hello</div>
```

### Line numbers

````md
```ts showLineNumbers
const items = await load();
const total = items.reduce((sum, d) => sum + d.value, 0);
const average = total / items.length;
```
````

```ts showLineNumbers
const items = await load();
const total = items.reduce((sum, d) => sum + d.value, 0);
const average = total / items.length;
```

### Diff

````md
```diff
- const label = 'old';
+ const label = 'new';
```
````

```diff
- const label = 'old';
+ const label = 'new';
```

### Line highlighting

````md
```ts {2,4}
const a = 1;
const b = 2; // highlighted
const c = 3;
const d = 4; // highlighted
```
````

```ts {2,4}
const a = 1;
const b = 2; // highlighted
const c = 3;
const d = 4; // highlighted
```

### Title

````md
```svelte title="+layout.svelte"
<slot />
```
````

```svelte title="+layout.svelte"
<slot />
```

### Live code

A ` ```svelte live ` block renders an interactive preview above its source.

````md
```svelte live title="Counter.svelte"
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>Clicked {count} times</button>
```
````

```svelte live title="Counter.svelte"
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>Clicked {count} times</button>
```

## Callouts

```md
:::note
A neutral aside.
:::
```

:::note
A neutral aside.
:::

:::tip
A helpful suggestion.
:::

:::warning
Something to be careful about.
:::

:::caution
This action cannot be undone.
:::

## Steps

````md
:::steps

## Install

```bash
pnpm add @layerstack/docs
```

## Configure

Wire up `content-collections.ts` and `mdsx.config.js`.

## Profit

Author markdown and you're done.
:::
````

:::steps

## Install

```bash
pnpm add @layerstack/docs
```

## Configure

Wire up `content-collections.ts` and `mdsx.config.js`.

## Profit

Author markdown and you're done.
:::

## Tabs

```md
:::tabs

::tab{label="npm" icon="simple-icons:npm"}
`npm i @layerstack/docs`
::

::tab{label="pnpm" icon="simple-icons:pnpm"}
`pnpm add @layerstack/docs`
::

:::
```

:::tabs

::tab{label="npm" icon="simple-icons:npm"}
`npm i @layerstack/docs`
::

::tab{label="pnpm" icon="simple-icons:pnpm"}
`pnpm add @layerstack/docs`
::

:::

## Icons

```md
A :icon{name="lucide:rocket" class="text-primary"} rocket and a
:icon{name="simple-icons:github"} GitHub logo, inline.
```

A :icon{name="lucide:rocket" class="text-primary"} rocket and a
:icon{name="simple-icons:github"} GitHub logo, inline.

## Tables

`:---` left-aligns, `---:` right-aligns, `:---:` centers.

```md
| First | Second | Third |
| :---- | :----: | ----: |
| 1     |   2    |     3 |
```

| First | Second | Third |
| :---- | :----: | ----: |
| 1     |   2    |     3 |

## Links

- On-domain links open in the same tab: [Setup](/docs/guides/docs/setup)
- External links open in a new tab with an arrow: [LayerStack](https://layerstack.dev)
- Hash links jump to a heading: [Back to top](#markdown--directives)
