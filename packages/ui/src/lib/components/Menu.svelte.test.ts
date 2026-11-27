import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import PopoverHarness from './tests/PopoverHarness.svelte';
import MenuHarness from './tests/MenuHarness.svelte';
import MenuItemSettingsHarness from './tests/MenuItemSettingsHarness.svelte';

/** Popover/Menu portal their content out of the container, so query the document */
function popoverEl() {
  return document.querySelector('.Popover') as HTMLElement | null;
}
function menuEl() {
  return document.querySelector('.Menu') as HTMLElement | null;
}
function openState(container: HTMLElement) {
  return container.querySelector('[data-testid="open-state"]')!.textContent;
}

/** A full mousedown/mouseup pair — the outside-click detection requires both on the same target */
function clickOutside(target: EventTarget = document.body) {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}

describe('Popover', () => {
  it('renders nothing while closed', async () => {
    render(PopoverHarness, {});

    expect(popoverEl()).toBeNull();
  });

  it('renders content when opened', async () => {
    const { container } = render(PopoverHarness, { open: true });

    await vi.waitFor(() => {
      expect(popoverEl()).not.toBeNull();
    });
    expect(document.querySelector('[data-testid="popover-content"]')).not.toBeNull();
    expect(openState(container)).toBe('true');
  });

  it('portals out of its container', async () => {
    const { container } = render(PopoverHarness, { open: true });

    await vi.waitFor(() => expect(popoverEl()).not.toBeNull());
    expect(container.contains(popoverEl())).toBe(false);
  });

  it('positions itself against the anchor', async () => {
    render(PopoverHarness, { open: true, placement: 'bottom-start' });

    await vi.waitFor(() => {
      const el = popoverEl()!;
      expect(el.style.left).not.toBe('');
      expect(el.style.top).not.toBe('');
    });
  });

  it('closes on Escape and reports the reason', async () => {
    const onClose = vi.fn();
    const { container } = render(PopoverHarness, { open: true, onClose });

    await vi.waitFor(() => expect(popoverEl()).not.toBeNull());

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    await vi.waitFor(() => {
      expect(popoverEl()).toBeNull();
      expect(openState(container)).toBe('false');
    });
    expect(onClose).toHaveBeenCalledWith('escape');
  });

  it('closes on an outside click', async () => {
    const onClose = vi.fn();
    render(PopoverHarness, { open: true, onClose });

    await vi.waitFor(() => expect(popoverEl()).not.toBeNull());

    clickOutside();

    await vi.waitFor(() => {
      expect(onClose).toHaveBeenCalledWith('clickOutside');
      expect(popoverEl()).toBeNull();
    });
  });

  it('stays open when clicking inside', async () => {
    const onClose = vi.fn();
    render(PopoverHarness, { open: true, onClose });

    await vi.waitFor(() => expect(popoverEl()).not.toBeNull());

    const content = document.querySelector('[data-testid="popover-content"]')!;
    clickOutside(content);

    expect(onClose).not.toHaveBeenCalled();
    expect(popoverEl()).not.toBeNull();
  });

  it('closes via the `close` callback given to children', async () => {
    const { container } = render(PopoverHarness, { open: true });

    await vi.waitFor(() => expect(popoverEl()).not.toBeNull());

    (document.querySelector('[data-testid="close"]') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(openState(container)).toBe('false');
    });
  });

  it('matches the anchor width when asked', async () => {
    render(PopoverHarness, { open: true, matchWidth: true });

    await vi.waitFor(() => {
      expect(popoverEl()!.style.width).not.toBe('');
    });
  });
});

describe('Menu', () => {
  it('renders its items when open', async () => {
    render(MenuHarness, { open: true });

    await vi.waitFor(() => expect(menuEl()).not.toBeNull());

    const items = document.querySelectorAll('.MenuItem');
    expect(items).toHaveLength(3);
    expect([...items].map((i) => i.textContent?.trim())).toEqual(['One', 'Two', 'Three']);
  });

  it('closes when an item is clicked', async () => {
    const onItemClick = vi.fn();
    const onClose = vi.fn();
    const { container } = render(MenuHarness, { open: true, onItemClick, onClose });

    await vi.waitFor(() => expect(menuEl()).not.toBeNull());

    (document.querySelectorAll('.MenuItem')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(openState(container)).toBe('false');
    });
    expect(onItemClick).toHaveBeenCalledWith('Two');
    expect(onClose).toHaveBeenCalledWith('item');
  });

  it('stays open on item click with `explicitClose`', async () => {
    const { container } = render(MenuHarness, { open: true, explicitClose: true });

    await vi.waitFor(() => expect(menuEl()).not.toBeNull());

    (document.querySelectorAll('.MenuItem')[0] as HTMLButtonElement).click();

    expect(openState(container)).toBe('true');
    expect(menuEl()).not.toBeNull();
  });

  it('closes via the `close` callback given to children', async () => {
    const { container } = render(MenuHarness, { open: true, explicitClose: true });

    await vi.waitFor(() => expect(menuEl()).not.toBeNull());

    (document.querySelector('[data-testid="explicit-close"]') as HTMLButtonElement).click();

    await vi.waitFor(() => expect(openState(container)).toBe('false'));
  });

  it('moves focus into the menu by default', async () => {
    render(MenuHarness, { open: true });

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(document.querySelector('.menu-items'));
    });
  });

  it('leaves focus alone when `moveFocus` is false', async () => {
    render(MenuHarness, { open: true, moveFocus: false });

    await vi.waitFor(() => expect(menuEl()).not.toBeNull());
    expect(document.activeElement).not.toBe(document.querySelector('.menu-items'));
  });

  it('reopens after closing', async () => {
    const { container } = render(MenuHarness, {});

    const anchor = container.querySelector('[data-testid="anchor"]') as HTMLButtonElement;
    anchor.click();
    await vi.waitFor(() => expect(menuEl()).not.toBeNull());

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await vi.waitFor(() => expect(menuEl()).toBeNull());

    anchor.click();
    await vi.waitFor(() => expect(menuEl()).not.toBeNull());
  });
});

describe('MenuItem', () => {
  it('marks the selected item', async () => {
    render(MenuHarness, { open: true, selectedIndex: 1 });

    await vi.waitFor(() => expect(menuEl()).not.toBeNull());

    const items = document.querySelectorAll('.MenuItem');
    expect(items[1].className).toContain('font-semibold');
    expect(items[0].className).not.toContain('font-semibold');
  });

  it('opts its Button out of app-wide Button settings', async () => {
    const { container } = render(MenuItemSettingsHarness, {
      options: { components: { Button: { variant: 'fill', classes: 'app-button' } } },
    });

    const outside = container.querySelector('.Button:not(.MenuItem)')!;
    const inside = container.querySelector('.MenuItem')!;

    expect(outside.classList.contains('app-button')).toBe(true);
    expect(outside.className).toContain('variant-fill');

    // MenuItem sets its own `variant="none"` and clears the subtree's component settings
    expect(inside.classList.contains('app-button')).toBe(false);
    expect(inside.className).toContain('variant-none');
  });
});
