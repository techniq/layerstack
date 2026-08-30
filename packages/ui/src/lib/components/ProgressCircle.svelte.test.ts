import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ProgressCircle from './ProgressCircle.svelte';

function rootOf(container: HTMLElement) {
  return container.querySelector('.ProgressCircle') as HTMLElement;
}

describe('ProgressCircle', () => {
  it('is indeterminate without a value', async () => {
    const { container } = render(ProgressCircle, {});

    const root = rootOf(container);
    expect(root.classList.contains('indeterminate')).toBe(true);
    expect(root.getAttribute('aria-valuenow')).toBeNull();
  });

  it('exposes progress to assistive technology', async () => {
    const { container } = render(ProgressCircle, { value: 42 });

    const root = rootOf(container);
    expect(root.classList.contains('indeterminate')).toBe(false);
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-valuenow')).toBe('42');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
  });

  it('sizes the container', async () => {
    const { container } = render(ProgressCircle, { size: 64 });

    const root = rootOf(container);
    expect(root.style.width).toBe('64px');
    expect(root.style.height).toBe('64px');
  });

  it('renders the track only when requested', async () => {
    const without = render(ProgressCircle, { value: 50 });
    expect(without.container.querySelector('circle.track')).toBeNull();

    const withTrack = render(ProgressCircle, { value: 50, track: true });
    expect(withTrack.container.querySelector('circle.track')).not.toBeNull();
  });

  it('offsets the stroke in proportion to the value', async () => {
    const full = render(ProgressCircle, { value: 100 });
    const empty = render(ProgressCircle, { value: 0 });

    const offsetOf = (c: HTMLElement) =>
      c.querySelector('circle.path')!.getAttribute('stroke-dashoffset');

    expect(offsetOf(full.container)).toBe('0px');
    // an empty circle is offset by the full circumference (2 * PI * 20)
    expect(parseFloat(offsetOf(empty.container)!)).toBeCloseTo(2 * Math.PI * 20, 3);
  });

  it('rotates determinate circles to start at the top', async () => {
    const determinate = render(ProgressCircle, { value: 50 });
    const indeterminate = render(ProgressCircle, {});

    expect(determinate.container.querySelector('svg')!.style.transform).toContain('-90deg');
    expect(indeterminate.container.querySelector('svg')!.style.transform).toContain('0deg');
  });

  it('merges a custom class', async () => {
    const { container } = render(ProgressCircle, { class: 'text-primary' });

    expect(rootOf(container).classList.contains('text-primary')).toBe(true);
  });
});
