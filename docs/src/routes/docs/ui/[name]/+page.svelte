<script lang="ts">
  import { examples } from '@layerstack/docs/context';
  import { RelatedLink } from '@layerstack/docs/components';
  import type { ComponentAPI } from '@layerstack/docs/api';
  import { page } from '$app/state';

  import OpenWithButton from '$lib/components/OpenWithButton.svelte';

  import IconChevronRight from '~icons/lucide/chevron-right';
  import IconFilePen from '~icons/lucide/file-pen';

  let { data } = $props();

  const metadata = $derived(data.metadata);
  const PageComponent = $derived(data.PageComponent);

  // One API table per entry — a single component normally, or each part of a compound component
  // (e.g. `Tooltip.Root`, `Tooltip.Item`) when listed via the `components` frontmatter.
  type ApiEntry = ComponentAPI & { label: string };
  const apis = $derived(((metadata as { apis?: ApiEntry[] }).apis ?? []) as ApiEntry[]);

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
    <span class="text-xs font-bold text-primary">ui</span>
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

  {#if apis.length}
    <h2 id="api-reference" class="text-2xl font-semibold mt-8 mb-1">API Reference</h2>

    {#each apis as entry (entry.component)}
      {#if apis.length > 1}
        <h3 id="api-{entry.component}" class="text-xl font-semibold mt-6 mb-1">{entry.label}</h3>
      {/if}

      <table class="w-full text-sm mt-1">
        <thead>
          <tr>
            <th class="border-b px-3 py-2 text-left text-surface-content/50">Property</th>
            <th class="border-b px-3 py-2 text-left text-surface-content/50">Description</th>
            <th class="border-b px-3 py-2 text-left text-surface-content/50">Type</th>
          </tr>
        </thead>
        <tbody>
          {#each entry.properties ?? [] as property (property.name)}
            <tr class="border-b last:border-b-0 align-top">
              <td class="px-3 py-4 font-medium whitespace-nowrap">
                {property.name}
                {#if property.required}
                  <span class="text-danger" title="required">*</span>
                {/if}
              </td>
              <td class="px-3 py-4 text-surface-content/80">
                {#if property.descriptionHtml}
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered from our own markdown -->
                  {@html property.descriptionHtml}
                {:else}
                  {property.description ?? ''}
                {/if}
              </td>
              <td class="px-3 py-4">
                <code class="text-xs text-primary break-words">{property.type}</code>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}
  {/if}

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
      href="https://github.com/techniq/layerstack/blob/main/docs/src/content/components/{metadata
        ._meta.filePath}"
      class="inline-flex items-center gap-1 text-sm text-surface-content/50 hover:text-surface-content"
      target="_blank"
    >
      <IconFilePen class="inline-block h-4 w-4" />
      Edit this page
    </a>
  </div>
</div>
