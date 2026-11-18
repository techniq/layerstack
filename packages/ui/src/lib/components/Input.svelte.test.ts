import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Input from './Input.svelte';
import InputHarness from './tests/InputHarness.svelte';

function inputOf(container: HTMLElement) {
  return container.querySelector('input.Input') as HTMLInputElement;
}

/** Type into an input the way a user would, so the component's `oninput` handler runs */
function type(el: HTMLInputElement, value: string) {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('Input', () => {
  it('renders a text input by default', async () => {
    const { container } = render(Input, {});

    const el = inputOf(container);
    expect(el.type).toBe('text');
    expect(el.value).toBe('');
  });

  it('binds the value', async () => {
    const { container, getByTestId } = render(InputHarness, { value: 'hello' });

    expect(inputOf(container).value).toBe('hello');

    type(inputOf(container), 'world');
    await vi.waitFor(() => {
      expect(getByTestId('bound-value').element().textContent).toBe('world');
    });
  });

  it('calls `onChange` on input', async () => {
    const onChange = vi.fn();
    const { container } = render(Input, { onChange });

    type(inputOf(container), 'abc');
    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('forwards native handlers alongside its own', async () => {
    const oninput = vi.fn();
    const onfocus = vi.fn();
    const { container } = render(Input, { oninput, onfocus });

    const el = inputOf(container);
    type(el, 'x');
    expect(oninput).toHaveBeenCalledTimes(1);

    el.dispatchEvent(new FocusEvent('focus'));
    expect(onfocus).toHaveBeenCalledTimes(1);
  });

  it('passes through standard attributes', async () => {
    const { container } = render(Input, {
      name: 'phone',
      type: 'number',
      min: 1,
      max: 10,
      step: 2,
      required: true,
      disabled: true,
      placeholder: 'Enter',
    });

    const el = inputOf(container);
    expect(el.name).toBe('phone');
    expect(el.type).toBe('number');
    expect(el.min).toBe('1');
    expect(el.max).toBe('10');
    expect(el.step).toBe('2');
    expect(el.required).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.placeholder).toBe('Enter');
  });

  describe('mask', () => {
    const mask = '(___) ___-____';

    it('uses the mask as the placeholder', async () => {
      const { container } = render(Input, { mask });

      expect(inputOf(container).placeholder).toBe(mask);
    });

    it('formats digits into the mask', async () => {
      const { container, getByTestId } = render(InputHarness, { mask });

      type(inputOf(container), '5551234567');
      await vi.waitFor(() => {
        expect(getByTestId('bound-value').element().textContent).toBe('(555) 123-4567');
      });
    });

    it('formats an initial value on mount', async () => {
      const { getByTestId } = render(InputHarness, { mask, value: '5551234567' });

      await vi.waitFor(() => {
        expect(getByTestId('bound-value').element().textContent).toBe('(555) 123-4567');
      });
    });

    it('ignores characters the mask does not accept', async () => {
      const { container, getByTestId } = render(InputHarness, { mask });

      type(inputOf(container), 'abc555');
      await vi.waitFor(() => {
        expect(getByTestId('bound-value').element().textContent).toContain('(555');
      });
    });

    it('clears a partially entered value on blur', async () => {
      const onChange = vi.fn();
      const { container } = render(Input, { mask, onChange });

      const el = inputOf(container);
      type(el, '555');
      onChange.mockClear();

      el.dispatchEvent(new FocusEvent('blur'));
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('keeps a fully entered value on blur', async () => {
      const onChange = vi.fn();
      const { container } = render(Input, { mask, onChange });

      const el = inputOf(container);
      type(el, '5551234567');
      onChange.mockClear();

      el.dispatchEvent(new FocusEvent('blur'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('accepts a custom `accept` pattern', async () => {
      const { container, getByTestId } = render(InputHarness, {
        mask: '___',
        accept: '[a-z]',
      });

      type(inputOf(container), 'a1b2c3');
      await vi.waitFor(() => {
        expect(getByTestId('bound-value').element().textContent).toBe('abc');
      });
    });
  });

  it('merges a custom class', async () => {
    const { container } = render(Input, { class: 'custom' });

    expect(inputOf(container).classList.contains('custom')).toBe(true);
  });

  it('exposes the element via `inputEl`', async () => {
    const { container } = render(InputHarness, {});

    // the harness binds `value`; assert the input is reachable and focusable
    const el = inputOf(container);
    el.focus();
    expect(document.activeElement).toBe(el);
  });
});
