import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ToggleGroupHarness from './tests/ToggleGroupHarness.svelte';

const testId = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

describe('ToggleGroup', () => {
  it('renders an option per child', async () => {
    const { container } = render(ToggleGroupHarness, {});

    expect(container.querySelectorAll('.ToggleOption')).toHaveLength(3);
  });

  it('selects the option matching the initial value', async () => {
    const { container } = render(ToggleGroupHarness, { value: 'b' });

    await vi.waitFor(() => {
      expect(testId(container, 'option-b')!.dataset.selected).toBe('true');
    });
    expect(testId(container, 'option-a')!.dataset.selected).toBe('false');
  });

  it('selects on click and reports the change', async () => {
    const onChange = vi.fn();
    const { container } = render(ToggleGroupHarness, { value: 'a', onChange });

    const inputs = [...container.querySelectorAll('.ToggleOption input')] as HTMLInputElement[];
    inputs[2].click();

    await vi.waitFor(() => {
      expect(testId(container, 'value')!.textContent).toBe('c');
      expect(testId(container, 'option-c')!.dataset.selected).toBe('true');
    });
    expect(onChange).toHaveBeenCalledWith({ value: 'c' });
  });

  it('marks the selected option with a `selected` class', async () => {
    const { container } = render(ToggleGroupHarness, { value: 'a' });

    await vi.waitFor(() => {
      expect(container.querySelector('.ToggleOption')!.classList.contains('selected')).toBe(true);
    });
  });

  it('renders an indicator only for the selected option', async () => {
    const { container } = render(ToggleGroupHarness, { value: 'a' });

    await vi.waitFor(() => {
      expect(container.querySelectorAll('.indicator')).toHaveLength(1);
    });
  });

  it('applies variant classes to the root and options', async () => {
    const { container } = render(ToggleGroupHarness, { value: 'a', variant: 'outline' });

    const root = container.querySelector('.ToggleGroup')!;
    expect(root.classList.contains('variant-outline')).toBe(true);
    expect(container.querySelector('.options')!.className).toContain('border');
  });

  it('lays out vertically', async () => {
    const { container } = render(ToggleGroupHarness, { value: 'a', vertical: true });

    expect(container.querySelector('.options')!.className).toContain('grid-flow-row');
  });

  it('sizes the labels', async () => {
    const { container } = render(ToggleGroupHarness, { value: 'a', size: 'lg' });

    expect(container.querySelector('.ToggleOption')!.className).toContain('text-base');
  });

  describe('panels', () => {
    it('shows only the panel matching the selected option', async () => {
      const { container } = render(ToggleGroupHarness, { value: 'a', withPanels: true });

      await vi.waitFor(() => {
        expect(testId(container, 'panel-a')).not.toBeNull();
      });
      expect(testId(container, 'panel-b')).toBeNull();
      expect(testId(container, 'panel-c')).toBeNull();
    });

    it('switches panels with the selection', async () => {
      const { container } = render(ToggleGroupHarness, { value: 'a', withPanels: true });

      const inputs = [...container.querySelectorAll('.ToggleOption input')] as HTMLInputElement[];
      inputs[1].click();

      await vi.waitFor(() => {
        expect(testId(container, 'panel-b')).not.toBeNull();
        expect(testId(container, 'panel-a')).toBeNull();
      });
    });
  });
});

describe('ToggleButton', () => {
  it('toggles its content', async () => {
    const { container } = render(ToggleGroupHarness, { kind: 'button', transition: false });

    expect(testId(container, 'label')!.textContent).toBe('Off');
    expect(testId(container, 'toggled')).toBeNull();

    (container.querySelector('.Button') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(testId(container, 'label')!.textContent).toBe('On');
      expect(testId(container, 'toggled')).not.toBeNull();
    });
  });

  it('places the button after the content when asked', async () => {
    const { container } = render(ToggleGroupHarness, {
      kind: 'button',
      on: true,
      transition: false,
      buttonPlacement: 'after',
    });

    // `ToggleButton` renders a fragment, so compare document order directly
    const button = container.querySelector('.Button')!;
    const content = testId(container, 'toggled')!;
    expect(content.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
