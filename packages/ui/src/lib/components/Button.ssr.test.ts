import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import Button from './Button.svelte';
import ButtonGroupHarness from './tests/ButtonGroupHarness.svelte';

const mdiHome = 'M12 2L2 7l10 5 10-5-10-5z';

describe('Button (SSR)', () => {
  it('renders a button element', () => {
    const { body } = render(Button, { props: {} });

    expect(body).toContain('<button');
    expect(body).toContain('type="button"');
    expect(body).toContain('class="Button');
  });

  it('renders an anchor when `href` is set', () => {
    const { body } = render(Button, { props: { href: '/somewhere' } });

    expect(body).toContain('<a');
    expect(body).toContain('href="/somewhere"');
  });

  it('marks disabled buttons', () => {
    const { body } = render(Button, { props: { disabled: true } });

    expect(body).toContain('disabled');
    expect(body).toContain('aria-disabled="true"');
  });

  it('renders the variant class', () => {
    const { body } = render(Button, { props: { variant: 'fill', color: 'primary' } });

    expect(body).toContain('variant-fill');
  });

  it('renders an icon', () => {
    const { body } = render(Button, { props: { icon: mdiHome } });

    expect(body).toContain('Icon');
    expect(body).toContain(mdiHome);
  });

  it('renders a progress circle while loading', () => {
    const { body } = render(Button, { props: { loading: true } });

    expect(body).toContain('ProgressCircle');
    expect(body).toContain('indeterminate');
  });

  it('applies group defaults through context', () => {
    const { body } = render(ButtonGroupHarness, { props: { variant: 'outline', count: 2 } });

    expect(body).toContain('role="group"');
    expect((body.match(/variant-outline/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});
