import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import Icon from './Icon.svelte';

const svgPath = 'M12 2L2 7l10 5 10-5-10-5z';

const faIcon = {
  prefix: 'fas',
  iconName: 'house',
  icon: [576, 512, [], 'f015', 'M100 200L300 400'] as [number, number, string[], string, string],
};

describe('Icon (SSR)', () => {
  it('renders an svg with the given path', () => {
    const { body } = render(Icon, { props: { path: svgPath } });

    expect(body).toContain('<svg');
    expect(body).toContain(`d="${svgPath}"`);
    expect(body).toContain('viewBox="0 0 24 24"');
    expect(body).toContain('role="presentation"');
  });

  it('derives font awesome `viewBox` and size', () => {
    const { body } = render(Icon, { props: { data: faIcon } });

    expect(body).toContain('viewBox="0 0 576 512"');
    expect(body).toContain('d="M100 200L300 400"');
    expect(body).toContain('width="1.0rem"');
  });

  it('renders inline svg markup inside a span', () => {
    const { body } = render(Icon, { props: { svg: '<svg data-testid="inline"></svg>' } });

    expect(body).toContain('<span');
    expect(body).toContain('data-testid="inline"');
  });

  it('renders an accessible title', () => {
    const { body } = render(Icon, {
      props: { path: svgPath, title: 'Home', titleId: 'the-title' },
    });

    expect(body).toContain('role="img"');
    expect(body).toContain('<title id="the-title">Home</title>');
    expect(body).toContain('aria-labelledby="the-title ');
  });

  it('does not attempt to fetch `svgUrl` during SSR', () => {
    // `$effect` never runs on the server, so the span renders empty rather than throwing
    const { body } = render(Icon, { props: { svgUrl: 'https://example.test/icon.svg' } });

    expect(body).toContain('<span');
    expect(body).not.toContain('<svg data-testid');
  });
});
