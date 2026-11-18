import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Gooey from './Gooey.svelte';
import Shine from './Shine.svelte';
import Tilt from './Tilt.svelte';
import EffectsHarness from './tests/EffectsHarness.svelte';

const testId = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="${id}"]`) as HTMLElement;

describe('SpringValue', () => {
  it('animates toward the value', async () => {
    const { container } = render(EffectsHarness, { kind: 'spring', value: 100 });

    await vi.waitFor(() => {
      expect(Number(testId(container, 'value').textContent)).toBeCloseTo(100, 0);
    });
  });

  it('renders immediately when disabled', async () => {
    const { container } = render(EffectsHarness, { kind: 'spring', value: 42, disabled: true });

    expect(testId(container, 'value').textContent).toBe('42');
  });

  it('passes a null value through', async () => {
    const { container } = render(EffectsHarness, { kind: 'spring', value: null });

    expect(testId(container, 'value').textContent).toBe('');
  });

  it('formats the default rendering', async () => {
    const { container } = render(EffectsHarness, {
      kind: 'spring-default',
      value: 0.5,
      disabled: true,
      format: 'percentRound',
    });

    expect(testId(container, 'value').textContent).toContain('%');
  });
});

describe('TweenedValue', () => {
  it('animates toward the value', async () => {
    const { container } = render(EffectsHarness, { kind: 'tween', value: 50 });

    await vi.waitFor(() => {
      expect(Number(testId(container, 'value').textContent)).toBeCloseTo(50, 0);
    });
  });

  it('renders immediately when disabled', async () => {
    const { container } = render(EffectsHarness, { kind: 'tween', value: 7, disabled: true });

    expect(testId(container, 'value').textContent).toBe('7');
  });

  it('formats the default rendering', async () => {
    const { container } = render(EffectsHarness, {
      kind: 'tween-default',
      value: 1234,
      disabled: true,
      format: 'integer',
    });

    expect(testId(container, 'value').textContent).toContain('1,234');
  });
});

describe('ScrollingValue', () => {
  it('renders the current and next values', async () => {
    const { container } = render(EffectsHarness, { kind: 'scrolling', value: 3 });

    await vi.waitFor(() => {
      const text = container.querySelector('.ScrollingValue')!.textContent ?? '';
      expect(text).toContain('3');
    });
    expect(container.querySelectorAll('.ScrollingValue > div')).toHaveLength(2);
  });

  it('applies a format function', async () => {
    const { container } = render(EffectsHarness, {
      kind: 'scrolling',
      value: 5,
      format: (v: number) => `#${v}`,
    });

    await vi.waitFor(() => {
      expect(container.querySelector('.ScrollingValue')!.textContent).toContain('#5');
    });
  });

  it('translates horizontally on the x axis', async () => {
    const { container } = render(EffectsHarness, { kind: 'scrolling', value: 1, axis: 'x' });

    const first = container.querySelector('.ScrollingValue > div') as HTMLElement;
    expect(first.style.transform).toContain('translateX');
  });
});

describe('Shine', () => {
  it('applies a unique filter to its content', async () => {
    const { container } = render(Shine, {});

    const wrapper = container.querySelector('.Shine') as HTMLElement;
    const filterId = container.querySelector('filter')!.id;
    expect(filterId).toMatch(/^filter-/);
    // the browser normalizes `url(#x)` to `url("#x")`
    expect(wrapper.style.filter).toContain(filterId);
  });

  it('tracks the pointer position', async () => {
    const { container } = render(Shine, {});

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 120, clientY: 80 }));

    await vi.waitFor(() => {
      const light = container.querySelector('fePointLight')!;
      expect(light.getAttribute('x')).not.toBe('0');
    });
  });

  it('exposes lighting props', async () => {
    const { container } = render(Shine, { lightColor: '#ff0000', lightRadius: 50, depth: 3 });

    expect(container.querySelector('feSpecularLighting')!.getAttribute('lighting-color')).toBe(
      '#ff0000'
    );
    expect(container.querySelector('fePointLight')!.getAttribute('z')).toBe('50');
    expect(container.querySelector('feGaussianBlur')!.getAttribute('stdDeviation')).toBe('3');
  });
});

describe('Gooey', () => {
  it('applies a unique filter to its content', async () => {
    const { container } = render(Gooey, {});

    const wrapper = container.querySelector('.Gooey') as HTMLElement;
    const filterId = container.querySelector('filter')!.id;
    expect(wrapper.style.filter).toContain(filterId);
  });

  it('adds a blur only when requested', async () => {
    const without = render(Gooey, {});
    const withBlur = render(Gooey, { blur: 8 });

    expect(without.container.querySelector('feGaussianBlur')).toBeNull();
    expect(withBlur.container.querySelector('feGaussianBlur')!.getAttribute('stdDeviation')).toBe(
      '8'
    );
  });

  it('adds a composite only when requested', async () => {
    const without = render(Gooey, {});
    const withComposite = render(Gooey, { composite: 'atop' });

    expect(without.container.querySelector('feComposite')).toBeNull();
    expect(withComposite.container.querySelector('feComposite')!.getAttribute('operator')).toBe(
      'atop'
    );
  });

  it('applies the alpha matrix values', async () => {
    const { container } = render(Gooey, { alphaPixel: 20, alphaShift: -10 });

    expect(container.querySelector('feColorMatrix')!.getAttribute('values')).toContain('20 -10');
  });
});

describe('Tilt', () => {
  it('starts flat', async () => {
    const { container } = render(Tilt, {});

    const el = container.querySelector('.Tilt') as HTMLElement;
    expect(el.style.getPropertyValue('--rotateX')).toBe('0deg');
    expect(el.style.getPropertyValue('--rotateY')).toBe('0deg');
    expect(el.style.getPropertyValue('--brightness')).toBe('1');
  });

  it('resets on mouse leave', async () => {
    const { container } = render(Tilt, {});

    const el = container.querySelector('.Tilt') as HTMLElement;
    el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    await vi.waitFor(() => {
      expect(el.style.getPropertyValue('--rotateX')).toBe('0deg');
    });
  });
});

describe('BarStack', () => {
  const data = [
    { label: 'a', value: 3, color: 'red' },
    { label: 'b', value: 0, color: 'green' },
    { label: 'c', value: 1, color: 'blue' },
  ];

  it('renders a segment per non-empty item', async () => {
    const { container } = render(EffectsHarness, { kind: 'barstack', data });

    const items = [...container.querySelectorAll('.item')];
    expect(items).toHaveLength(2);
  });

  it('sizes segments in proportion to their value', async () => {
    const { container } = render(EffectsHarness, { kind: 'barstack', data });

    // `flex: 3` expands to the `3 1 0%` shorthand, so compare the grow factor
    const items = [...container.querySelectorAll('.item')] as HTMLElement[];
    expect(items[0].style.flexGrow).toBe('3');
    expect(items[1].style.flexGrow).toBe('1');
  });

  it('applies each item color', async () => {
    const { container } = render(EffectsHarness, { kind: 'barstack', data });

    const bar = container.querySelector('.item div') as HTMLElement;
    expect(bar.style.backgroundColor).toBe('red');
  });

  it('reports clicks with the item', async () => {
    const onItemClick = vi.fn();
    const { container } = render(EffectsHarness, { kind: 'barstack', data, onItemClick });

    (container.querySelector('.item') as HTMLButtonElement).click();

    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ label: 'a' }));
  });
});
