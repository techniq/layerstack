import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import DialogHarness from './tests/DialogHarness.svelte';

/** Dialog portals to `<body>` by default, so query the document */
function dialogEl() {
  return document.querySelector('.Dialog') as HTMLElement | null;
}
function backdropEl() {
  return document.querySelector('.Backdrop') as HTMLElement | null;
}
function openState(container: HTMLElement) {
  return container.querySelector('[data-testid="open-state"]')!.textContent;
}
const byTestId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;

describe('Dialog', () => {
  it('renders nothing while closed', async () => {
    render(DialogHarness, {});

    expect(dialogEl()).toBeNull();
    expect(backdropEl()).toBeNull();
  });

  it('renders a dialog and backdrop when open', async () => {
    render(DialogHarness, { open: true });

    await vi.waitFor(() => {
      expect(dialogEl()).not.toBeNull();
      expect(backdropEl()).not.toBeNull();
    });
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(byTestId('content').textContent).toContain('Body content');
  });

  it('portals out of its container', async () => {
    const { container } = render(DialogHarness, { open: true });

    await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
    expect(container.contains(dialogEl())).toBe(false);
  });

  it('passes the context to snippets', async () => {
    render(DialogHarness, { open: true });

    await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
    expect(byTestId('content').textContent).toContain('open: true');
  });

  it('renders the title in the default header wrapper', async () => {
    render(DialogHarness, { open: true });

    await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
    expect(dialogEl()!.textContent).toContain('Dialog title');
  });

  it('lets `header` replace the default title wrapper', async () => {
    render(DialogHarness, { open: true, withHeader: true });

    await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
    expect(byTestId('custom-header')).not.toBeNull();
    expect(dialogEl()!.textContent).not.toContain('Dialog title');
  });

  describe('closing', () => {
    it('closes on a backdrop click', async () => {
      const onClose = vi.fn();
      const { container } = render(DialogHarness, { open: true, onClose });

      await vi.waitFor(() => expect(backdropEl()).not.toBeNull());
      backdropEl()!.click();

      await vi.waitFor(() => {
        expect(openState(container)).toBe('false');
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape', async () => {
      const { container } = render(DialogHarness, { open: true });

      await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
      dialogEl()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      await vi.waitFor(() => expect(openState(container)).toBe('false'));
    });

    it('closes when an action is clicked', async () => {
      const { container } = render(DialogHarness, { open: true });

      await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
      byTestId('action-cancel').click();

      await vi.waitFor(() => expect(openState(container)).toBe('false'));
    });

    it('lets an action opt out with `stopPropagation`', async () => {
      const { container } = render(DialogHarness, { open: true });

      await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
      byTestId('action-stop').click();

      expect(openState(container)).toBe('true');
    });

    it('does not close when clicking the actions container itself', async () => {
      const { container } = render(DialogHarness, { open: true });

      await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
      (document.querySelector('.actions') as HTMLElement).click();

      expect(openState(container)).toBe('true');
    });
  });

  describe('persistent', () => {
    it('refuses to close and reports the attempt', async () => {
      const onCloseAttempt = vi.fn();
      const { container } = render(DialogHarness, { open: true, persistent: true, onCloseAttempt });

      await vi.waitFor(() => expect(backdropEl()).not.toBeNull());
      backdropEl()!.click();

      expect(openState(container)).toBe('true');
      expect(onCloseAttempt).toHaveBeenCalledTimes(1);
    });

    it('closes when forced', async () => {
      const { container } = render(DialogHarness, { open: true, persistent: true });

      await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
      byTestId('force-close').click();

      await vi.waitFor(() => expect(openState(container)).toBe('false'));
    });
  });

  describe('lifecycle callbacks', () => {
    it('calls `onOpen` when opened', async () => {
      const onOpen = vi.fn();
      const { container } = render(DialogHarness, { onOpen });

      expect(onOpen).not.toHaveBeenCalled();

      (container.querySelector('[data-testid="trigger"]') as HTMLButtonElement).click();

      await vi.waitFor(() => {
        expect(onOpen).toHaveBeenCalledTimes(1);
      });
    });

    it('does not fire callbacks on mount', async () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      render(DialogHarness, { open: true, onOpen, onClose });

      await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('moves focus into the dialog and restores it on close', async () => {
    const { container } = render(DialogHarness, {});

    const trigger = container.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    trigger.focus();
    trigger.click();

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(document.querySelector('[role="dialog"]'));
    });

    byTestId('force-close').click();

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });

  it('shows a loading overlay', async () => {
    render(DialogHarness, { open: true, loading: true });

    await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
    expect(document.querySelector('.Overlay')).not.toBeNull();
    expect(document.querySelector('.Overlay .ProgressCircle')).not.toBeNull();
  });

  it('applies `classes` per part', async () => {
    render(DialogHarness, {
      open: true,
      classes: {
        root: 'root-c',
        dialog: 'dialog-c',
        title: 'title-c',
        actions: 'actions-c',
        backdrop: 'backdrop-c',
      },
    });

    await vi.waitFor(() => expect(dialogEl()).not.toBeNull());
    expect(dialogEl()!.classList.contains('root-c')).toBe(true);
    expect(document.querySelector('.dialog')!.classList.contains('dialog-c')).toBe(true);
    expect(document.querySelector('.actions')!.classList.contains('actions-c')).toBe(true);
    expect(backdropEl()!.classList.contains('backdrop-c')).toBe(true);
  });
});
