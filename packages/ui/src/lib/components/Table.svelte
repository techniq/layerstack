<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type {
    ColumnDef,
    getCellHeader,
    getCellValue,
    tableOrderStore,
  } from '@layerstack/svelte-table';

  type TableParts = {
    container?: string;
    wrapper?: string;
    table?: string;
    thead?: string;
    tbody?: string;
    tr?: string;
    th?: string;
    td?: string;
  };

  export type TableProps<TData> = {
    columns?: ColumnDef<TData>[];
    data?: TData[] | null;
    /** Ordering state from `tableOrderStore()`.  Enables the order indicator in headers */
    order?: ReturnType<typeof tableOrderStore>;
    class?: string;
    classes?: TableParts;
    styles?: TableParts;

    /** Called when a header cell is clicked.  Accepted directly by `tableOrderStore().onHeaderClick` */
    onHeaderClick?: (detail: { column: ColumnDef<TData> }) => void;
    /** Called when a body cell is clicked */
    onCellClick?: (detail: { column: ColumnDef<TData>; rowData: TData; rowIndex: number }) => void;

    /** Replaces the generated `<thead>` */
    headers?: Snippet<[{ headers: ColumnDef<TData>[][]; getCellHeader: typeof getCellHeader }]>;
    /**
     * Replaces the generated `<tbody>`.  Named `body` rather than Svelte UX's `data` slot, which
     * would collide with the `data` prop.
     */
    body?: Snippet<
      [
        {
          data: TData[] | null;
          columns: ColumnDef<TData>[];
          getCellValue: typeof getCellValue;
          getCellContent: (column: ColumnDef<TData>, rowData: TData, rowIndex: number) => any;
        },
      ]
    >;
    /** Rendered between the header and body (ex. a `<caption>` or `<colgroup>`) */
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;
</script>

<script lang="ts" generics="TData">
  import { fromAction } from 'svelte/attachments';
  import { cls } from '@layerstack/tailwind';
  import {
    tableCell,
    getCellValue as getCellValueUtil,
    getCellHeader as getCellHeaderUtil,
    getHeaders,
    getRowColumns,
  } from '@layerstack/svelte-table';

  import TableOrderIcon from './TableOrderIcon.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    columns = [],
    data = [],
    order,
    class: className,
    classes = {},
    styles = {},
    onHeaderClick,
    onCellClick,
    headers: headersSnippet,
    body,
    children,
    ...restProps
  }: TableProps<TData> = $props();

  const settingsClasses = getComponentClasses('Table');
  const settings = getSettings();

  const withCellClasses = (column: ColumnDef<TData>) => ({
    ...column,
    classes: {
      th: cls(settingsClasses.th, classes.th, column.classes?.th),
      td: cls(settingsClasses.td, classes.td, column.classes?.td),
    },
  });

  const headers = $derived(getHeaders(columns).map((row) => row.map(withCellClasses)));
  const rowColumns = $derived(getRowColumns(columns).map(withCellClasses));

  function getCellContent(column: ColumnDef<TData>, rowData: TData, rowIndex: number) {
    const value = getCellValueUtil(column, rowData, rowIndex);
    if (!column.format) return value;

    return typeof column.format === 'function'
      ? column.format(value, rowData, rowIndex)
      : // @ts-expect-error `format` is a preset name here
        settings.format(value, column.format);
  }
</script>

<div
  {...restProps}
  class={cls('Table', 'table-container', settingsClasses.container, classes.container, className)}
  style={styles.container}
>
  <div
    class={cls('table-wrapper', settingsClasses.wrapper, classes.wrapper)}
    style={styles.wrapper}
  >
    <table class={cls('w-full', settingsClasses.table, classes.table)} style={styles.table}>
      {#if headersSnippet}
        {@render headersSnippet({ headers, getCellHeader: getCellHeaderUtil })}
      {:else}
        <thead class={cls(settingsClasses.thead, classes.thead)} style={styles.thead}>
          {#each headers ?? [] as headerRow, rowIndex (rowIndex)}
            <tr class={cls(settingsClasses.tr, classes.tr)} style={styles.tr}>
              {#each headerRow ?? [] as column (column.name)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <th
                  class="column-{column.name}"
                  class:whitespace-nowrap={order}
                  style={styles.th}
                  onclick={() => onHeaderClick?.({ column })}
                  {@attach fromAction(tableCell, () => ({ column, order }))}
                >
                  {getCellHeaderUtil(column)}
                  {#if order}
                    <TableOrderIcon {order} {column} />
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
      {/if}

      {@render children?.()}

      {#if body}
        {@render body({
          data,
          columns: rowColumns,
          getCellValue: getCellValueUtil,
          getCellContent,
        })}
      {:else}
        <tbody class={cls(settingsClasses.tbody, classes.tbody)} style={styles.tbody}>
          {#each data ?? [] as rowData, rowIndex (rowIndex)}
            <tr class={cls(settingsClasses.tr, classes.tr)} style={styles.tr}>
              {#each rowColumns ?? [] as column (column.name)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <td
                  class="column-{column.name}"
                  style={styles.td}
                  onclick={() => onCellClick?.({ column, rowData, rowIndex })}
                  {@attach fromAction(tableCell, () => ({
                    column,
                    rowData,
                    rowIndex,
                    tableData: data,
                  }))}
                >
                  {#if column.html}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -- opted in via `column.html` -->
                    {@html getCellContent(column, rowData, rowIndex)}
                  {:else}
                    {getCellContent(column, rowData, rowIndex)}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      {/if}
    </table>
  </div>
</div>
