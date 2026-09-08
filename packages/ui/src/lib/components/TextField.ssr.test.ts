import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import TextField from './TextField.svelte';
import Field from './Field.svelte';
import Input from './Input.svelte';

describe('TextField (SSR)', () => {
  it('renders a labelled input', () => {
    const { body } = render(TextField, { props: { label: 'Name' } });

    expect(body).toContain('class="TextField');
    expect(body).toContain('<input');
    expect(body).toContain('Name');
    expect(body).toContain('role="group"');
  });

  it('renders a textarea when `multiline`', () => {
    const { body } = render(TextField, { props: { multiline: true } });

    expect(body).toContain('<textarea');
    expect(body).not.toContain('<input');
  });

  it('renders the initial value', () => {
    const { body } = render(TextField, { props: { value: 'hello' } });

    expect(body).toContain('hello');
  });

  it('renders the operator select', () => {
    const { body } = render(TextField, {
      props: { operators: [{ label: '>', value: 'gt' }] },
    });

    expect(body).toContain('<select');
    expect(body).toContain('value="gt"');
  });

  it('renders an error message', () => {
    const { body } = render(TextField, { props: { error: 'Required' } });

    expect(body).toContain('Required');
    expect(body).toContain('--color-danger');
  });

  it('renders a number input for numeric types', () => {
    const { body } = render(TextField, { props: { type: 'integer' } });

    expect(body).toContain('type="number"');
    expect(body).toContain('inputmode="numeric"');
  });
});

describe('Field (SSR)', () => {
  it('renders a labelled group', () => {
    const { body } = render(Field, { props: { label: 'Name', labelPlacement: 'top' } });

    expect(body).toContain('class="Field');
    expect(body).toContain('role="group"');
    expect(body).toContain('placement-top');
  });

  it('renders the value fallback without children', () => {
    const { body } = render(Field, { props: { value: 'fallback' } });

    expect(body).toContain('fallback');
  });

  it('renders a hint', () => {
    const { body } = render(Field, { props: { hint: 'Helpful' } });

    expect(body).toContain('Helpful');
  });
});

describe('Input (SSR)', () => {
  it('renders an input with the given value', () => {
    const { body } = render(Input, { props: { value: 'abc', name: 'field' } });

    expect(body).toContain('<input');
    expect(body).toContain('value="abc"');
    expect(body).toContain('name="field"');
  });

  it('uses the mask as the placeholder', () => {
    const { body } = render(Input, { props: { mask: '___-___' } });

    expect(body).toContain('placeholder="___-___"');
  });
});
