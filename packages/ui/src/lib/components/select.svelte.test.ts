import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import SelectHarness from './tests/SelectHarness.svelte';

const testId = (root: ParentNode, id: string) =>
  root.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

/** `input`/`change` are delegated in Svelte 5, so synthetic events must bubble */
function type(el: HTMLInputElement, value: string) {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('MenuButton', () => {
  it('shows the selected label, or a placeholder', async () => {
    const empty = render(SelectHarness, { kind: 'menu-button', options });
    const chosen = render(SelectHarness, { kind: 'menu-button', options, value: 'banana' });

    expect(empty.container.querySelector('.MenuButton')!.textContent).toContain('No selection');
    expect(chosen.container.querySelector('.MenuButton')!.textContent).toContain('Banana');
  });

  it('opens a menu and selects an option', async () => {
    const onChange = vi.fn();
    const { container } = render(SelectHarness, { kind: 'menu-button', options, onChange });

    (container.querySelector('.MenuButton') as HTMLButtonElement).click();

    await vi.waitFor(() => expect(document.querySelectorAll('.MenuItem').length).toBe(3));

    (document.querySelectorAll('.MenuItem')[2] as HTMLButtonElement).click();

    await vi.waitFor(() => expect(testId(container, 'value')!.textContent).toBe('cherry'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'cherry',
        option: expect.objectContaining({ label: 'Cherry' }),
      })
    );
  });

  it('hides the chevron when `menuIcon` is false', async () => {
    const withIcon = render(SelectHarness, { kind: 'menu-button', options });
    const without = render(SelectHarness, { kind: 'menu-button', options, menuIcon: false });

    expect(withIcon.container.querySelectorAll('.MenuButton .Icon').length).toBeGreaterThan(0);
    expect(without.container.querySelectorAll('.MenuButton .Icon')).toHaveLength(0);
  });
});

describe('MenuField', () => {
  it('shows the selected label', async () => {
    const { container } = render(SelectHarness, { kind: 'menu-field', options, value: 'apple' });

    expect(container.querySelector('.Field')!.textContent).toContain('Apple');
  });

  it('selects from the menu', async () => {
    const onChange = vi.fn();
    const { container } = render(SelectHarness, {
      kind: 'menu-field',
      options,
      value: 'apple',
      onChange,
    });

    (container.querySelector('.Field .grow') as HTMLElement).click();

    await vi.waitFor(() => expect(document.querySelectorAll('.MenuItem').length).toBe(3));
    (document.querySelectorAll('.MenuItem')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(testId(container, 'value')!.textContent).toBe('banana');
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'banana' }));
    });
  });

  it('steps through options, wrapping at the ends', async () => {
    const { container } = render(SelectHarness, {
      kind: 'menu-field',
      options,
      value: 'apple',
      stepper: true,
    });

    const [prev, next] = [...container.querySelectorAll('.Field .Button')] as HTMLButtonElement[];

    prev.click();
    await vi.waitFor(() => expect(testId(container, 'value')!.textContent).toBe('cherry'));

    next.click();
    await vi.waitFor(() => expect(testId(container, 'value')!.textContent).toBe('apple'));
  });

  it('renders group headers', async () => {
    const grouped = [
      { label: 'Apple', value: 'apple', group: 'Fruit' },
      { label: 'Carrot', value: 'carrot', group: 'Veg' },
    ];
    const { container } = render(SelectHarness, { kind: 'menu-field', options: grouped });

    (container.querySelector('.Field .grow') as HTMLElement).click();

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.group-header').length).toBe(2);
    });
  });
});

