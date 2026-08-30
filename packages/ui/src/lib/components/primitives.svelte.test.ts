import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Avatar from './Avatar.svelte';
import Breadcrumb from './Breadcrumb.svelte';
import Card from './Card.svelte';
import DividerDot from './DividerDot.svelte';
import EmptyMessage from './EmptyMessage.svelte';
import Grid from './Grid.svelte';
import Header from './Header.svelte';
import Kbd from './Kbd.svelte';
import SectionDivider from './SectionDivider.svelte';
import ViewportCenter from './ViewportCenter.svelte';
import PrimitivesHarness from './tests/PrimitivesHarness.svelte';

const testId = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="${id}"]`) as HTMLElement;

describe('ViewportCenter', () => {
  it('fills the viewport and centers content', async () => {
    const { container } = render(ViewportCenter, {});

    const el = container.querySelector('.ViewportCenter')!;
    expect(el.className).toContain('h-screen');
    expect(el.className).toContain('justify-center');
  });
});

describe('DividerDot', () => {
  it('renders a bullet', async () => {
    const { container } = render(DividerDot, { class: 'custom' });

    const el = container.querySelector('.DividerDot')!;
    expect(el.textContent?.trim()).toBe('•');
    expect(el.classList.contains('custom')).toBe(true);
  });
});

describe('SectionDivider', () => {
  it('renders rules either side of its content', async () => {
    const { container } = render(SectionDivider, {});

    expect(container.querySelectorAll('.SectionDivider > div')).toHaveLength(3);
  });
});

describe('EmptyMessage', () => {
  it('renders a centered message', async () => {
    const { container } = render(EmptyMessage, { class: 'custom' });

    const el = container.querySelector('.EmptyMessage')!;
    expect(el.className).toContain('place-items-center');
    expect(el.classList.contains('custom')).toBe(true);
  });
});

describe('Kbd', () => {
  it('renders modifier keys in order', async () => {
    const { container } = render(Kbd, { control: true, option: true, shift: true, command: true });

    const abbrs = [...container.querySelectorAll('abbr')];
    expect(abbrs.map((a) => a.getAttribute('title'))).toEqual([
      'Control',
      'Option',
      'Shift',
      'Command',
    ]);
    expect(abbrs.map((a) => a.textContent)).toEqual(['⌃', '⌥', '⇧', '⌘']);
  });

  it('drops the filled styling for `variant="none"`', async () => {
    const filled = render(Kbd, {});
    const none = render(Kbd, { variant: 'none' });

    expect(filled.container.querySelector('kbd')!.className).toContain('bg-surface-200');
    expect(none.container.querySelector('kbd')!.className).not.toContain('bg-surface-200');
  });
});

describe('Avatar', () => {
  it('sizes itself', async () => {
    const { container } = render(Avatar, { size: 'lg' });

    expect(container.querySelector('.Avatar')!.className).toContain('w-14');
  });

  it('renders an icon', async () => {
    const { container } = render(Avatar, { icon: 'M0 0L1 1' });

    expect(container.querySelector('.Avatar .Icon')).not.toBeNull();
  });

  it('prefers children over the icon', async () => {
    const { container } = render(PrimitivesHarness, { kind: 'avatar-children', icon: 'M0 0L1 1' });

    expect(testId(container, 'avatar-child')).not.toBeNull();
    expect(container.querySelector('.Avatar .Icon')).toBeNull();
  });
});

describe('Grid', () => {
  it('sets grid custom properties', async () => {
    const { container } = render(Grid, { columns: 3, gap: 8, autoFlow: 'column' });

    const el = container.querySelector('.Grid') as HTMLElement;
    expect(el.style.getPropertyValue('--templateColumns')).toBe('repeat(3, 1fr)');
    expect(el.style.getPropertyValue('--gap')).toBe('8');
    expect(el.style.getPropertyValue('--autoFlow')).toBe('column');
    expect(el.classList.contains('grid')).toBe(true);
  });

  it('derives auto-fill columns from `autoColumns`', async () => {
    const { container } = render(Grid, { autoColumns: '200px' });

    expect(
      (container.querySelector('.Grid') as HTMLElement).style.getPropertyValue('--templateColumns')
    ).toBe('repeat(auto-fill, minmax(200px, 1fr))');
  });

  it('falls back to `gap` for row and column gaps', async () => {
    const { container } = render(Grid, { gap: 4, columnGap: 10 });

    const el = container.querySelector('.Grid') as HTMLElement;
    expect(el.style.getPropertyValue('--columnGap')).toBe('10');
    expect(el.style.getPropertyValue('--rowGap')).toBe('4');
  });

  it('supports inline and stacked layouts', async () => {
    const { container } = render(Grid, { inline: true, stack: true });

    const el = container.querySelector('.Grid')!;
    expect(el.classList.contains('inline-grid')).toBe(true);
    expect(el.classList.contains('grid')).toBe(false);
    expect(el.classList.contains('stack')).toBe(true);
  });
});

describe('Breadcrumb', () => {
  it('renders items with dividers between them', async () => {
    const { container } = render(Breadcrumb, { items: ['Home', 'Docs', 'Page'] });

    expect([...container.querySelectorAll('.item')].map((i) => i.textContent)).toEqual([
      'Home',
      'Docs',
      'Page',
    ]);
    expect(container.querySelectorAll('.divider')).toHaveLength(2);
  });

  it('uses a text divider when given', async () => {
    const { container } = render(Breadcrumb, { items: ['a', 'b'], divider: '/' });

    expect(container.querySelector('.divider')!.textContent).toBe('/');
  });

  it('skips null items', async () => {
    const { container } = render(Breadcrumb, { items: ['a', null, 'b'] });

    expect(container.querySelectorAll('.item')).toHaveLength(2);
    expect(container.querySelectorAll('.divider')).toHaveLength(1);
  });
});

describe('Header', () => {
  it('renders a string title and subheading', async () => {
    const { container } = render(Header, { title: 'Title', subheading: 'Sub' });

    expect(container.textContent).toContain('Title');
    expect(container.textContent).toContain('Sub');
    expect(container.querySelector('.Breadcrumb')).toBeNull();
  });

  it('renders array titles as a breadcrumb', async () => {
    const { container } = render(Header, { title: ['One', 'Two'] });

    expect(container.querySelector('.Breadcrumb')).not.toBeNull();
    expect(container.querySelectorAll('.Breadcrumb .item')).toHaveLength(2);
  });
});

describe('Card', () => {
  it('renders a header when given a title', async () => {
    const { container } = render(Card, { title: 'Card title' });

    expect(container.querySelector('.Card .Header')).not.toBeNull();
    expect(container.textContent).toContain('Card title');
  });

  it('omits the header without a title, subheading, or snippet', async () => {
    const { container } = render(Card, {});

    expect(container.querySelector('.Card .Header')).toBeNull();
  });

  it('renders the contents and actions snippets', async () => {
    const { container } = render(PrimitivesHarness, { kind: 'card-snippets' });

    expect(testId(container, 'card-children')).not.toBeNull();
    expect(testId(container, 'card-contents')).not.toBeNull();
    expect(testId(container, 'card-actions')).not.toBeNull();
  });

  it('shows a loading overlay', async () => {
    const { container } = render(Card, { loading: true });

    expect(container.querySelector('.Card .Overlay .ProgressCircle')).not.toBeNull();
  });
});

describe('Maybe', () => {
  it('renders children bare without a wrapper', async () => {
    const { container } = render(PrimitivesHarness, { kind: 'maybe', wrapper: null });

    expect(testId(container, 'maybe-child')).not.toBeNull();
    expect(container.querySelector('.wrapped')).toBeNull();
  });

  it('wraps children in the given component', async () => {
    const { container } = render(PrimitivesHarness, { kind: 'maybe', wrapper: Card });

    expect(testId(container, 'maybe-child')).not.toBeNull();
    expect(container.querySelector('.Card.wrapped')).not.toBeNull();
  });
});

describe('ScrollContainer', () => {
  it('gives children a `scrollIntoView` helper bound to the container', async () => {
    const { container } = render(PrimitivesHarness, { kind: 'scroll' });

    const el = container.querySelector('div')!;
    const spy = vi.spyOn(el, 'scrollIntoView');
    testId(container, 'scroll').click();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Toggle', () => {
  it('toggles and reports each transition', async () => {
    const onToggle = vi.fn();
    const onToggleOn = vi.fn();
    const onToggleOff = vi.fn();
    const { container } = render(PrimitivesHarness, {
      kind: 'toggle',
      onToggle,
      onToggleOn,
      onToggleOff,
    });

    expect(testId(container, 'on').textContent).toBe('false');

    testId(container, 'toggle').click();
    await vi.waitFor(() => expect(testId(container, 'on').textContent).toBe('true'));
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(onToggleOn).toHaveBeenCalledTimes(1);

    testId(container, 'toggle').click();
    await vi.waitFor(() => expect(testId(container, 'on').textContent).toBe('false'));
    expect(onToggleOff).toHaveBeenCalledTimes(1);
  });

  it('supports explicit on/off', async () => {
    const { container } = render(PrimitivesHarness, { kind: 'toggle' });

    testId(container, 'on-btn').click();
    await vi.waitFor(() => expect(testId(container, 'on').textContent).toBe('true'));

    testId(container, 'on-btn').click();
    expect(testId(container, 'on').textContent).toBe('true');

    testId(container, 'off-btn').click();
    await vi.waitFor(() => expect(testId(container, 'on').textContent).toBe('false'));
  });
});

describe('Selection', () => {
  it('toggles individual values', async () => {
    const { container } = render(PrimitivesHarness, {
      kind: 'selection',
      all: ['a', 'b', 'c'],
    });

    expect(testId(container, 'is-a').textContent).toBe('false');

    testId(container, 'toggle-a').click();
    await vi.waitFor(() => {
      expect(testId(container, 'is-a').textContent).toBe('true');
      expect(testId(container, 'selected').textContent).toBe('a');
    });
  });

  it('selects and clears all', async () => {
    const { container } = render(PrimitivesHarness, {
      kind: 'selection',
      all: ['a', 'b', 'c'],
    });

    testId(container, 'toggle-all').click();
    await vi.waitFor(() => {
      expect(testId(container, 'all-selected').textContent).toBe('true');
      expect(testId(container, 'selected').textContent).toBe('a,b,c');
    });

    testId(container, 'clear').click();
    await vi.waitFor(() => expect(testId(container, 'selected').textContent).toBe(''));
  });

  it('starts from `initial`', async () => {
    const { container } = render(PrimitivesHarness, {
      kind: 'selection',
      initial: ['b'],
      all: ['a', 'b'],
    });

    expect(testId(container, 'selected').textContent).toBe('b');
  });

  it('reports changes', async () => {
    const onChange = vi.fn();
    const { container } = render(PrimitivesHarness, {
      kind: 'selection',
      all: ['a'],
      onChange,
    });

    testId(container, 'toggle-a').click();
    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ value: ['a'] });
    });
  });
});
