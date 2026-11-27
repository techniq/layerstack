import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FeedbackHarness from './tests/FeedbackHarness.svelte';

const testId = (root: ParentNode, id: string) =>
  root.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

describe('Pagination', () => {
  it('shows the default summary', async () => {
    const { container } = render(FeedbackHarness, { kind: 'pagination' });

    expect(container.querySelector('.Pagination')!.textContent).toContain('1-10 of 43');
  });

  it('advances pages with the arrows', async () => {
    const { container } = render(FeedbackHarness, { kind: 'pagination' });

    const buttons = [...container.querySelectorAll('.Pagination .Button')] as HTMLButtonElement[];
    // default `show` is prev, summary, next
    buttons[1].click();

    await vi.waitFor(() => {
      expect(testId(container, 'page')!.textContent).toBe('2');
      expect(container.querySelector('.Pagination')!.textContent).toContain('11-20 of 43');
    });
  });

  it('disables the previous arrow on the first page', async () => {
    const { container } = render(FeedbackHarness, { kind: 'pagination' });

    const buttons = [...container.querySelectorAll('.Pagination .Button')] as HTMLButtonElement[];
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(false);
  });

  it('honors the `show` order', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'pagination',
      show: ['firstPage', 'lastPage', 'actions'],
    });

    expect(container.querySelectorAll('.Pagination .Button')).toHaveLength(2);
    expect(testId(container, 'pagination-action')).not.toBeNull();
  });

  it('changes the page size', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'pagination',
      show: ['perPage'],
      perPageOptions: [10, 25],
    });

    (container.querySelector('.Pagination .Button') as HTMLButtonElement).click();

    await vi.waitFor(() => expect(document.querySelectorAll('.MenuItem').length).toBe(2));
    (document.querySelectorAll('.MenuItem')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => expect(testId(container, 'per-page')!.textContent).toBe('25'));
  });

  it('hides itself for a single page when asked', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'pagination',
      total: 5,
      perPage: 10,
      hideSinglePage: true,
    });

    expect(container.querySelector('.Pagination')).toBeNull();
  });

  it('accepts a custom format', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'pagination',
      format: (p: any) => `page ${p.page}/${p.totalPages}`,
    });

    expect(container.querySelector('.Pagination')!.textContent).toContain('page 1/5');
  });
});

describe('Notification', () => {
  it('renders a title and description', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      title: 'Saved',
      description: 'Your changes are stored',
    });

    const el = container.querySelector('.Notification')!;
    expect(el.textContent).toContain('Saved');
    expect(el.textContent).toContain('Your changes are stored');
  });

  it('renders nothing when closed', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      open: false,
      title: 'x',
    });

    expect(container.querySelector('.Notification')).toBeNull();
  });

  it('renders an action per entry and calls it', async () => {
    const undo = vi.fn();
    const dismiss = vi.fn();
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      title: 'Saved',
      actions: { Undo: undo, Dismiss: dismiss },
    });

    const buttons = [...container.querySelectorAll('.Notification .Button')] as HTMLButtonElement[];
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['Undo', 'Dismiss']);

    buttons[0].click();
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('closes when an action is clicked', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      title: 'Saved',
      actions: { Undo: () => {} },
    });

    (container.querySelector('.Notification .Button') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(container.querySelector('.Notification')).toBeNull();
    });
  });

  it('applies fill colors', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      title: 'x',
      variant: 'fill',
      color: 'success',
    });

    expect(container.querySelector('.Notification')!.className).toContain('bg-success');
  });

  it('renders a close button when asked', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      title: 'x',
      closeIcon: true,
    });

    (container.querySelector('.Notification .Button') as HTMLButtonElement).click();

    await vi.waitFor(() => expect(container.querySelector('.Notification')).toBeNull());
  });

  it('renders an icon', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'notification',
      title: 'x',
      icon: 'M0 0L1 1',
    });

    expect(container.querySelector('.Notification .Icon')).not.toBeNull();
  });
});

describe('ErrorNotification', () => {
  it('renders the title and multi-line description', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'error',
      title: 'Request failed',
      description: 'line one\nline two',
    });

    const el = container.querySelector('.Notification')!;
    expect(el.textContent).toContain('Request failed');
    expect(el.textContent).toContain('line one');
    expect(el.textContent).toContain('line two');
  });

  it('offers details only when there are any', async () => {
    const without = render(FeedbackHarness, { kind: 'error', title: 't', description: 'd' });
    const withDetails = render(FeedbackHarness, {
      kind: 'error',
      title: 't',
      description: 'd',
      stackTrace: 'at foo()',
    });

    const labels = (root: HTMLElement) =>
      [...root.querySelectorAll('.Notification .Button')].map((b) => b.textContent?.trim());

    expect(labels(without.container)).not.toContain('View Details');
    expect(labels(withDetails.container)).toContain('View Details');
  });

  it('opens a dialog with the stack trace', async () => {
    const { container } = render(FeedbackHarness, {
      kind: 'error',
      title: 't',
      description: 'd',
      message: 'Boom',
      stackTrace: 'at foo()',
    });

    const details = [...container.querySelectorAll('.Notification .Button')].find(
      (b) => b.textContent?.trim() === 'View Details'
    ) as HTMLButtonElement;
    details.click();

    await vi.waitFor(() => {
      expect(document.querySelector('.Dialog')).not.toBeNull();
    });
    expect(document.querySelector('.Dialog')!.textContent).toContain('at foo()');
    expect(document.querySelector('.Dialog')!.textContent).toContain('Boom');
    // the notification stays open behind the dialog
    expect(container.querySelector('.Notification')).not.toBeNull();
  });
});
