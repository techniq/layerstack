import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import LayoutHarness from './tests/LayoutHarness.svelte';

const testId = (root: ParentNode, id: string) =>
  root.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

describe('Tabs', () => {
  const options = [
    { label: 'One', value: 'a' },
    { label: 'Two', value: 'b' },
  ];

  it('renders a tab per option', async () => {
    const { container } = render(LayoutHarness, { kind: 'tabs', options, value: 'a' });

    const tabs = [...container.querySelectorAll('.Tab')];
    expect(tabs.map((t) => t.textContent?.trim())).toEqual(['One', 'Two']);
  });

  it('marks the selected tab', async () => {
    const { container } = render(LayoutHarness, { kind: 'tabs', options, value: 'b' });

    const tabs = [...container.querySelectorAll('.Tab')];
    expect(tabs[1].className).toContain('bg-surface-100');
    expect(tabs[0].className).toContain('bg-surface-200');
  });

  it('selects on click and updates the content', async () => {
    const { container } = render(LayoutHarness, { kind: 'tabs', options, value: 'a' });

    expect(testId(container, 'content')!.textContent).toContain('a');

    (container.querySelectorAll('.Tab')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(testId(container, 'value')!.textContent).toBe('b');
      expect(testId(container, 'content')!.textContent).toContain('b');
    });
  });

  it('lays out by placement', async () => {
    const { container } = render(LayoutHarness, {
      kind: 'tabs',
      options,
      value: 'a',
      placement: 'left',
    });

    const root = container.querySelector('.Tabs')!;
    expect(root.classList.contains('placement-left')).toBe(true);
    expect(root.className).toContain('flex-row');
  });
});

describe('Steps', () => {
  const data = [{ label: 'One', completed: true }, { label: 'Two' }, { label: 'Three' }];

  it('renders a step per item', async () => {
    const { container } = render(LayoutHarness, { kind: 'steps', data });

    const steps = [...container.querySelectorAll('.Step')];
    expect(steps.map((s) => s.textContent?.trim())).toEqual(['One', 'Two', 'Three']);
  });

  it('colors completed steps', async () => {
    const { container } = render(LayoutHarness, { kind: 'steps', data });

    const points = [...container.querySelectorAll('.Step > div:last-child')];
    expect(points[0].className).toContain('bg-primary');
    expect(points[1].className).not.toContain('bg-primary');
  });

  it('flows vertically when asked', async () => {
    const { container } = render(LayoutHarness, { kind: 'steps', data, vertical: true });

    expect(container.querySelector('.Steps')!.className).toContain('grid-flow-row');
    // the context propagates to each step's layout
    expect(container.querySelector('.Step')!.className).toContain('grid-cols-[40px_1fr]');
  });

  it('renders explicit children instead of `data`', async () => {
    const { container } = render(LayoutHarness, { kind: 'steps-children', data });

    const steps = [...container.querySelectorAll('.Step')];
    expect(steps.map((s) => s.textContent?.trim())).toEqual(['First', 'Second']);
  });
});

describe('Timeline', () => {
  const data = [{ start: 'A', completed: true }, { start: 'B' }, { start: 'C' }];

  it('renders an event per item', async () => {
    const { container } = render(LayoutHarness, { kind: 'timeline', data });

    expect(container.querySelectorAll('.TimelineEvent')).toHaveLength(3);
  });

  it('marks completed events', async () => {
    const { container } = render(LayoutHarness, { kind: 'timeline', data });

    const events = [...container.querySelectorAll('.TimelineEvent')];
    expect(events[0].classList.contains('timelineevent-completed')).toBe(true);
    expect(events[1].classList.contains('timelineevent-completed')).toBe(false);
  });

  it('flows vertically when asked', async () => {
    const { container } = render(LayoutHarness, { kind: 'timeline', data, vertical: true });

    expect(container.querySelector('.Timeline')!.className).toContain('flex-col');
    expect(container.querySelector('.TimelineEvent')!.className).toContain('justify-items-center');
  });

  it('shares a common icon through context', async () => {
    const { container } = render(LayoutHarness, {
      kind: 'timeline',
      data: [{ start: 'A' }],
      icon: 'M0 0L1 1',
    });

    expect(container.querySelector('.TimelineEvent .icon path')?.getAttribute('d')).toBe(
      'M0 0L1 1'
    );
  });

  it('renders explicit children instead of `data`', async () => {
    const { container } = render(LayoutHarness, { kind: 'timeline-children', data });

    expect(container.querySelectorAll('.TimelineEvent')).toHaveLength(2);
  });
});

