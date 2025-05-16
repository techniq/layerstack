<script lang="ts">
  import { NavItem } from 'svelte-ux';

  import { page } from '$app/stores';
  import { mdiFormatListBulleted, mdiHome } from '@mdi/js';

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
    'styles',
  ];

  const state = [
    'MediaQueryPresets',
    'PaginationState',
    'SelectionState',
    'TimerState',
    'UniqueState',
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

  const table = ['actions', 'stores'];
  const tailwind = ['utils'];
  const utils = ['duration', 'format', 'json', 'Logger', 'string'];
</script>

<NavItem text="Introduction" icon={mdiHome} currentUrl={$page.url} path="/" />

<NavItem
  text="Changelog"
  icon={mdiFormatListBulleted}
  currentUrl={$page.url}
  path="https://github.com/techniq/layerstack/releases"
  target="_blank"
/>

<h1>svelte-actions</h1>
{#each actions as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/svelte-actions/{item}" />
{/each}

<h1>svelte-state</h1>
{#each state as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/svelte-state/{item}" />
{/each}

<h1>svelte-stores</h1>
{#each stores as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/svelte-stores/{item}" />
{/each}

<h1>svelte-table</h1>
{#each table as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/svelte-table/{item}" />
{/each}

<h1>tailwind</h1>
{#each tailwind as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/tailwind/{item}" />
{/each}

<h1>utils</h1>
{#each utils as item}
  <NavItem text={item} currentUrl={$page.url} path="/docs/utils/{item}" />
{/each}
