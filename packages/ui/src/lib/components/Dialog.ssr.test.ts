import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import Dialog from './Dialog.svelte';
import Popover from './Popover.svelte';
import Menu from './Menu.svelte';
import Overlay from './Overlay.svelte';
import Backdrop from './Backdrop.svelte';

describe('Dialog (SSR)', () => {
  it('renders nothing while closed', () => {
    const { body } = render(Dialog, { props: {} });

    expect(body).not.toContain('class="Dialog');
    expect(body).not.toContain('class="Backdrop');
  });

  it('renders the dialog and backdrop when open', () => {
    const { body } = render(Dialog, { props: { open: true } });

    expect(body).toContain('class="Dialog');
    expect(body).toContain('Backdrop');
    expect(body).toContain('role="dialog"');
  });

  it('renders a loading overlay', () => {
    const { body } = render(Dialog, { props: { open: true, loading: true } });

    expect(body).toContain('Overlay');
    expect(body).toContain('ProgressCircle');
  });
});

describe('Popover (SSR)', () => {
  it('renders nothing while closed', () => {
    const { body } = render(Popover, { props: {} });

    expect(body).not.toContain('class="Popover');
  });

  it('renders when open', () => {
    const { body } = render(Popover, { props: { open: true } });

    expect(body).toContain('class="Popover');
    expect(body).toContain('tabindex="-1"');
  });
});

describe('Menu (SSR)', () => {
  it('renders nothing while closed', () => {
    const { body } = render(Menu, { props: {} });

    expect(body).not.toContain('class="Menu');
  });

  it('renders a menu element when open', () => {
    const { body } = render(Menu, { props: { open: true } });

    expect(body).toContain('Menu');
    expect(body).toContain('<menu');
  });
});

describe('Overlay and Backdrop (SSR)', () => {
  it('renders an overlay', () => {
    const { body } = render(Overlay, { props: { center: true } });

    expect(body).toContain('class="Overlay');
    expect(body).toContain('items-center');
  });

  it('renders a backdrop', () => {
    const { body } = render(Backdrop, { props: { blur: true } });

    expect(body).toContain('class="Backdrop');
    expect(body).toContain('backdrop-blur-xs');
  });
});
