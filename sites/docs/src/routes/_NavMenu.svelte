<script lang="ts">
  import { NavItem } from 'svelte-ux';
  import { allReferences, allGuides } from 'content-collections';
  import { sortCollection } from '@layerstack/docs/collections';

  import { page } from '$app/stores';
  import { mdiFormatListBulleted, mdiHome } from '@mdi/js';

  // Guides (drafts excluded), sorted
  const guides = sortCollection(allGuides.filter((g) => !g.draft));

  // Reference docs grouped by package (first slug segment), packages sorted
  // alphabetically and items sorted within each via `sortCollection`.
  const packages = (() => {
    const byPackage = new Map<string, typeof allReferences>();
    for (const ref of allReferences) {
      const pkg = ref.slug.split('/')[0];
      if (!byPackage.has(pkg)) byPackage.set(pkg, []);
      byPackage.get(pkg)!.push(ref);
    }
    return [...byPackage.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([pkg, refs]) => [pkg, sortCollection(refs)] as const);
  })();
</script>

<NavItem text="Introduction" icon={mdiHome} currentUrl={$page.url} path="/" />

<NavItem
  text="Changelog"
  icon={mdiFormatListBulleted}
  currentUrl={$page.url}
  path="https://github.com/techniq/layerstack/releases"
  target="_blank"
/>

{#if guides.length}
  <h1>Guides</h1>
  {#each guides as guide}
    <NavItem text={guide.name} currentUrl={$page.url} path="/docs/guides/{guide.slug}" />
  {/each}
{/if}

{#each packages as [pkg, refs]}
  <h1>{pkg}</h1>
  {#each refs as ref}
    <NavItem text={ref.name} currentUrl={$page.url} path="/docs/{ref.slug}" />
  {/each}
{/each}
