<script lang="ts">
  import { NavItem } from 'svelte-ux';

  import { page } from '$app/stores';
  import { mdiCog, mdiFormatListBulleted, mdiHome, mdiPalette } from '@mdi/js';

  const actions = [
    'dataBackground',
    'input',
    'layout',
    'mouse',
    'multi',
    'observer',
    'popover',
    'portal',
    'scroll',
    'spotlight',
    'sticky',
    'styleProps',
    'table',
  ];

  const stores = [
    'changeStore',
    'debounceStore',
    'dirtyStore',
    'fetchStore',
    'formStore',
    'graphStore',
    'localStore',
    'mapStore',
    'matchMedia',
    'paginationStore',
    'promiseStore',
    'queryParamsStore',
    'selectionStore',
    'tableOrderStore',
    'timerStore',
    'uniqueStore',
  ];

  const utils = ['cls', 'duration', 'format', 'json', 'Logger', 'string'];
</script>

<NavItem text="Getting Started" icon={mdiHome} currentUrl={$page.url} path="/" />
<!-- <NavItem text="Changelog" icon={mdiFormatListBulleted} currentUrl={$page.url} path="/changelog" /> -->

<h1>svelte-actions</h1>
{#each actions as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/svelte-actions/{item}" />
{/each}

<h1>svelte-stores</h1>
{#each stores as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/svelte-stores/{item}" />
{/each}

<h1>utils</h1>
{#each utils as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/utils/{item}" />
{/each}
