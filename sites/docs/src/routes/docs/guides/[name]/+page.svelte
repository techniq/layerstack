<script lang="ts">
  import { examples } from '@layerstack/docs/context';
  import { page } from '$app/state';

  import OpenWithButton from '$lib/components/OpenWithButton.svelte';

  import IconChevronRight from '~icons/lucide/chevron-right';
  import IconFilePen from '~icons/lucide/file-pen';

  let { data } = $props();

  const metadata = $derived(data.metadata);
  const PageComponent = $derived(data.PageComponent);

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
    <span class="text-xs font-bold text-primary">Guides</span>
  </div>

  <div class="text-2xl font-bold">{metadata.name}</div>

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
  {#key page.url.pathname}
    <PageComponent />
  {/key}

  <div class="mt-16 mb-4">
    <a
      href="https://github.com/techniq/layerstack/blob/main/sites/docs/src/content/guides/{metadata
        ._meta.filePath}"
      class="inline-flex items-center gap-1 text-sm text-surface-content/50 hover:text-surface-content"
      target="_blank"
    >
      <IconFilePen class="inline-block h-4 w-4" />
      Edit this page
    </a>
  </div>
</div>
