import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Table from './Table.svelte';
import TableOrderHarness from './tests/TableOrderHarness.svelte';

type Row = { name: string; value: number };

const columns = [
  { name: 'name', header: 'Name' },
  { name: 'value', header: 'Value' },
];

const data: Row[] = [
  { name: 'Charlie', value: 3 },
  { name: 'Alice', value: 1 },
  { name: 'Bob', value: 2 },
];

const cellText = (container: HTMLElement, selector: string) =>
  [...container.querySelectorAll(selector)].map((el) => el.textContent?.trim());

describe('Table', () => {
  it('renders headers and rows', async () => {
    const { container } = render(Table, { columns, data });

    expect(cellText(container, 'thead th')).toEqual(['Name', 'Value']);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(cellText(container, 'tbody tr:first-child td')).toEqual(['Charlie', '3']);
  });

  it('renders an empty body for null data', async () => {
    const { container } = render(Table, { columns, data: null });

    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);
    expect(container.querySelectorAll('thead th')).toHaveLength(2);
  });

  it('adds a per-column class to cells', async () => {
    const { container } = render(Table, { columns, data });

    expect(container.querySelector('thead th')!.classList.contains('column-name')).toBe(true);
    expect(container.querySelector('tbody td')!.classList.contains('column-name')).toBe(true);
  });

  it('derives a header from the column name when none is given', async () => {
    const { container } = render(Table, { columns: [{ name: 'firstName' }], data: [] });

    // `getCellHeader` splits camelCase but does not capitalize
    expect(container.querySelector('thead th')!.textContent?.trim()).toBe('first Name');
  });

  describe('formatting', () => {
    it('applies a `format` function', async () => {
      const { container } = render(Table, {
        columns: [{ name: 'value', format: (v: number) => `#${v}` }],
        data,
      });

      expect(cellText(container, 'tbody td')).toEqual(['#3', '#1', '#2']);
    });

    it('resolves a nested `value` accessor', async () => {
      const { container } = render(Table, {
        columns: [{ name: 'total', value: (row: unknown) => (row as Row).value * 10 }],
        data,
      });

      expect(cellText(container, 'tbody td')).toEqual(['30', '10', '20']);
    });

    it('renders html when the column opts in', async () => {
      const { container } = render(Table, {
        columns: [{ name: 'name', html: true, format: (v: string) => `<em>${v}</em>` }],
        data: [data[0]],
      });

      expect(container.querySelector('tbody td em')).not.toBeNull();
    });
  });

  describe('callbacks', () => {
    it('calls `onHeaderClick` with the column', async () => {
      const onHeaderClick = vi.fn();
      const { container } = render(Table, { columns, data, onHeaderClick });

      (container.querySelectorAll('thead th')[1] as HTMLElement).click();

      expect(onHeaderClick).toHaveBeenCalledWith(
        expect.objectContaining({ column: expect.objectContaining({ name: 'value' }) })
      );
    });

    it('calls `onCellClick` with the column, row, and index', async () => {
      const onCellClick = vi.fn();
      const { container } = render(Table, { columns, data, onCellClick });

      (container.querySelectorAll('tbody tr')[1].querySelector('td') as HTMLElement).click();

      expect(onCellClick).toHaveBeenCalledWith(
        expect.objectContaining({
          column: expect.objectContaining({ name: 'name' }),
          rowData: data[1],
          rowIndex: 1,
        })
      );
    });
  });

  describe('ordering', () => {
    it('sorts when a header is clicked and shows the indicator', async () => {
      const { container } = render(TableOrderHarness, { columns, data });

      expect(container.querySelector('.TableOrderIcon')).toBeNull();

      (container.querySelector('thead th') as HTMLElement).click();

      await vi.waitFor(() => {
        expect(cellText(container, 'tbody tr td:first-child')).toEqual(['Alice', 'Bob', 'Charlie']);
      });
      expect(container.querySelector('.TableOrderIcon')).not.toBeNull();
      expect(container.querySelector('[data-testid="order-state"]')!.textContent).toBe('name:asc');
    });

    it('reverses direction on a second click', async () => {
      const { container } = render(TableOrderHarness, { columns, data });

      const header = container.querySelector('thead th') as HTMLElement;
      header.click();
      await vi.waitFor(() =>
        expect(container.querySelector('[data-testid="order-state"]')!.textContent).toBe('name:asc')
      );

      header.click();
      await vi.waitFor(() => {
        expect(container.querySelector('[data-testid="order-state"]')!.textContent).toBe(
          'name:desc'
        );
        expect(cellText(container, 'tbody tr td:first-child')).toEqual(['Charlie', 'Bob', 'Alice']);
      });
    });
  });

  describe('classes and styles', () => {
    it('applies `classes` per part', async () => {
      const { container } = render(Table, {
        columns,
        data,
        classes: {
          container: 'container-c',
          wrapper: 'wrapper-c',
          table: 'table-c',
          thead: 'thead-c',
          tbody: 'tbody-c',
          tr: 'tr-c',
          th: 'th-c',
          td: 'td-c',
        },
      });

      expect(container.querySelector('.Table')!.classList.contains('container-c')).toBe(true);
      expect(container.querySelector('.table-wrapper')!.classList.contains('wrapper-c')).toBe(true);
      expect(container.querySelector('table')!.classList.contains('table-c')).toBe(true);
      expect(container.querySelector('thead')!.classList.contains('thead-c')).toBe(true);
      expect(container.querySelector('tbody')!.classList.contains('tbody-c')).toBe(true);
      expect(container.querySelector('thead tr')!.classList.contains('tr-c')).toBe(true);
      // `th`/`td` classes are applied by the `tableCell` attachment
      expect(container.querySelector('thead th')!.classList.contains('th-c')).toBe(true);
      expect(container.querySelector('tbody td')!.classList.contains('td-c')).toBe(true);
    });

    it('applies `styles` per part', async () => {
      const { container } = render(Table, {
        columns,
        data,
        styles: { container: 'color: red;', table: 'color: blue;' },
      });

      expect((container.querySelector('.Table') as HTMLElement).style.color).toBe('red');
      expect((container.querySelector('table') as HTMLElement).style.color).toBe('blue');
    });
  });
});