describe('ListItem', () => {
  it('renders a title and subheading', async () => {
    const { container } = render(LayoutHarness, {
      kind: 'listitem',
      title: 'Title',
      subheading: 'Sub',
    });

    expect(container.querySelector('.ListItem')!.textContent).toContain('Title');
    expect(container.querySelector('.ListItem')!.textContent).toContain('Sub');
  });

  it('renders an icon, optionally wrapped in an avatar', async () => {
    const plain = render(LayoutHarness, { kind: 'listitem', icon: 'M0 0L1 1' });
    const withAvatar = render(LayoutHarness, { kind: 'listitem', icon: 'M0 0L1 1', avatar: true });

    expect(plain.container.querySelector('.ListItem .Icon')).not.toBeNull();
    expect(plain.container.querySelector('.ListItem .Avatar')).toBeNull();
    expect(withAvatar.container.querySelector('.ListItem .Avatar .Icon')).not.toBeNull();
  });

  it('renders the actions snippet', async () => {
    const { container } = render(LayoutHarness, { kind: 'listitem', title: 'x' });

    expect(testId(container, 'item-action')).not.toBeNull();
  });

  it('shows a loading overlay', async () => {
    const { container } = render(LayoutHarness, { kind: 'listitem', loading: true });

    expect(container.querySelector('.ListItem .Overlay .ProgressCircle')).not.toBeNull();
  });

  it('drops the background and shadow when asked', async () => {
    const { container } = render(LayoutHarness, {
      kind: 'listitem',
      noShadow: true,
      noBackground: true,
    });

    const el = container.querySelector('.ListItem')!;
    expect(el.className).not.toContain('elevation-1');
    expect(el.className).not.toContain('bg-surface-100');
  });
});

describe('Drawer', () => {
  const drawerEl = () => document.querySelector('.Drawer') as HTMLElement | null;
  const backdropEl = () => document.querySelector('.Backdrop') as HTMLElement | null;

  it('renders nothing while closed', async () => {
    render(LayoutHarness, { kind: 'drawer', open: false });

    expect(drawerEl()).toBeNull();
  });

  it('renders a drawer and backdrop when open', async () => {
    render(LayoutHarness, { kind: 'drawer', open: true });

    await vi.waitFor(() => {
      expect(drawerEl()).not.toBeNull();
      expect(backdropEl()).not.toBeNull();
    });
    expect(testId(document, 'drawer-content')).not.toBeNull();
  });

  it('positions by placement', async () => {
    render(LayoutHarness, { kind: 'drawer', open: true, placement: 'left' });

    await vi.waitFor(() => expect(drawerEl()).not.toBeNull());
    expect(drawerEl()!.className).toContain('left-0');
    expect(drawerEl()!.className).toContain('h-full');
  });

  it('closes on a backdrop click', async () => {
    const onClose = vi.fn();
    const { container } = render(LayoutHarness, { kind: 'drawer', open: true, onClose });

    await vi.waitFor(() => expect(backdropEl()).not.toBeNull());
    backdropEl()!.click();

    await vi.waitFor(() => {
      expect(testId(container, 'open-state')!.textContent).toBe('false');
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('refuses to close when persistent', async () => {
    const onCloseAttempt = vi.fn();
    const { container } = render(LayoutHarness, {
      kind: 'drawer',
      open: true,
      persistent: true,
      onCloseAttempt,
    });

    await vi.waitFor(() => expect(backdropEl()).not.toBeNull());
    backdropEl()!.click();

    expect(testId(container, 'open-state')!.textContent).toBe('true');
    expect(onCloseAttempt).toHaveBeenCalledTimes(1);
  });

  it('closes when forced', async () => {
    const { container } = render(LayoutHarness, { kind: 'drawer', open: true, persistent: true });

    await vi.waitFor(() => expect(drawerEl()).not.toBeNull());
    testId(document, 'force-close')!.click();

    await vi.waitFor(() => expect(testId(container, 'open-state')!.textContent).toBe('false'));
  });

  it('renders the actions bar', async () => {
    render(LayoutHarness, { kind: 'drawer', open: true });

    await vi.waitFor(() => expect(testId(document, 'drawer-action')).not.toBeNull());
    expect(document.querySelector('.Drawer .actions')).not.toBeNull();
  });

  it('does not fire callbacks on mount', async () => {
    const onOpen = vi.fn();
    render(LayoutHarness, { kind: 'drawer', open: true, onOpen });

    await vi.waitFor(() => expect(drawerEl()).not.toBeNull());
    expect(onOpen).not.toHaveBeenCalled();
  });
});
