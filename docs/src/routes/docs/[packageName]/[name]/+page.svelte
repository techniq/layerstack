<script lang="ts">
  import { examples } from '@layerstack/docs/context';
  import { RelatedLink } from '@layerstack/docs/components';
  import { cls } from '@layerstack/tailwind';
  import { page } from '$app/state';

  import OpenWithButton from '$lib/components/OpenWithButton.svelte';

  import IconChevronRight from '~icons/lucide/chevron-right';
  import IconFilePen from '~icons/lucide/file-pen';

  let { data } = $props();

  const metadata = $derived(data.metadata);
  const PageComponent = $derived(data.PageComponent);

  // Provide loaded examples to <Example> components rendered within the markdown
  examples.set({
    get current() {
      return data.examples;
    },
  });
</script>

<div class="pb-4">
  <div class="flex items-center gap-1">
    <span class="text-xs font-bold text-surface-content/50 capitalize">Docs</span>
    <IconChevronRight class="text-surface-content/25 size-3" />
    <span class="text-xs font-bold text-primary">{page.params.packageName}</span>
  </div>

  <div class="text-2xl font-bold">
    {metadata.name}
    {#if metadata.status}
      <span
        class={cls(
          'text-sm px-2 rounded-sm align-middle',
          metadata.status === 'beta' && 'bg-yellow-500/20 text-yellow-800',
          metadata.status === 'deprecated' && 'bg-danger/20 text-danger-900'
        )}
      >
        {metadata.status}
      </span>
    {/if}
  </div>

  {#if metadata.description}
    <div class="text-sm text-surface-content/60 whitespace-pre-line">
      {metadata.description}
    </div>
  {/if}

  <div class="flex gap-2 mt-3">
    <OpenWithButton {metadata} />
  </div>
</div>

<div class="pb-4">
  {#if metadata.features?.length}
    <h2 id="features" class="text-2xl font-semibold mt-8 mb-1">Features</h2>
    <ul class="grid gap-1 list-disc pl-6 text-surface-content">
      {#each metadata.features as feature (feature)}
        <li>{@html feature}</li>
      {/each}
    </ul>
  {/if}

  {#key page.url.pathname}
    <PageComponent />
  {/key}

  {#if metadata.related?.length}
    <h2 id="related" class="text-2xl font-semibold mt-8 mb-1">Related</h2>
    <div class="flex flex-wrap gap-2 mt-2">
      {#each metadata.related as related (related)}
        <RelatedLink value={related} />
      {/each}
    </div>
  {/if}

  <div class="mt-16 mb-4">
    <a
      href="https://github.com/techniq/layerstack/blob/main/docs/src/content/reference/{metadata
        ._meta.filePath}"
      class="inline-flex items-center gap-1 text-sm text-surface-content/50 hover:text-surface-content"
      target="_blank"
    >
      <IconFilePen class="inline-block h-4 w-4" />
      Edit this page
    </a>
  </div>
</div>
