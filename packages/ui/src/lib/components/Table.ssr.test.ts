import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import Table from './Table.svelte';

const columns = [
  { name: 'name', header: 'Name' },
  { name: 'value', header: 'Value' },
];
const data = [
  { name: 'Alice', value: 1 },
  { name: 'Bob', value: 2 },
];

describe('Table (SSR)', () => {
  it('renders headers and rows', () => {
    const { body } = render(Table, { props: { columns, data } });

    expect(body).toContain('class="Table');
    expect(body).toContain('<thead');
    expect(body).toContain('<tbody');
    expect(body).toContain('Name');
    expect(body).toContain('Alice');
    expect(body).toContain('Bob');
  });

  it('renders an empty body for null data', () => {
    const { body } = render(Table, { props: { columns, data: null } });

    expect(body).toContain('<tbody');
    expect(body).not.toContain('Alice');
  });

  it('applies column formatting', () => {
    const { body } = render(Table, {
      props: { columns: [{ name: 'value', format: (v: number) => `#${v}` }], data },
    });

    expect(body).toContain('#1');
  });
});