describe('SelectField', () => {
  it('shows the selected option label in the input', async () => {
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      value: 'banana',
    });

    await vi.waitFor(() => {
      expect((container.querySelector('input.Input') as HTMLInputElement).value).toBe('Banana');
    });
  });

  it('renders options inline when asked', async () => {
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      inlineOptions: true,
    });

    await vi.waitFor(() => {
      expect(container.querySelectorAll('.SelectFieldOptions .MenuItem')).toHaveLength(3);
    });
  });

  it('filters options by search text', async () => {
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      inlineOptions: true,
      open: true,
    });

    const input = container.querySelector('input.Input') as HTMLInputElement;
    type(input, 'an');

    await vi.waitFor(() => {
      const labels = [...container.querySelectorAll('.SelectFieldOptions .MenuItem')].map((i) =>
        i.textContent?.trim()
      );
      expect(labels).toEqual(['Banana']);
    });
  });

  it('shows an empty message when nothing matches', async () => {
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      inlineOptions: true,
      open: true,
    });

    type(container.querySelector('input.Input') as HTMLInputElement, 'zzz');

    await vi.waitFor(() => {
      expect(container.querySelector('.SelectFieldOptions')!.textContent).toContain(
        'No options found'
      );
    });
  });

  it('selects an option on click', async () => {
    const onChange = vi.fn();
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      inlineOptions: true,
      open: true,
      onChange,
    });

    await vi.waitFor(() =>
      expect(container.querySelectorAll('.SelectFieldOptions .MenuItem').length).toBe(3)
    );

    (container.querySelectorAll('.SelectFieldOptions .MenuItem')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(testId(container, 'value')!.textContent).toBe('banana');
    });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'banana' }));
  });

  it('navigates with arrow keys and selects with Enter', async () => {
    const onChange = vi.fn();
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      inlineOptions: true,
      open: true,
      onChange,
    });

    const optionsEl = container.querySelector('.SelectFieldOptions') as HTMLElement;
    await vi.waitFor(() => expect(optionsEl.querySelectorAll('.MenuItem').length).toBe(3));

    optionsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    optionsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    optionsEl.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'banana' }));
    });
  });

  it('skips disabled options when navigating', async () => {
    const withDisabled = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', disabled: true },
      { label: 'Cherry', value: 'cherry' },
    ];
    const onChange = vi.fn();
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options: withDisabled,
      inlineOptions: true,
      open: true,
      onChange,
    });

    const optionsEl = container.querySelector('.SelectFieldOptions') as HTMLElement;
    await vi.waitFor(() => expect(optionsEl.querySelectorAll('.MenuItem').length).toBe(3));

    optionsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    optionsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    optionsEl.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'cherry' }));
    });
  });

  it('clears the value', async () => {
    const { container } = render(SelectHarness, {
      kind: 'select-field',
      options,
      value: 'apple',
      inlineOptions: true,
    });

    await vi.waitFor(() => expect(testId(container, 'value')!.textContent).toBe('apple'));

    const clear = container.querySelector('.append .Button') as HTMLButtonElement;
    clear.click();

    await vi.waitFor(() => expect(testId(container, 'value')!.textContent).toBe('none'));
  });

  it('shows a spinner while loading', async () => {
    const { container } = render(SelectHarness, { kind: 'select-field', options, loading: true });

    expect(container.querySelector('.ProgressCircle')).not.toBeNull();
  });
});

