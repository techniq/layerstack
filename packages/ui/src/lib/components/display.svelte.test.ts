import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Progress from './Progress.svelte';
import DisplayHarness from './tests/DisplayHarness.svelte';

const testId = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="${id}"]`) as HTMLElement;

describe('Progress', () => {
  it('renders a progress element with the value', async () => {
    const { container } = render(Progress, { value: 40, max: 100 });

    const el = container.querySelector('progress') as HTMLProgressElement;
    expect(el.value).toBe(40);
    expect(el.max).toBe(100);
  });

  it('treats a null value as zero', async () => {
    const { container } = render(Progress, { value: null });

    expect((container.querySelector('progress') as HTMLProgressElement).value).toBe(0);
  });

  it('merges a custom class', async () => {
    const { container } = render(Progress, { value: 1, class: 'custom' });

    expect(container.querySelector('progress')!.classList.contains('custom')).toBe(true);
  });
});

describe('Badge', () => {
  it('is hidden at zero and shown otherwise', async () => {
    const zero = render(DisplayHarness, { kind: 'badge', value: 0 });
    const some = render(DisplayHarness, { kind: 'badge', value: 3 });

    expect(zero.container.querySelector('.Badge')!.className).toContain('scale-0');
    expect(some.container.querySelector('.Badge')!.className).toContain('scale-100');
    expect(some.container.querySelector('.Badge')!.textContent?.trim()).toBe('3');
  });

  it('renders no content for a dot', async () => {
    const { container } = render(DisplayHarness, { kind: 'badge', value: 5, dot: true });

    const badge = container.querySelector('.Badge')!;
    expect(badge.textContent?.trim()).toBe('');
    expect(badge.className).toContain('h-3');
  });

  it('positions by placement', async () => {
    const { container } = render(DisplayHarness, {
      kind: 'badge',
      value: 1,
      placement: 'bottom-left',
    });

    const badge = container.querySelector('.Badge')!;
    expect(badge.className).toContain('self-end');
    expect(badge.className).toContain('justify-self-start');
  });

  it('defaults to visible when a value snippet is supplied', async () => {
    const { container } = render(DisplayHarness, { kind: 'badge-value' });

    expect(container.querySelector('.Badge')!.className).toContain('scale-100');
    expect(testId(container, 'badge-value')).not.toBeNull();
    // the default background is dropped so the snippet can style itself
    expect(container.querySelector('.Badge')!.className).not.toContain('bg-primary');
  });

  it('renders its anchor', async () => {
    const { container } = render(DisplayHarness, { kind: 'badge', value: 1 });

    expect(testId(container, 'badge-anchor')).not.toBeNull();
  });
});

describe('Lazy', () => {
  it('renders content once it intersects', async () => {
    const { container } = render(DisplayHarness, { kind: 'lazy', height: 20 });

    await vi.waitFor(() => {
      expect(testId(container, 'lazy-content')).not.toBeNull();
    });
  });

  it('reserves the placeholder height', async () => {
    const { container } = render(DisplayHarness, { kind: 'lazy', height: 120 });

    expect((container.querySelector('.Lazy') as HTMLElement).style.minHeight).toBe('120px');
  });

  it('accepts a string height', async () => {
    const { container } = render(DisplayHarness, { kind: 'lazy', height: '10rem' });

    expect((container.querySelector('.Lazy') as HTMLElement).style.minHeight).toBe('10rem');
  });

  it('reports intersection to `onIntersecting`', async () => {
    const onIntersecting = vi.fn();
    render(DisplayHarness, { kind: 'lazy', height: 20, onIntersecting });

    await vi.waitFor(() => expect(onIntersecting).toHaveBeenCalled());
    expect(onIntersecting.mock.calls[0][0]).toHaveProperty('isIntersecting');
  });
});

describe('InfiniteScroll', () => {
  const items = Array.from({ length: 25 }, (_, i) => `item-${i}`);

  it('shows the first page initially', async () => {
    const { container } = render(DisplayHarness, { kind: 'infinite', items, perPage: 5 });

    expect(testId(container, 'visible-count').textContent).toBe('5');
  });

  it('reveals more as the sentinel intersects', async () => {
    const { container } = render(DisplayHarness, { kind: 'infinite', items, perPage: 5 });

    await vi.waitFor(() => {
      expect(Number(testId(container, 'visible-count').textContent)).toBeGreaterThan(5);
    });
  });

  it('renders everything and no sentinel when disabled', async () => {
    const { container } = render(DisplayHarness, {
      kind: 'infinite',
      items,
      perPage: 5,
      disabled: true,
    });

    expect(testId(container, 'visible-count').textContent).toBe('25');
    expect(container.querySelector('.sentinel')).toBeNull();
  });
});

describe('Overflow', () => {
  it('reports the overflow on each axis', async () => {
    const { container } = render(DisplayHarness, { kind: 'overflow' });

    await vi.waitFor(() => {
      expect(Number(testId(container, 'overflow-x').textContent)).toBeGreaterThan(0);
      expect(Number(testId(container, 'overflow-y').textContent)).toBeGreaterThan(0);
    });
  });
});

describe('Paginate', () => {
  const data = Array.from({ length: 12 }, (_, i) => i);

  it('slices the data to the current page', async () => {
    const { container } = render(DisplayHarness, { kind: 'paginate', data, perPage: 5 });

    await vi.waitFor(() => {
      expect(testId(container, 'total-pages').textContent).toBe('3');
    });
    expect(testId(container, 'page-data').textContent).toBe('0,1,2,3,4');
  });

  it('advances pages', async () => {
    const { container } = render(DisplayHarness, { kind: 'paginate', data, perPage: 5 });

    testId(container, 'next').click();

    await vi.waitFor(() => {
      expect(testId(container, 'page').textContent).toBe('2');
      expect(testId(container, 'page-data').textContent).toBe('5,6,7,8,9');
    });
  });

  it('handles a partial last page', async () => {
    const { container } = render(DisplayHarness, { kind: 'paginate', data, perPage: 5 });

    testId(container, 'last').click();

    await vi.waitFor(() => {
      expect(testId(container, 'page-data').textContent).toBe('10,11');
    });
  });
});
