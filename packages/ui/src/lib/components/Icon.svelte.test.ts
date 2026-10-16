import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Icon from './Icon.svelte';
import IconChildrenHarness from './tests/IconChildrenHarness.svelte';

/** A minimal Font Awesome `IconDefinition` (`[width, height, ligatures, unicode, path]`) */
const faIcon = {
  prefix: 'fas',
  iconName: 'house',
  icon: [576, 512, [], 'f015', 'M100 200L300 400'] as [number, number, string[], string, string],
};

const svgPath = 'M12 2L2 7l10 5 10-5-10-5z';

function svgOf(container: HTMLElement) {
  return container.querySelector('svg.Icon') as SVGSVGElement | null;
}

describe('Icon', () => {
  describe('path data', () => {
    it('renders a `path` prop as an svg path', async () => {
      const { container } = render(Icon, { path: svgPath });

      const svg = svgOf(container)!;
      expect(svg).not.toBeNull();
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect([...svg.querySelectorAll('path')].map((p) => p.getAttribute('d'))).toEqual([svgPath]);
    });

    it('renders each entry of a `path` array', async () => {
      const { container } = render(Icon, { path: [svgPath, 'M0 0L1 1'] });

      const paths = [...svgOf(container)!.querySelectorAll('path')];
      expect(paths.map((p) => p.getAttribute('d'))).toEqual([svgPath, 'M0 0L1 1']);
    });

    it('accepts a path string as `data`', async () => {
      const { container } = render(Icon, { data: svgPath });

      expect(svgOf(container)!.querySelector('path')?.getAttribute('d')).toBe(svgPath);
    });
  });

  describe('sizing', () => {
    it('defaults to `1.2em`', async () => {
      const { container } = render(Icon, { path: svgPath });

      const svg = svgOf(container)!;
      expect(svg.getAttribute('width')).toBe('1.2em');
      expect(svg.getAttribute('height')).toBe('1.2em');
    });

    it('applies `size` to both dimensions', async () => {
      const { container } = render(Icon, { path: svgPath, size: '2rem' });

      const svg = svgOf(container)!;
      expect(svg.getAttribute('width')).toBe('2rem');
      expect(svg.getAttribute('height')).toBe('2rem');
    });

    it('lets explicit `width`/`height` win over `size`', async () => {
      const { container } = render(Icon, { path: svgPath, size: '2rem', width: '10px' });

      const svg = svgOf(container)!;
      expect(svg.getAttribute('width')).toBe('10px');
      expect(svg.getAttribute('height')).toBe('2rem');
    });
  });

  describe('font awesome data', () => {
    it('derives `viewBox`, `path`, and size', async () => {
      const { container } = render(Icon, { data: faIcon });

      const svg = svgOf(container)!;
      expect(svg.getAttribute('viewBox')).toBe('0 0 576 512');
      expect(svg.querySelector('path')?.getAttribute('d')).toBe('M100 200L300 400');
      expect(svg.getAttribute('width')).toBe('1.0rem');
      expect(svg.getAttribute('height')).toBe('1.0rem');
    });

    it('still honors an explicit `width`', async () => {
      const { container } = render(Icon, { data: faIcon, width: '3em' });

      expect(svgOf(container)!.getAttribute('width')).toBe('3em');
    });
  });

  describe('inline svg', () => {
    it('renders an `svg` prop inside a span', async () => {
      const { container } = render(Icon, { svg: '<svg data-testid="inline"></svg>' });

      const span = container.querySelector('span.Icon')!;
      expect(span).not.toBeNull();
      expect(span.querySelector('[data-testid="inline"]')).not.toBeNull();
    });

    it('accepts inline svg markup as `data`', async () => {
      const { container } = render(Icon, { data: '<svg data-testid="inline"></svg>' });

      expect(container.querySelector('span.Icon [data-testid="inline"]')).not.toBeNull();
    });

    it('sizes font awesome svg markup in `rem`', async () => {
      const { container } = render(Icon, {
        svg: '<svg><!-- https://fontawesome.com license --></svg>',
      });

      const span = container.querySelector('span.Icon') as HTMLElement;
      expect(span.style.width).toBe('1rem');
      expect(span.style.height).toBe('1rem');
    });
  });

  describe('children', () => {
    it('renders children instead of `svg` markup', async () => {
      const { container } = render(IconChildrenHarness, {});

      expect(container.querySelector('span.Icon [data-testid="custom-child"]')).not.toBeNull();
    });
  });

  describe('svgUrl', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response('<svg data-testid="fetched"></svg>'))
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('fetches and renders remote svg markup', async () => {
      const { container } = render(Icon, { svgUrl: 'https://example.test/icon-a.svg' });

      await vi.waitFor(() => {
        expect(container.querySelector('span.Icon [data-testid="fetched"]')).not.toBeNull();
      });
      expect(fetch).toHaveBeenCalledWith('https://example.test/icon-a.svg');
    });

    it('accepts a url as `data`', async () => {
      const { container } = render(Icon, { data: 'https://example.test/icon-b.svg' });

      await vi.waitFor(() => {
        expect(container.querySelector('span.Icon [data-testid="fetched"]')).not.toBeNull();
      });
    });

    it('reuses the cached request across instances', async () => {
      const url = 'https://example.test/icon-cached.svg';
      render(Icon, { svgUrl: url });
      await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

      render(Icon, { svgUrl: url });
      await vi.waitFor(() => {
        expect(document.querySelectorAll('[data-testid="fetched"]').length).toBeGreaterThan(1);
      });
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('is presentational without a title or desc', async () => {
      const { container } = render(Icon, { path: svgPath });

      const svg = svgOf(container)!;
      expect(svg.getAttribute('role')).toBe('presentation');
      expect(svg.getAttribute('aria-labelledby')).toBeNull();
    });

    it('renders a title and labels the icon', async () => {
      const { container } = render(Icon, { path: svgPath, title: 'Home' });

      const svg = svgOf(container)!;
      expect(svg.getAttribute('role')).toBe('img');
      const title = svg.querySelector('title')!;
      expect(title.textContent).toBe('Home');
      expect(svg.getAttribute('aria-labelledby')).toContain(title.id);
    });

    it('renders a desc and labels the icon', async () => {
      const { container } = render(Icon, { path: svgPath, desc: 'Return home' });

      const svg = svgOf(container)!;
      const desc = svg.querySelector('desc')!;
      expect(desc.textContent).toBe('Return home');
      expect(svg.getAttribute('aria-labelledby')).toContain(desc.id);
    });

    it('honors explicit ids', async () => {
      const { container } = render(Icon, { path: svgPath, title: 'Home', titleId: 'my-title' });

      const svg = svgOf(container)!;
      expect(svg.querySelector('title')!.id).toBe('my-title');
      expect(svg.getAttribute('aria-labelledby')).toContain('my-title');
    });
  });

  describe('classes', () => {
    it('always applies the `Icon` class and merges `class`', async () => {
      const { container } = render(Icon, { path: svgPath, class: 'text-red-500' });

      const svg = svgOf(container)!;
      expect(svg.classList.contains('Icon')).toBe(true);
      expect(svg.classList.contains('text-red-500')).toBe(true);
    });

    it('applies `classes.path` per path', async () => {
      const { container } = render(Icon, {
        path: [svgPath, 'M0 0L1 1'],
        classes: { path: ['first', 'second'] },
      });

      const paths = [...svgOf(container)!.querySelectorAll('path')];
      expect(paths[0].classList.contains('first')).toBe(true);
      expect(paths[1].classList.contains('second')).toBe(true);
    });

    it('applies a single `classes.path` to every path', async () => {
      const { container } = render(Icon, {
        path: [svgPath, 'M0 0L1 1'],
        classes: { path: 'shared' },
      });

      for (const path of svgOf(container)!.querySelectorAll('path')) {
        expect(path.classList.contains('shared')).toBe(true);
      }
    });
  });

  describe('rest props', () => {
    it('forwards attributes to the svg', async () => {
      const { container } = render(Icon, { path: svgPath, 'data-foo': 'bar' });

      expect(svgOf(container)!.getAttribute('data-foo')).toBe('bar');
    });

    it('forwards click handlers', async () => {
      const onclick = vi.fn();
      const { container } = render(Icon, { path: svgPath, onclick });

      svgOf(container)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onclick).toHaveBeenCalledTimes(1);
    });
  });
});
