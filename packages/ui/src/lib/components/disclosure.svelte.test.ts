import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import DisclosureHarness from './tests/DisclosureHarness.svelte';

const testId = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

describe('Collapse', () => {
  it('is closed by default and toggles open', async () => {
    const { container } = render(DisclosureHarness, { kind: 'collapse', name: 'Trigger' });

    expect(testId(container, 'collapse-content')).toBeNull();
    expect(container.querySelector('.Collapse')!.getAttribute('aria-expanded')).toBe('false');

    (container.querySelector('.Collapse button') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(testId(container, 'collapse-content')).not.toBeNull();
      expect(container.querySelector('.Collapse')!.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('renders the trigger name and a chevron', async () => {
    const { container } = render(DisclosureHarness, { kind: 'collapse', name: 'Trigger' });

    expect(container.querySelector('.Collapse button')!.textContent).toContain('Trigger');
    expect(container.querySelector('.Collapse .Icon')).not.toBeNull();
  });

  it('rotates the chevron when open', async () => {
    const { container } = render(DisclosureHarness, { kind: 'collapse', open: true });

    expect(container.querySelector('[data-open="true"]')).not.toBeNull();
  });

  it('reports changes without firing on mount', async () => {
    const onChange = vi.fn();
    const { container } = render(DisclosureHarness, { kind: 'collapse', name: 'x', onChange });

    expect(onChange).not.toHaveBeenCalled();

    (container.querySelector('.Collapse button') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ open: true, name: 'x' });
    });
  });

  it('does not toggle when disabled', async () => {
    const { container } = render(DisclosureHarness, { kind: 'collapse', disabled: true });

    (container.querySelector('.Collapse button') as HTMLButtonElement).click();
    expect(testId(container, 'collapse-content')).toBeNull();
  });

  it('adds spacing when open with `popout`', async () => {
    const { container } = render(DisclosureHarness, { kind: 'collapse', popout: true, open: true });

    expect(container.querySelector('.Collapse')!.className).toContain('my-3');
  });

  describe('as an accordion', () => {
    it('opens only the selected panel', async () => {
      const { container } = render(DisclosureHarness, { kind: 'accordion', group: 'a' });

      await vi.waitFor(() => expect(testId(container, 'panel-a')).not.toBeNull());
      expect(testId(container, 'panel-b')).toBeNull();
      expect(testId(container, 'panel-c')).toBeNull();
    });

    it('switches panels on click', async () => {
      const { container } = render(DisclosureHarness, { kind: 'accordion', group: 'a' });

      const buttons = [...container.querySelectorAll('.Collapse button')] as HTMLButtonElement[];
      buttons[1].click();

      await vi.waitFor(() => {
        expect(testId(container, 'panel-b')).not.toBeNull();
        expect(testId(container, 'panel-a')).toBeNull();
      });
      expect(testId(container, 'group')!.textContent).toBe('b');
    });

    it('closes the open panel when clicked again', async () => {
      const { container } = render(DisclosureHarness, { kind: 'accordion', group: 'a' });

      const buttons = [...container.querySelectorAll('.Collapse button')] as HTMLButtonElement[];
      buttons[0].click();

      await vi.waitFor(() => {
        expect(testId(container, 'group')!.textContent).toBe('none');
        expect(testId(container, 'panel-a')).toBeNull();
      });
    });
  });
});

describe('ExpansionPanel', () => {
  it('hides both actions and content until expanded', async () => {
    const { container } = render(DisclosureHarness, { kind: 'expansion' });

    // `actions` renders inside the collapsible area, matching Svelte UX
    expect(testId(container, 'panel-actions')).toBeNull();
    expect(testId(container, 'panel-content')).toBeNull();
  });

  it('reveals actions and content when expanded', async () => {
    const { container } = render(DisclosureHarness, { kind: 'expansion' });

    (container.querySelector('.ExpansionPanel button') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(testId(container, 'panel-content')).not.toBeNull();
      expect(testId(container, 'panel-actions')).not.toBeNull();
    });
  });

  it('hides the chevron when disabled', async () => {
    const { container } = render(DisclosureHarness, { kind: 'expansion', disabled: true });

    const icon = container.querySelector('.ExpansionPanel button > div:last-child')!;
    expect(icon.className).toContain('hidden');
  });

  it('applies list styling for the panel group', async () => {
    const { container } = render(DisclosureHarness, { kind: 'expansion', list: 'type' });

    expect(container.querySelector('.ExpansionPanel')!.className).toContain('first-of-type:');
  });
});

describe('TreeList', () => {
  const nodes = [
    {
      name: 'root',
      level: 0,
      children: [
        { name: 'child-a', level: 1 },
        { name: 'child-b', level: 1, children: [{ name: 'grandchild', level: 2 }] },
      ],
    },
  ];

  it('renders nested lists', async () => {
    const { container } = render(DisclosureHarness, { kind: 'tree', nodes });

    const labels = [...container.querySelectorAll('.node-label')].map((n) => n.textContent);
    expect(labels).toEqual(['root', 'child-a', 'child-b', 'grandchild']);
  });

  it('records the depth on each item', async () => {
    const { container } = render(DisclosureHarness, { kind: 'tree', nodes });

    const levels = [...container.querySelectorAll('li')].map((li) => li.dataset.level);
    expect(levels).toEqual(['0', '1', '1', '2']);
  });

  it('applies class functions per node', async () => {
    const { container } = render(DisclosureHarness, {
      kind: 'tree',
      nodes,
      classes: { li: (node: any) => `level-${node.level}` },
    });

    expect(container.querySelector('li')!.classList.contains('level-0')).toBe(true);
  });
});
