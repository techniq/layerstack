import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ThemeHarness from './tests/ThemeHarness.svelte';

const testId = (id: string) =>
  document.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.classList.remove('dark');
});

describe('ThemeSwitch', () => {
  it('sets the theme when toggled', async () => {
    const onThemeSet = vi.fn();
    const { container } = render(ThemeHarness, {
      kind: 'theme-switch',
      options: { themes: { light: ['light'], dark: ['dark'] } },
      onThemeSet,
    });

    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await vi.waitFor(() => {
      expect(onThemeSet).toHaveBeenCalledWith({ theme: 'dark' });
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  it('renders both mode icons', async () => {
    const { container } = render(ThemeHarness, {
      kind: 'theme-switch',
      options: { themes: { light: ['light'], dark: ['dark'] } },
    });

    expect(container.querySelectorAll('.Switch .Icon')).toHaveLength(2);
  });
});

describe('ThemeSelect', () => {
  const singleThemeOptions = { themes: { light: ['light'], dark: ['dark'] } };
  const multiThemeOptions = {
    themes: { light: ['light', 'daisy'], dark: ['dark', 'midnight'] },
  };

  it('offers light/dark/system when there is one theme per scheme', async () => {
    const { container } = render(ThemeHarness, {
      kind: 'theme-select',
      options: singleThemeOptions,
    });

    (container.querySelector('.ThemeSelect') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      const items = [...document.querySelectorAll('.MenuItem')].map((i) => i.textContent?.trim());
      expect(items).toEqual(['Light', 'Dark', 'System']);
    });
  });

  it('sets the theme from the menu', async () => {
    const onThemeSet = vi.fn();
    const { container } = render(ThemeHarness, {
      kind: 'theme-select',
      options: singleThemeOptions,
      onThemeSet,
    });

    (container.querySelector('.ThemeSelect') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(document.querySelectorAll('.MenuItem').length).toBe(3));

    (document.querySelectorAll('.MenuItem')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(onThemeSet).toHaveBeenCalledWith({ theme: 'dark' });
    });
  });

  it('offers a theme picker when a scheme has several themes', async () => {
    const { container } = render(ThemeHarness, {
      kind: 'theme-select',
      options: multiThemeOptions,
    });

    (container.querySelector('.ThemeSelect') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      // one item per light theme, plus the mode switch
      expect(document.querySelector('#switch-color-scheme')).not.toBeNull();
    });
    const items = [...document.querySelectorAll('.MenuItem')].map((i) => i.textContent?.trim());
    expect(items).toEqual(['light', 'daisy']);
  });

  it('shows keyboard shortcuts when enabled', async () => {
    const { container } = render(ThemeHarness, {
      kind: 'theme-select',
      options: multiThemeOptions,
      keyboardShortcuts: true,
    });

    (container.querySelector('.ThemeSelect') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Toggle scheme:');
    });
    expect(document.querySelectorAll('kbd').length).toBeGreaterThan(0);
  });

  it('toggles the scheme with Ctrl+T', async () => {
    const onThemeSet = vi.fn();
    render(ThemeHarness, {
      kind: 'theme-select',
      options: multiThemeOptions,
      keyboardShortcuts: true,
      onThemeSet,
    });

    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyT', ctrlKey: true, bubbles: true })
    );

    await vi.waitFor(() => expect(onThemeSet).toHaveBeenCalledWith({ theme: 'dark' }));
  });

  it('ignores shortcuts when disabled', async () => {
    const onThemeSet = vi.fn();
    render(ThemeHarness, { kind: 'theme-select', options: multiThemeOptions, onThemeSet });

    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyT', ctrlKey: true, bubbles: true })
    );

    expect(onThemeSet).not.toHaveBeenCalled();
  });
});

describe('LanguageSelect', () => {
  it('shows the current locale code', async () => {
    const { container } = render(ThemeHarness, {
      kind: 'language',
      options: { forceLocale: 'fr' },
    });

    expect(container.querySelector('.LanguageSelect')!.textContent).toContain('fr');
  });

  it('lists the languages and sets the locale', async () => {
    const onLanguageSet = vi.fn();
    const { container } = render(ThemeHarness, {
      kind: 'language',
      options: { forceLocale: 'en' },
      onLanguageSet,
    });

    (container.querySelector('.LanguageSelect') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.MenuItem').length).toBe(2);
    });

    (document.querySelectorAll('.MenuItem')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(onLanguageSet).toHaveBeenCalledWith(expect.objectContaining({ code: 'fr' }));
    });
  });
});

describe('Tooltip', () => {
  it('renders its trigger without a tooltip initially', async () => {
    render(ThemeHarness, { kind: 'tooltip', title: 'Help text' });

    expect(testId('trigger')).not.toBeNull();
    expect(document.querySelector('.Tooltip')).toBeNull();
  });

  it('shows immediately with no delay', async () => {
    const { container } = render(ThemeHarness, { kind: 'tooltip', title: 'Help text', delay: 0 });

    (container.querySelector('.contents') as HTMLElement).dispatchEvent(
      new MouseEvent('mouseenter')
    );

    await vi.waitFor(() => {
      expect(document.querySelector('.Tooltip')).not.toBeNull();
      expect(document.querySelector('.Tooltip')!.textContent).toContain('Help text');
    });
  });

  it('hides on mouse leave', async () => {
    const { container } = render(ThemeHarness, { kind: 'tooltip', title: 'Help', delay: 0 });

    const trigger = container.querySelector('.contents') as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await vi.waitFor(() => expect(document.querySelector('.Tooltip')).not.toBeNull());

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    await vi.waitFor(() => expect(document.querySelector('.Tooltip')).toBeNull());
  });

  it('renders nothing when disabled', async () => {
    const { container } = render(ThemeHarness, {
      kind: 'tooltip',
      title: 'Help',
      delay: 0,
      enabled: false,
    });

    (container.querySelector('.contents') as HTMLElement).dispatchEvent(
      new MouseEvent('mouseenter')
    );

    expect(document.querySelector('.Tooltip')).toBeNull();
  });

  it('renders nothing without a title', async () => {
    const { container } = render(ThemeHarness, { kind: 'tooltip', delay: 0 });

    (container.querySelector('.contents') as HTMLElement).dispatchEvent(
      new MouseEvent('mouseenter')
    );

    expect(document.querySelector('.Tooltip')).toBeNull();
  });

  it('wraps the trigger when styling is requested', async () => {
    const { container } = render(ThemeHarness, { kind: 'tooltip', title: 'Help', underline: true });

    const span = container.querySelector('.contents > span')!;
    expect(span.className).toContain('border-dotted');
  });
});
