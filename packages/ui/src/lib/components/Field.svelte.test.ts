import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FieldHarness from './tests/FieldHarness.svelte';
import FieldNoChildrenHarness from './tests/FieldNoChildrenHarness.svelte';

function fieldOf(container: HTMLElement) {
  return container.querySelector('.Field') as HTMLLabelElement;
}

describe('Field', () => {
  it('associates its label with the control', async () => {
    const { container } = render(FieldHarness, { label: 'Name' });

    const label = fieldOf(container);
    const input = container.querySelector('[data-testid="field-input"]') as HTMLInputElement;
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.id).toMatch(/^field-/);
  });

  it('honors an explicit `id`', async () => {
    const { container } = render(FieldHarness, { label: 'Name', id: 'my-field' });

    expect(fieldOf(container).getAttribute('for')).toBe('my-field');
    expect(container.querySelector('[data-testid="field-input"]')!.id).toBe('my-field');
  });

  describe('label placement', () => {
    it('renders a top label outside the container', async () => {
      const { container } = render(FieldHarness, { label: 'Name', labelPlacement: 'top' });

      const label = container.querySelector('.label')!;
      expect(label.classList.contains('placement-top')).toBe(true);
      expect(label.textContent?.trim()).toBe('Name');
    });

    it('shrinks an inset label', async () => {
      const { container } = render(FieldHarness, { label: 'Name', labelPlacement: 'inset' });

      expect(container.querySelector('.label')!.classList.contains('shrink')).toBe(true);
    });

    it('only shrinks a float label once there is a value', async () => {
      const empty = render(FieldHarness, { label: 'Name', labelPlacement: 'float' });
      expect(empty.container.querySelector('.label')!.classList.contains('shrink')).toBe(false);

      const filled = render(FieldHarness, {
        label: 'Name',
        labelPlacement: 'float',
        value: 'hello',
      });
      expect(filled.container.querySelector('.label')!.classList.contains('shrink')).toBe(true);
    });

    it('lays out a left label horizontally', async () => {
      const { container } = render(FieldHarness, { label: 'Name', labelPlacement: 'left' });

      expect(fieldOf(container).className).toContain('items-center');
    });
  });

  describe('snippets', () => {
    it('renders prepend, append, prefix, suffix, and root', async () => {
      const { container } = render(FieldHarness, {
        withPrepend: true,
        withAppend: true,
        withPrefix: true,
        withSuffix: true,
        withRoot: true,
      });

      for (const id of ['prepend', 'append', 'prefix', 'suffix', 'root']) {
        expect(container.querySelector(`[data-testid="${id}"]`)).not.toBeNull();
      }
    });

    it('falls back to the value when there are no children', async () => {
      const { container } = render(FieldNoChildrenHarness, { value: 'fallback' });

      expect(container.querySelector('.input')!.textContent).toContain('fallback');
    });

    it('falls back to the placeholder when there is no value', async () => {
      const { container } = render(FieldNoChildrenHarness, {
        value: null,
        placeholder: 'Nothing here',
      });

      expect(container.querySelector('.input')!.textContent).toContain('Nothing here');
    });
  });

  describe('clearable', () => {
    it('is hidden without a value', async () => {
      const { container } = render(FieldHarness, { clearable: true, value: null });

      expect(container.querySelector('.append .Button')).toBeNull();
    });

    it('clears a string value and calls `onClear`', async () => {
      const onClear = vi.fn();
      const { container } = render(FieldHarness, { clearable: true, value: 'text', onClear });

      const button = container.querySelector('.append .Button') as HTMLButtonElement;
      expect(button).not.toBeNull();
      button.click();

      await vi.waitFor(() => {
        expect(onClear).toHaveBeenCalledTimes(1);
        expect(container.querySelector('.append .Button')).toBeNull();
      });
    });

    it('clears an array value to an empty array', async () => {
      const { container } = render(FieldHarness, { clearable: true, value: ['a', 'b'] });

      (container.querySelector('.append .Button') as HTMLButtonElement).click();

      await vi.waitFor(() => {
        expect(container.querySelector('.append .Button')).toBeNull();
      });
    });
  });

  describe('error and hint', () => {
    it('shows the hint when there is no error', async () => {
      const { container } = render(FieldHarness, { hint: 'Helpful' });

      const message = container.querySelector('.hint')!;
      expect(message.textContent?.trim()).toBe('Helpful');
    });

    it('shows the error and switches the accent color', async () => {
      const { container } = render(FieldHarness, { error: 'Required', hint: 'Helpful' });

      expect(container.querySelector('.error')!.textContent?.trim()).toBe('Required');
      expect(fieldOf(container).className).toContain('--color-danger');
    });

    it('renders an info icon in the append slot on error', async () => {
      const { container } = render(FieldHarness, { error: true });

      expect(container.querySelector('.append .Icon')).not.toBeNull();
    });
  });

  describe('icons', () => {
    it('renders a leading icon', async () => {
      const { container } = render(FieldHarness, { icon: 'M0 0L1 1' });

      expect(container.querySelector('.prepend .Icon')).not.toBeNull();
    });

    it('renders a trailing icon', async () => {
      const { container } = render(FieldHarness, { iconRight: 'M0 0L1 1' });

      expect(container.querySelector('.append .Icon')).not.toBeNull();
    });
  });

  it('forwards a click on the input area', async () => {
    const onclick = vi.fn();
    // Uses the harness without an inner control: a `<label for>` pointing at a real input
    // re-dispatches the click to it, so the handler would legitimately fire twice
    const { container } = render(FieldNoChildrenHarness, { onclick });

    (container.querySelector('.input') as HTMLElement).click();
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('applies `classes` per part', async () => {
    const { container } = render(FieldHarness, {
      label: 'Name',
      hint: 'h',
      classes: {
        root: 'root-c',
        container: 'container-c',
        label: 'label-c',
        input: 'input-c',
        error: 'error-c',
      },
    });

    expect(fieldOf(container).classList.contains('root-c')).toBe(true);
    expect(container.querySelector('.label')!.classList.contains('label-c')).toBe(true);
    expect(container.querySelector('.input')!.classList.contains('input-c')).toBe(true);
    expect(container.querySelector('.hint')!.classList.contains('error-c')).toBe(true);
  });

  it('disables interaction', async () => {
    const { container } = render(FieldHarness, { disabled: true });

    expect(fieldOf(container).className).toContain('pointer-events-none');
  });
});
