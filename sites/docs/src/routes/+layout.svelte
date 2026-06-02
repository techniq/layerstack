<script lang="ts">
  import { onMount } from 'svelte';
  import posthog from 'posthog-js';
  import { mdiArrowTopRight, mdiGithub, mdiTwitter } from '@mdi/js';

  import { Button, Drawer, MenuButton, ThemeInit, ThemeSelect, Tooltip, settings } from 'svelte-ux';
  import { cls } from '@layerstack/tailwind';
  import { Search, TableOfContents } from '@layerstack/docs/components';

  import NavMenu from './_NavMenu.svelte';

  import { dev } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';

  import LucidePanelLeftOpen from '~icons/lucide/panel-left-open';
  import LucidePanelLeftClose from '~icons/lucide/panel-left-close';
  import LucideEllipsisVertical from '~icons/lucide/ellipsis-vertical';
  import LucideAlignLeft from '~icons/lucide/align-left';

  import '@fontsource-variable/inter';
  import './app.css';

  let { data, children } = $props();

  const discordPath =
    'M20.33 5.06C18.78 4.33 17.12 3.8 15.38 3.5 15.17 3.89 14.92 4.4 14.74 4.82 12.9 4.54 11.07 4.54 9.26 4.82 9.09 4.4 8.83 3.89 8.62 3.5 6.88 3.8 5.21 4.33 3.66 5.06 0.53 9.79-0.32 14.41 0.1 18.96 2.18 20.52 4.19 21.46 6.17 22.08 6.66 21.4 7.1 20.69 7.48 19.93 6.76 19.66 6.07 19.33 5.43 18.94 5.6 18.81 5.77 18.68 5.93 18.54 9.88 20.39 14.17 20.39 18.07 18.54 18.23 18.68 18.4 18.81 18.57 18.94 17.92 19.33 17.24 19.66 16.52 19.94 16.9 20.69 17.33 21.41 17.82 22.08 19.8 21.46 21.82 20.52 23.9 18.96 24.4 13.69 23.05 9.11 20.33 5.06ZM8.01 16.17C6.83 16.17 5.86 15.06 5.86 13.71 5.86 12.36 6.81 11.25 8.01 11.25 9.22 11.25 10.19 12.36 10.17 13.71 10.17 15.06 9.22 16.17 8.01 16.17ZM15.99 16.17C14.8 16.17 13.83 15.06 13.83 13.71 13.83 12.36 14.78 11.25 15.99 11.25 17.19 11.25 18.17 12.36 18.14 13.71 18.14 15.06 17.19 16.17 15.99 16.17Z';

  const baseGh = 'https://github.com/techniq/layerstack';
  let ghLink = $derived(data.pr_id ? `${baseGh}/pull/${data.pr_id}` : baseGh);
  let title = $derived(data.pr_id ? `🚧 (pr:${data.pr_id}) - LayerStack` : 'LayerStack');

  settings({
    components: {},
    // svelte-ignore state_referenced_locally
    themes: data.themes,
  });

  let showDrawer = $state(false);
  let showSidebar = $state(true);

  let currentPath = '';

  onMount(() => {
    // Delay adding `scroll-smooth` to `<html>` for a better refresh experience
    setTimeout(() => {
      document.documentElement.classList.add('scroll-smooth');
    }, 0);

    if (!dev) {
      const handleBeforeUnload = () => posthog.capture('$pageleave');
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });

  // PostHog page tracking
  $effect(() => {
    const path = page.url.pathname;
    if (dev) return;
    if (currentPath && currentPath !== path) {
      posthog.capture('$pageleave');
    }
    currentPath = path;
    posthog.capture('$pageview');
  });

  afterNavigate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
</script>

<svelte:head>
  <title>{title}</title>

  {#if page.url.origin.includes('https')}
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: 'a9bb144411004657989216361774b0e7' })}
    ></script>

    <script
      async
      defer
      src="https://us.umami.is/script.js"
      data-website-id="e2c58ad6-4f28-4429-aecc-746e2cdf7a90"
    ></script>
  {/if}
</svelte:head>

<!-- Set theme before anything renders (even when SSR is in use) -->
<ThemeInit />

<div class="absolute top-0 w-screen h-screen background-gradient pointer-events-none"></div>
<div
  class="absolute top-0 w-screen h-screen background-grid pointer-events-none mask-b-to-50% mask-x-from-50%"
></div>

