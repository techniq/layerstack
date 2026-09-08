<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { PaginationState } from '@layerstack/svelte-state';

  export type PaginationShowComponent =
    | 'prevPage'
    | 'nextPage'
    | 'firstPage'
    | 'lastPage'
    | 'pagination'
    | 'perPage'
    | 'actions';

  type PaginationOwnProps = {
    pagination: PaginationState;
    perPageOptions?: number[];
    /** Render nothing when there is only one page */
    hideSinglePage?: boolean;
    /** Summary text, ex. `1-10 of 43` */
    format?: (pagination: PaginationState) => string;
    /** Which controls to show, and in what order */
    show?: PaginationShowComponent[];
    class?: string;
    classes?: {
      root?: string;
      buttons?: string;
      pagination?: string;
      perPage?: string;
    };
    /** Rendered where `'actions'` appears in `show` */
    actions?: Snippet;
    /** Replaces the summary text */
    paginationSnippet?: Snippet<[{ pagination: PaginationState }]>;
  };

  export type PaginationProps = PaginationOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof PaginationOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import Tooltip from './Tooltip.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    pagination,
    perPageOptions = [10, 25, 50, 100, 1000],
    hideSinglePage = false,
    format = (p) =>
      `${Math.max(p.from, 0).toLocaleString()}-${p.to.toLocaleString()} of ${p.total.toLocaleString()}`,
    show = ['prevPage', 'pagination', 'nextPage'],
    class: className,
    classes = {},
    actions,
    paginationSnippet,
    ...restProps
  }: PaginationProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
  const settingsClasses = getComponentClasses('Pagination');

  let perPageOpen = $state(false);
</script>

{#if pagination.totalPages > 1 || !hideSinglePage}
  <div
    {...restProps}
    class={cls(
      'Pagination',
      'flex items-center gap-1',
      settingsClasses.root,
      classes.root,
      className
    )}
  >
    {#each show as component (component)}
      {#if component === 'actions'}
        {@render actions?.()}
      {:else if component === 'firstPage'}
        <Tooltip title="First page" offset={2}>
          <Button
            icon={icons.chevronFirst}
            onclick={pagination.firstPage}
            disabled={pagination.isFirst}
            aria-label="First Page"
            class={cls('p-2', settingsClasses.buttons, classes.buttons)}
          />
        </Tooltip>
      {:else if component === 'prevPage'}
        <Tooltip title="Previous page" offset={2}>
          <Button
            icon={icons.chevronLeft}
            onclick={pagination.prevPage}
            disabled={pagination.isFirst}
            aria-label="Previous Page"
            class={cls('p-2', settingsClasses.buttons, classes.buttons)}
          />
        </Tooltip>
      {:else if component === 'nextPage'}
        <Tooltip title="Next page" offset={2}>
          <Button
            icon={icons.chevronRight}
            onclick={pagination.nextPage}
            disabled={pagination.isLast}
            aria-label="Next Page"
            class={cls('p-2', settingsClasses.buttons, classes.buttons)}
          />
        </Tooltip>
      {:else if component === 'lastPage'}
        <Tooltip title="Last page" offset={2}>
          <Button
            icon={icons.chevronLast}
            onclick={pagination.lastPage}
            disabled={pagination.isLast}
            aria-label="Last Page"
            class={cls('p-2', settingsClasses.buttons, classes.buttons)}
          />
        </Tooltip>
      {:else if component === 'perPage'}
        <div class={cls('text-sm text-center', settingsClasses.perPage, classes.perPage)}>
          Per page:
          <span>
            <Button onclick={() => (perPageOpen = !perPageOpen)}>
              {pagination.perPage}
              <Icon data={icons.chevronDown} />
            </Button>

            <Menu bind:open={perPageOpen} autoPlacement offset={12} classes={{ menu: 'group p-1' }}>
              {#each perPageOptions ?? [] as option (option)}
                <MenuItem
                  class="justify-end"
                  selected={pagination.perPage === option}
                  onclick={() => (pagination.perPage = option)}
                >
                  {settings.format(option, 'integer')}
                </MenuItem>
              {/each}
            </Menu>
          </span>
        </div>
      {:else if component === 'pagination'}
        {#if paginationSnippet}
          {@render paginationSnippet({ pagination })}
        {:else}
          <div class={cls('text-sm tabular-nums', settingsClasses.pagination, classes.pagination)}>
            {format(pagination)}
          </div>
        {/if}
      {/if}
    {/each}
  </div>
{/if}
