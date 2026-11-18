// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeState } from './themeState.svelte.js';

/**
 * Controllable `prefers-color-scheme` stub.  happy-dom's `matchMedia` has no way to flip the
 * system preference or dispatch `change`, which is exactly what `ThemeState` reacts to.
 */
function stubDarkMatcher(initialMatches = false) {
  const listeners = new Set<(e: { matches: boolean }) => void>();
  const matcher = {
    matches: initialMatches,
    addEventListener: (_type: string, listener: (e: { matches: boolean }) => void) =>
      listeners.add(listener),
    removeEventListener: (_type: string, listener: (e: { matches: boolean }) => void) =>
      listeners.delete(listener),
  };

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => matcher)
  );

  return {
    matcher,
    /** Simulate the OS switching between light and dark */
    set(matches: boolean) {
      matcher.matches = matches;
      for (const listener of listeners) listener({ matches });
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

const options = { light: ['light', 'daisy'], dark: ['dark', 'midnight'] };

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.classList.remove('dark');
  vi.unstubAllGlobals();
});

describe('ThemeState', () => {
  it('follows the system preference when nothing is persisted', () => {
    const system = stubDarkMatcher(true);
    const theme = new ThemeState(options);

    expect(theme.theme).toBe(null);
    expect(theme.dark).toBe(true);
    expect(theme.resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe(null);
    expect(system.listenerCount).toBe(1);
  });

  it('reacts to the system preference changing while on `system`', () => {
    const system = stubDarkMatcher(false);
    const theme = new ThemeState(options);

    expect(theme.resolvedTheme).toBe('light');

    system.set(true);
    expect(theme.dark).toBe(true);
    expect(theme.resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    system.set(false);
    expect(theme.dark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restores the persisted theme', () => {
    stubDarkMatcher(false);
    localStorage.setItem('theme', 'midnight');

    const theme = new ThemeState(options);

    expect(theme.theme).toBe('midnight');
    expect(theme.dark).toBe(true);
    expect(theme.resolvedTheme).toBe('midnight');
    expect(document.documentElement.dataset.theme).toBe('midnight');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies and persists an explicitly selected theme', () => {
    stubDarkMatcher(false);
    const theme = new ThemeState(options);

    theme.setTheme('dark');
    expect(theme.theme).toBe('dark');
    expect(theme.dark).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    theme.setTheme('daisy');
    expect(theme.dark).toBe(false);
    expect(document.documentElement.dataset.theme).toBe('daisy');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('stops following the system preference once a theme is selected', () => {
    const system = stubDarkMatcher(false);
    const theme = new ThemeState(options);
    expect(system.listenerCount).toBe(1);

    theme.setTheme('light');
    expect(system.listenerCount).toBe(0);

    system.set(true);
    expect(theme.theme).toBe('light');
    expect(theme.dark).toBe(false);
  });

  it('returns to the system preference via `system`', () => {
    const system = stubDarkMatcher(true);
    const theme = new ThemeState(options);

    theme.setTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');

    theme.setTheme('system');
    expect(theme.theme).toBe(null);
    expect(theme.dark).toBe(true);
    expect(localStorage.getItem('theme')).toBe(null);
    expect(document.documentElement.dataset.theme).toBe(undefined);
    expect(system.listenerCount).toBe(1);
  });

  it('leaves the `dark` class alone on `system` when no dark themes are configured', () => {
    stubDarkMatcher(true);
    const theme = new ThemeState({ light: ['light'] });

    expect(theme.dark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('honors a custom `storageKey`', () => {
    stubDarkMatcher(false);
    const theme = new ThemeState({ ...options, storageKey: 'ui-theme' });

    theme.setTheme('dark');
    expect(localStorage.getItem('ui-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe(null);
  });

  it('exposes the configured themes', () => {
    stubDarkMatcher(false);
    const theme = new ThemeState(options);
    expect(theme.themes).toEqual({ light: ['light', 'daisy'], dark: ['dark', 'midnight'] });
  });
});

describe('ThemeState with no themes configured', () => {
  it('leaves the document alone', () => {
    stubDarkMatcher(true);
    // The real instance has already applied the app's theme
    document.documentElement.dataset.theme = 'midnight';
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'midnight');

    // This is how the fallback settings used outside a `settings()` provider are built.  It must
    // not stomp on what the real instance applied.
    new ThemeState({ light: [], dark: [] });

    expect(document.documentElement.dataset.theme).toBe('midnight');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('midnight');
  });

  it('ignores `setTheme` rather than writing a half-applied theme', () => {
    stubDarkMatcher(true);
    document.documentElement.classList.add('dark');

    const theme = new ThemeState({ light: [], dark: [] });
    theme.setTheme('dark');

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

describe('ThemeState with an unrecognized stored theme', () => {
  it('falls back to the system setting', () => {
    stubDarkMatcher(true);
    localStorage.setItem('theme', 'a-theme-this-app-no-longer-defines');

    const theme = new ThemeState(options);

    // Applying it would set a `data-theme` that cannot be classified as light or dark — a dark
    // palette with the `dark` class absent, or the reverse
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(theme.theme).toBe(null);
    expect(theme.dark).toBe(true);
  });

  it('still applies a theme the app does define', () => {
    stubDarkMatcher(false);
    localStorage.setItem('theme', 'midnight');

    const theme = new ThemeState(options);

    expect(document.documentElement.dataset.theme).toBe('midnight');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(theme.dark).toBe(true);
  });
});