<header
  class={cls(
    'sticky top-0 z-30 flex h-16 items-center border-b border-primary/10 px-4 py-2',
    'bg-radial from-black/0 from-[1px] to-surface-100/90 to-[1px] bg-size-[6px_6px] backdrop-blur-lg'
  )}
>
  <Button icon={LucidePanelLeftOpen} onclick={() => (showDrawer = true)} class="mr-2 lg:hidden" />

  <a href="/" class="flex items-center gap-3 text-xl font-bold lg:w-60"> LayerStack </a>

  <div class="grow text-end max-lg:ml-10 sm:text-start">
    <Search />
  </div>

  <div class="flex items-center gap-2">
    <Button
      href="https://www.layerchart.com"
      icon={{ data: mdiArrowTopRight, class: 'opacity-50' }}
      target="_blank"
      class="p-2 max-lg:hidden flex-row-reverse"
    >
      LayerChart
    </Button>

    <div class="flex items-center border-r border-surface-content/20 pr-2">
      <ThemeSelect keyboardShortcuts />
    </div>

    <div class="hidden md:flex">
      <Tooltip title="Discord" placement="left" offset={2}>
        <Button
          icon={discordPath}
          href="https://discord.gg/697JhMPD3t"
          class="p-2"
          target="_blank"
        />
      </Tooltip>

      <Tooltip title="Twitter / X" placement="left" offset={2}>
        <Button
          icon={mdiTwitter}
          href="https://twitter.com/techniq35"
          class="p-2"
          target="_blank"
        />
      </Tooltip>

      <Tooltip title="View repository" placement="left" offset={2}>
        <Button icon={mdiGithub} href={ghLink} class="p-2" target="_blank" />
      </Tooltip>
    </div>

    <MenuButton
      icon={LucideEllipsisVertical}
      menuIcon={null}
      iconOnly={true}
      options={[
        { label: 'LayerChart', value: 'https://www.layerchart.com', icon: mdiArrowTopRight },
        { label: 'Github', value: ghLink, icon: mdiGithub },
        { label: 'Discord', value: 'https://discord.gg/697JhMPD3t', icon: discordPath },
        { label: 'Twitter / X', value: 'https://twitter.com/techniq35', icon: mdiTwitter },
      ]}
      on:change={(e) => {
        window.open(e.detail.value, '_blank');
      }}
      class="inline-block md:hidden"
    >
      <span slot="selection" class="hidden"></span>
    </MenuButton>
  </div>
</header>

<div class="bg-surface-200 flex min-h-[calc(100vh-64px)]">
  <aside
    class={cls(
      'bg-surface-300/30 sticky top-16 hidden max-h-[calc(100dvh-64px)] border-r border-primary/10 transition-[width]',
      'lg:grid lg:grid-rows-[1fr_56px]',
      showSidebar ? 'w-62' : 'w-0'
    )}
  >
    <div class="overflow-auto" data-sveltekit-preserve-scroll>
      <NavMenu class="px-3 py-4" />
    </div>

    <div class="relative border-t border-primary/10">
      <Button
        onclick={() => (showSidebar = !showSidebar)}
        iconOnly
        class={cls(
          'absolute max-lg:hidden transition-[left] bottom-3',
          showSidebar ? 'left-50' : 'left-1'
        )}
      >
        {#if showSidebar}
          <LucidePanelLeftClose />
        {:else}
          <LucidePanelLeftOpen />
        {/if}
      </Button>
    </div>
  </aside>

  <Drawer
    bind:open={showDrawer}
    placement="left"
    class="bg-surface-200 w-60 border-r px-4 py-8"
    classes={{ backdrop: 'bg-surface-100/20 backdrop-blur-sm' }}
  >
    <NavMenu onItemClick={() => (showDrawer = false)} />
  </Drawer>

  <main class="flex-1 min-w-0 px-6 py-4 lg:px-20 lg:py-8">
    {@render children()}
  </main>

  <!-- Table of Contents -->
  {#if !page.data.metadata?.hideTableOfContents && page.data.metadata?.toc?.length}
    <div
      class="sticky top-16 hidden max-h-[calc(100dvh-64px)] w-70 overflow-auto py-5 pr-6 xl:block"
    >
      <div
        class="text-surface-content/50 flex items-center gap-2 pb-3 text-xs font-medium uppercase tracking-widest"
      >
        <LucideAlignLeft />
        On this page
      </div>
      {#key page.url}
        <TableOfContents items={page.data.metadata.toc} scrollOffset={184} />
      {/key}
    </div>
  {/if}
</div>
