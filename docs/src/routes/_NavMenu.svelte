<script lang="ts">
  import { NavItem, type IconProp } from 'svelte-ux';
  import { allReferences, allGuides } from 'content-collections';
  import { sortCollection } from '@layerstack/docs/collections';
  import { page } from '$app/state';
  import { cls } from '@layerstack/tailwind';

  import IconHome from '~icons/lucide/house';
  import IconList from '~icons/lucide/list';
  import IconGlobe from '~icons/lucide/globe';
  import IconZap from '~icons/lucide/zap';
  import IconActivity from '~icons/lucide/activity';
  import IconDatabase from '~icons/lucide/database';
  import IconTable from '~icons/lucide/table';
  import IconPalette from '~icons/lucide/palette';
  import IconParentheses from '~icons/lucide/parentheses';
  import IconPackage from '~icons/lucide/package';

  let { onItemClick, class: className }: { onItemClick?: () => void; class?: string } = $props();

  const guides = sortCollection(allGuides.filter((g) => !g.draft));

  // Group guides by sub-directory (top-level guides have no category, listed first)
  const guidesByCategory = (() => {
    const byCategory = new Map<string, typeof guides>();
    for (const guide of guides) {
      const category = guide.slug.includes('/') ? guide.slug.split('/')[0] : '';
      if (!byCategory.has(category)) byCategory.set(category, []);
      byCategory.get(category)!.push(guide);
    }
    return [...byCategory.entries()].sort(([a], [b]) => (a ? 1 : 0) - (b ? 1 : 0));
  })();

  const packageIcons: Record<string, typeof IconHome> = {
    'svelte-actions': IconZap,
    'svelte-state': IconActivity,
    'svelte-stores': IconDatabase,
    'svelte-table': IconTable,
    tailwind: IconPalette,
    utils: IconParentheses,
  };

  // Reference docs grouped by package (first slug segment), sorted within each
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

<nav class={cls('grid gap-6', className)}>
  <section class="border-l border-surface-content/10">
    {@render navItem({ label: 'Introduction', path: '/', icon: IconHome })}
    {@render navItem({
      label: 'Changelog',
      path: 'https://github.com/techniq/layerstack/releases',
      icon: IconList,
    })}
  </section>

  {#if guides.length}
    <section>
      <h2 class="flex gap-2 items-center mb-4 text-base font-semibold">
        <IconGlobe class="size-4 text-surface-content/70" /> Guides
      </h2>
      {#each guidesByCategory as [category, items] (category)}
        {#if category}
          <div class="ml-2 mb-6 last:mb-0">
            <h3 class="text-surface-content/80 mb-3 text-sm font-medium capitalize">{category}</h3>
            <div class="border-l border-surface-content/10">
              {#each items as guide (guide.slug)}
                {@render navItem({ label: guide.name, path: `/docs/guides/${guide.slug}` })}
              {/each}
            </div>
          </div>
        {:else}
          <div class="ml-2 border-l border-surface-content/10 mb-6 last:mb-0">
            {#each items as guide (guide.slug)}
              {@render navItem({ label: guide.name, path: `/docs/guides/${guide.slug}` })}
            {/each}
          </div>
        {/if}
      {/each}
    </section>
  {/if}

  {#each packages as [pkg, refs] (pkg)}
    {@const PkgIcon = packageIcons[pkg] ?? IconPackage}
    <section>
      <h2 class="flex gap-2 items-center mb-4 text-base font-semibold">
        <PkgIcon class="size-4 text-surface-content/70" />
        {pkg}
      </h2>
      <div class="ml-2 border-l border-surface-content/10">
        {#each refs as ref (ref.slug)}
          {@render navItem({ label: ref.name, path: `/docs/${ref.slug}` })}
        {/each}
      </div>
    </section>
  {/each}
</nav>

{#snippet navItem({ label, path, icon }: { label: string; path: string; icon?: IconProp })}
  <NavItem
    text={label}
    currentUrl={page.url}
    target={path.startsWith('http') ? '_blank' : undefined}
    {path}
    {icon}
    classes={{
      root: cls(
        'relative text-sm text-surface-content/50 py-1 my-px rounded-r border-l border-transparent border-surface-content/5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary-600 -ml-px',
        icon ? 'pl-3' : 'pl-6'
      ),
      active: cls(
        'text-primary-400! border-primary! hover:bg-primary/10! font-medium bg-primary/10 border-l'
      ),
    }}
    on:click={() => onItemClick?.()}
  />
{/snippet}
