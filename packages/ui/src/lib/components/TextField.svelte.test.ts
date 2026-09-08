import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import TextField from './TextField.svelte';
import TextFieldHarness from './tests/TextFieldHarness.svelte';

function inputOf(container: HTMLElement) {
  return container.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
}

function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('TextField', () => {
  it('renders an input associated with its label', async () => {
    const { container } = render(TextField, { label: 'Name' });

    const root = container.querySelector('.TextField') as HTMLLabelElement;
    expect(root.getAttribute('for')).toBe(inputOf(container).id);
    expect(inputOf(container).id).toMatch(/^textfield-/);
  });

  it('renders a textarea when `multiline`', async () => {
    const { container } = render(TextField, { multiline: true });

    expect(container.querySelector('textarea')).not.toBeNull();
    expect(container.querySelector('input')).toBeNull();
  });

  describe('value', () => {
    it('binds the value', async () => {
      const { container } = render(TextFieldHarness, { value: 'hello' });

      expect(inputOf(container).value).toBe('hello');
    });

    it('calls `onChange` with the detail', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { onChange });

      type(inputOf(container), 'abc');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'abc', inputValue: 'abc' })
      );
    });

    it('reports an empty value as null', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { value: 'abc', onChange });

      type(inputOf(container), '');

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: null }));
    });

    it('coerces numeric types', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { type: 'integer', onChange });

      type(inputOf(container), '42');

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 42 }));
    });

    it('debounces when `debounceChange` is set', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { onChange, debounceChange: 50 });

      type(inputOf(container), 'a');
      type(inputOf(container), 'ab');
      expect(onChange).not.toHaveBeenCalled();

      await vi.waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ inputValue: 'ab' }));
    });
  });

  describe('type', () => {
    const typeCases = [
      ['text', 'text', 'text'],
      ['password', 'password', 'text'],
      ['email', 'email', 'email'],
      ['search', 'search', 'search'],
      ['integer', 'number', 'numeric'],
      ['decimal', 'number', 'decimal'],
      ['currency', 'number', 'decimal'],
      ['percent', 'number', 'decimal'],
    ] as const;

    it.each(typeCases)(
      'maps %s to input type %s and inputmode %s',
      async (type, inputType, inputMode) => {
        const { container } = render(TextField, { type });

        const el = inputOf(container) as HTMLInputElement;
        expect(el.type).toBe(inputType);
        expect(el.inputMode).toBe(inputMode);
      }
    );

    it('defaults `step` to 0.1 for decimals', async () => {
      const decimal = render(TextField, { type: 'decimal' });
      const integer = render(TextField, { type: 'integer' });

      expect((inputOf(decimal.container) as HTMLInputElement).step).toBe('0.1');
      expect((inputOf(integer.container) as HTMLInputElement).step).toBe('1');
    });

    it('renders a currency icon as a prefix', async () => {
      const { container } = render(TextField, { type: 'currency' });

      expect(container.querySelector('.input .Icon')).not.toBeNull();
    });

    it('toggles password visibility', async () => {
      const { container } = render(TextField, { type: 'password' });

      const el = inputOf(container) as HTMLInputElement;
      expect(el.type).toBe('password');

      (container.querySelector('.append .Button') as HTMLButtonElement).click();
      await vi.waitFor(() => {
        expect((inputOf(container) as HTMLInputElement).type).toBe('text');
      });
    });
  });

  describe('operators', () => {
    const operators = [
      { label: '>', value: 'gt' },
      { label: '<', value: 'lt' },
    ];

    it('renders a select of operators', async () => {
      const { container } = render(TextField, { operators });

      const select = container.querySelector('.append select') as HTMLSelectElement;
      expect(select).not.toBeNull();
      expect([...select.options].map((o) => o.value)).toEqual(['gt', 'lt']);
      expect(select.value).toBe('gt');
    });

    it('wraps the value with the selected operator', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { operators, onChange });

      type(inputOf(container), '5');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ value: { gt: '5' }, operator: 'gt' })
      );
    });

    it('updates the value when the operator changes', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { operators, onChange });

      type(inputOf(container), '5');
      onChange.mockClear();

      const select = container.querySelector('.append select') as HTMLSelectElement;
      select.value = 'lt';
      select.dispatchEvent(new Event('change', { bubbles: true }));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ value: { lt: '5' }, operator: 'lt' })
      );
    });

    it('reads the initial operator from an object value', async () => {
      const { container } = render(TextField, { operators, value: { lt: 7 } });

      expect((container.querySelector('.append select') as HTMLSelectElement).value).toBe('lt');
      expect(inputOf(container).value).toBe('7');
    });
  });

  describe('clearable', () => {
    it('clears the value and calls `onClear`', async () => {
      const onClear = vi.fn();
      const onChange = vi.fn();
      const { container } = render(TextField, {
        clearable: true,
        value: 'abc',
        onClear,
        onChange,
      });

      const button = container.querySelector('.append .Button') as HTMLButtonElement;
      button.click();

      await vi.waitFor(() => {
        expect(onClear).toHaveBeenCalledTimes(1);
      });
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: null }));
    });

    it('is hidden without a value', async () => {
      const { container } = render(TextField, { clearable: true, value: '' });

      expect(container.querySelector('.append .Button')).toBeNull();
    });
  });

  describe('accept', () => {
    it('filters input to the accepted pattern', async () => {
      const onChange = vi.fn();
      const { container } = render(TextField, { accept: '[0-9]+', onChange });

      type(inputOf(container), 'abc123def');

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ inputValue: '123' }));
    });
  });

  it('applies the `autoFocus` attachment when `autofocus` is set', async () => {
    const { container } = render(TextField, { autofocus: true });

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(inputOf(container));
    });
  });

  it('does not focus by default', async () => {
    const { container } = render(TextField, {});

    expect(document.activeElement).not.toBe(inputOf(container));
  });

  it('forwards focus and keyboard handlers to the input', async () => {
    const onfocus = vi.fn();
    const onkeydown = vi.fn();
    const { container } = render(TextField, { onfocus, onkeydown });

    const el = inputOf(container);
    el.dispatchEvent(new FocusEvent('focus'));
    // `keydown` is a delegated event in Svelte 5 — the listener lives on the root, so a
    // non-bubbling synthetic event would never reach it
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

    expect(onfocus).toHaveBeenCalledTimes(1);
    expect(onkeydown).toHaveBeenCalledTimes(1);
  });

  it('shows an error message and accent', async () => {
    const { container } = render(TextField, { error: 'Required' });

    expect(container.querySelector('.error')!.textContent?.trim()).toBe('Required');
    expect(container.querySelector('.TextField')!.className).toContain('--color-danger');
  });

  it('aligns text', async () => {
    const { container } = render(TextField, { align: 'right' });

    expect(inputOf(container).className).toContain('text-right');
  });

  it('applies a mask through to the input', async () => {
    const { container } = render(TextField, { mask: '___-___' });

    expect((inputOf(container) as HTMLInputElement).placeholder).toBe('___-___');
  });
});
