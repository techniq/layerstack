<script lang="ts">
  import { slide } from 'svelte/transition';

  import { page } from '$app/state';
  import { examples } from '@layerstack/docs/context';
  import { resolveExamplePath, type ContentType } from '@layerstack/docs/content';
  import { Code } from '@layerstack/docs/components';
  import { cls } from '@layerstack/tailwind';

  let {
    component,
    name,
    path,
    showCode = false,
    showLineNumbers = false,
    highlight,
    contentType = 'reference',
    class: className,
  }: {
    component?: string;
    name?: string;
    path?: string;
    showCode?: boolean;
    showLineNumbers?: boolean;
    highlight?: string;
    contentType?: ContentType;
    class?: string;
  } = $props();

  const examplesCtx = examples.get();

  // For `:example{name="..."}` (no explicit component), default to the current route item.
  const resolvedComponent = $derived(component ?? (page.params.name as string | undefined));
  const resolvedPath = $derived(
    path ? resolveExamplePath(path, page.url.pathname, contentType) : undefined
  );

  const example = $derived.by(() => {
    const current = examplesCtx.current;
    if (resolvedPath) return current?.['__path__']?.[resolvedPath] ?? null;
    if (resolvedComponent && name) return current?.[resolvedComponent]?.[name] ?? null;
    return null;
  });

  let codeVisible = $state(showCode);
</script>

<div class={cls('Example my-4', className)}>
  {#if example}
    {@const ExampleComponent = example.component}
    <div class="rounded-sm border bg-surface-100">
      <div class="p-4">
        <ExampleComponent />
      </div>
    </div>

    {#if example.source}
      <button
        type="button"
        class="text-sm text-surface-content/70 hover:text-surface-content px-2 py-1"
        onclick={() => (codeVisible = !codeVisible)}
      >
        {codeVisible ? 'Hide' : 'Show'} code
      </button>

      {#if codeVisible}
        <div transition:slide>
          <Code source={example.source} language="svelte" {showLineNumbers} {highlight} />
        </div>
      {/if}
    {/if}
  {:else}
    <div class="rounded-sm border border-dashed p-4 text-sm text-surface-content/50">
      Example not found{name ? `: ${resolvedComponent}/${name}` : path ? `: ${path}` : ''}
    </div>
  {/if}
</div>