describe('MultiSelect', () => {
  it('renders an option per entry', async () => {
    const { container } = render(SelectHarness, { kind: 'multi-select', options, values: [] });

    await vi.waitFor(() => expect(container.querySelectorAll('.MultiSelectOption').length).toBe(3));
  });

  it('checks the initially selected options', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select',
      options,
      values: ['banana'],
    });

    await vi.waitFor(() => {
      const checked = [...container.querySelectorAll('.MultiSelectOption')].filter(
        (o) => o.getAttribute('aria-selected') === 'true'
      );
      expect(checked).toHaveLength(1);
      expect(checked[0].textContent).toContain('Banana');
    });
  });

  it('requires Apply in `actions` mode', async () => {
    const onChange = vi.fn();
    const { container } = render(SelectHarness, {
      kind: 'multi-select',
      options,
      values: [],
      onChange,
    });

    await vi.waitFor(() => expect(container.querySelectorAll('.MultiSelectOption').length).toBe(3));

    const firstInput = container.querySelector('.MultiSelectOption input') as HTMLInputElement;
    firstInput.checked = true;
    firstInput.dispatchEvent(new Event('change', { bubbles: true }));

    // not applied yet
    expect(onChange).not.toHaveBeenCalled();

    const apply = [...container.querySelectorAll('.actions .Button')].find(
      (b) => b.textContent?.trim() === 'Apply'
    ) as HTMLButtonElement;
    await vi.waitFor(() => expect(apply.disabled).toBe(false));
    apply.click();

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(testId(container, 'value')!.textContent).toBe('apple');
    });
  });

  it('applies immediately in `immediate` mode', async () => {
    const onChange = vi.fn();
    const { container } = render(SelectHarness, {
      kind: 'multi-select',
      options,
      values: [],
      mode: 'immediate',
      onChange,
    });

    await vi.waitFor(() => expect(container.querySelectorAll('.MultiSelectOption').length).toBe(3));

    const firstInput = container.querySelector('.MultiSelectOption input') as HTMLInputElement;
    firstInput.checked = true;
    firstInput.dispatchEvent(new Event('change', { bubbles: true }));

    await vi.waitFor(() => {
      expect(testId(container, 'value')!.textContent).toBe('apple');
    });
    // no action buttons in immediate mode
    expect(container.querySelectorAll('.actions .Button')).toHaveLength(0);
  });

  it('reverts on Cancel', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select',
      options,
      values: ['apple'],
    });

    await vi.waitFor(() => expect(container.querySelectorAll('.MultiSelectOption').length).toBe(3));

    const inputs = [
      ...container.querySelectorAll('.MultiSelectOption input'),
    ] as HTMLInputElement[];
    inputs[1].checked = true;
    inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

    const cancel = [...container.querySelectorAll('.actions .Button')].find(
      (b) => b.textContent?.trim() === 'Cancel'
    ) as HTMLButtonElement;
    cancel.click();

    await vi.waitFor(() => {
      const checked = [...container.querySelectorAll('.MultiSelectOption')].filter(
        (o) => o.getAttribute('aria-selected') === 'true'
      );
      expect(checked).toHaveLength(1);
    });
  });

  it('renders a search box and filters', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select',
      options,
      values: [],
      search: true,
    });

    const input = container.querySelector('.search input.Input') as HTMLInputElement;
    expect(input).not.toBeNull();

    type(input, 'ap');

    await vi.waitFor(() => {
      const labels = [...container.querySelectorAll('.MultiSelectOption')].map((o) =>
        o.textContent?.trim()
      );
      expect(labels).toEqual(['Apple']);
    });
  });

  it('disables further selection at `max`', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select',
      options,
      values: ['apple'],
      max: 1,
    });

    await vi.waitFor(() => expect(container.querySelectorAll('.MultiSelectOption').length).toBe(3));

    const inputs = [
      ...container.querySelectorAll('.MultiSelectOption input'),
    ] as HTMLInputElement[];
    // the selected one stays enabled so it can be unchecked
    expect(inputs.filter((i) => i.disabled).length).toBe(2);
  });
});

describe('MultiSelectField', () => {
  it('summarizes the selection when closed', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select-field',
      options,
      values: ['apple', 'banana'],
    });

    await vi.waitFor(() => {
      expect((container.querySelector('input.Input') as HTMLInputElement).value).toBe('2 selected');
    });
  });

  it('accepts a custom summary', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select-field',
      options,
      values: ['apple'],
      formatSelected: ({ options }: any) => options.map((o: any) => o.label).join(', '),
    });

    await vi.waitFor(() => {
      expect((container.querySelector('input.Input') as HTMLInputElement).value).toBe('Apple');
    });
  });

  it('clears the selection', async () => {
    const { container } = render(SelectHarness, {
      kind: 'multi-select-field',
      options,
      values: ['apple'],
    });

    const clear = container.querySelector('.append .Button') as HTMLButtonElement;
    clear.click();

    await vi.waitFor(() => expect(testId(container, 'value')!.textContent).toBe(''));
  });
});
