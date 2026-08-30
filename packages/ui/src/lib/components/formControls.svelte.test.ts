import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FormControlsHarness from './tests/FormControlsHarness.svelte';

const testId = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="${id}"]`) as HTMLElement;

/** `change` is a delegated event in Svelte 5, so it must bubble */
function toggle(input: HTMLInputElement) {
  input.checked = !input.checked;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Switch', () => {
  it('reflects and updates the checked state', async () => {
    const { container } = render(FormControlsHarness, { kind: 'switch' });

    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(false);

    toggle(input);

    await vi.waitFor(() => {
      expect(testId(container, 'checked').textContent).toBe('true');
      expect(container.querySelector('.switch')!.getAttribute('data-checked')).toBe('true');
    });
  });

  it('applies the color only when checked', async () => {
    const off = render(FormControlsHarness, { kind: 'switch', color: 'success' });
    const on = render(FormControlsHarness, { kind: 'switch', checked: true, color: 'success' });

    expect(off.container.querySelector('.switch')!.className).not.toContain('bg-success');
    expect(on.container.querySelector('.switch')!.className).toContain('bg-success');
  });

  it('sizes the track', async () => {
    const { container } = render(FormControlsHarness, { kind: 'switch', size: 'sm' });

    expect(container.querySelector('.switch')!.className).toContain('w-6');
  });

  it('renders an indeterminate state for a null value', async () => {
    const { container } = render(FormControlsHarness, { kind: 'switch', checked: null });

    const track = container.querySelector('.switch')!;
    expect(track.className).not.toContain('bg-surface-content/20');
    expect(container.querySelector('.toggle')!.className).toContain('border');
  });

  it('associates the label with the input', async () => {
    const { container } = render(FormControlsHarness, { kind: 'switch' });

    const input = container.querySelector('input')!;
    expect(container.querySelector('label')!.getAttribute('for')).toBe(input.id);
    expect(input.id).toMatch(/^switch-/);
  });
});

describe('Checkbox', () => {
  it('toggles', async () => {
    const { container } = render(FormControlsHarness, { kind: 'checkbox' });

    toggle(container.querySelector('input') as HTMLInputElement);

    await vi.waitFor(() => expect(testId(container, 'checked').textContent).toBe('true'));
  });

  it('renders its label', async () => {
    const { container } = render(FormControlsHarness, { kind: 'checkbox' });

    expect(container.querySelector('.label')!.textContent?.trim()).toBe('Label');
  });

  it('shows the check icon only when checked', async () => {
    const off = render(FormControlsHarness, { kind: 'checkbox' });
    const on = render(FormControlsHarness, { kind: 'checkbox', checked: true });

    // `.className` on an SVG element is an `SVGAnimatedString`, so compare via `classList`
    expect(off.container.querySelector('.icon')!.classList.contains('scale-0')).toBe(true);
    expect(on.container.querySelector('.icon')!.classList.contains('scale-100')).toBe(true);
  });

  it('uses the minus icon when indeterminate', async () => {
    const check = render(FormControlsHarness, { kind: 'checkbox', checked: true });
    const dash = render(FormControlsHarness, {
      kind: 'checkbox',
      checked: true,
      indeterminate: true,
    });

    // different icons render different path data
    const checkPath = check.container.querySelector('.icon path')?.getAttribute('d');
    const dashPath = dash.container.querySelector('.icon path')?.getAttribute('d');
    expect(checkPath).not.toBe(dashPath);
  });

  describe('group', () => {
    it('derives checked from group membership', async () => {
      const { container } = render(FormControlsHarness, { kind: 'checkbox-group', group: ['b'] });

      const inputs = [...container.querySelectorAll('input')] as HTMLInputElement[];
      expect(inputs.map((i) => i.checked)).toEqual([false, true, false]);
    });

    it('adds to the group when checked', async () => {
      const { container } = render(FormControlsHarness, { kind: 'checkbox-group', group: [] });

      toggle(container.querySelectorAll('input')[0] as HTMLInputElement);

      await vi.waitFor(() => expect(testId(container, 'group').textContent).toBe('a'));
    });

    it('removes from the group when unchecked', async () => {
      const { container } = render(FormControlsHarness, {
        kind: 'checkbox-group',
        group: ['a', 'b'],
      });

      toggle(container.querySelectorAll('input')[0] as HTMLInputElement);

      await vi.waitFor(() => expect(testId(container, 'group').textContent).toBe('b'));
    });
  });
});

describe('Radio', () => {
  it('checks only the matching value', async () => {
    const { container } = render(FormControlsHarness, { kind: 'radio-group', group: 'b' });

    const inputs = [...container.querySelectorAll('input')] as HTMLInputElement[];
    expect(inputs.map((i) => i.checked)).toEqual([false, true, false]);
    expect(
      [...container.querySelectorAll('.icon')].map((i) => i.classList.contains('scale-100'))
    ).toEqual([false, true, false]);
  });

  it('updates the group on selection', async () => {
    const { container } = render(FormControlsHarness, { kind: 'radio-group', group: 'a' });

    const third = container.querySelectorAll('input')[2] as HTMLInputElement;
    third.checked = true;
    third.dispatchEvent(new Event('change', { bubbles: true }));

    await vi.waitFor(() => expect(testId(container, 'group').textContent).toBe('c'));
  });
});

describe('NumberStepper', () => {
  it('steps the value up and down', async () => {
    const { container } = render(FormControlsHarness, { kind: 'stepper', value: 5 });

    const [minus, plus] = [...container.querySelectorAll('.Button')] as HTMLButtonElement[];

    plus.click();
    await vi.waitFor(() => expect(testId(container, 'value').textContent).toBe('6'));

    minus.click();
    await vi.waitFor(() => expect(testId(container, 'value').textContent).toBe('5'));
  });

  it('honors a custom step', async () => {
    const { container } = render(FormControlsHarness, { kind: 'stepper', value: 0, step: 5 });

    const plus = [...container.querySelectorAll('.Button')][1] as HTMLButtonElement;
    plus.click();

    await vi.waitFor(() => expect(testId(container, 'value').textContent).toBe('5'));
  });

  it('disables the buttons at the bounds', async () => {
    const atMin = render(FormControlsHarness, { kind: 'stepper', value: 0, min: 0, max: 10 });
    const atMax = render(FormControlsHarness, { kind: 'stepper', value: 10, min: 0, max: 10 });

    const minusOf = (c: HTMLElement) => c.querySelectorAll('.Button')[0] as HTMLButtonElement;
    const plusOf = (c: HTMLElement) => c.querySelectorAll('.Button')[1] as HTMLButtonElement;

    expect(minusOf(atMin.container).disabled).toBe(true);
    expect(plusOf(atMin.container).disabled).toBe(false);
    expect(plusOf(atMax.container).disabled).toBe(true);
  });

  it('reports changes', async () => {
    const onChange = vi.fn();
    const { container } = render(FormControlsHarness, { kind: 'stepper', value: 1, onChange });

    ([...container.querySelectorAll('.Button')][1] as HTMLButtonElement).click();

    await vi.waitFor(() => expect(onChange).toHaveBeenCalledWith({ value: 2 }));
  });
});

describe('RangeField', () => {
  it('renders a range input bound to the value', async () => {
    const { container } = render(FormControlsHarness, { kind: 'range', value: 25 });

    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.value).toBe('25');
  });

  it('steps with the chevron buttons', async () => {
    const { container } = render(FormControlsHarness, { kind: 'range', value: 50, step: 10 });

    const [left, right] = [...container.querySelectorAll('.Button')] as HTMLButtonElement[];

    right.click();
    await vi.waitFor(() => expect(testId(container, 'value').textContent).toBe('60'));

    left.click();
    await vi.waitFor(() => expect(testId(container, 'value').textContent).toBe('50'));
  });

  it('clamps at the bounds', async () => {
    const { container } = render(FormControlsHarness, {
      kind: 'range',
      value: 100,
      min: 0,
      max: 100,
    });

    ([...container.querySelectorAll('.Button')][1] as HTMLButtonElement).click();

    expect(testId(container, 'value').textContent).toBe('100');
  });

  it('formats the displayed value', async () => {
    const { container } = render(FormControlsHarness, {
      kind: 'range',
      value: 50,
      format: 'percentRound',
    });

    expect(container.querySelector('.Field')!.textContent).toContain('%');
  });
});

describe('NavItem', () => {
  const currentUrl = new URL('https://example.test/docs/ui/Button');

  it('renders a link with the resolved path', async () => {
    const { container } = render(FormControlsHarness, {
      kind: 'navitem',
      currentUrl,
      path: '/docs/ui/Icon',
      text: 'Icon',
    });

    const link = container.querySelector('.NavItem') as HTMLAnchorElement;
    expect(link.textContent).toContain('Icon');
    expect(link.getAttribute('href')).toContain('/docs/ui/Icon');
  });

  it('marks the active path', async () => {
    const active = render(FormControlsHarness, {
      kind: 'navitem',
      currentUrl,
      path: '/docs/ui/Button',
      text: 'Button',
    });
    const inactive = render(FormControlsHarness, {
      kind: 'navitem',
      currentUrl,
      path: '/docs/ui/Icon',
      text: 'Icon',
    });

    expect(active.container.querySelector('.NavItem')!.classList.contains('is-active')).toBe(true);
    expect(inactive.container.querySelector('.NavItem')!.classList.contains('is-active')).toBe(
      false
    );
  });

  it('renders an icon', async () => {
    const { container } = render(FormControlsHarness, {
      kind: 'navitem',
      currentUrl,
      path: '/x',
      icon: 'M0 0L1 1',
    });

    expect(container.querySelector('.NavItem .Icon')).not.toBeNull();
  });
});
