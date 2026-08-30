import { writable, type Readable } from 'svelte/store';
import { browser } from '@layerstack/utils/env';

/** Information about the currently chosen theme. */
export class CurrentTheme {
  /** The currently selected theme. If using the "system" theme this will be null. */
  theme: string | null;
  /** Whether the current theme is a light or dark theme */
  dark: boolean;

  constructor(theme: string | null, dark: boolean) {
    this.theme = theme;
    this.dark = dark;
  }

  /** The theme in use, either the selected theme or the theme chosen based on the "system" setting. */
  get resolvedTheme() {
    if (this.theme) {
      return this.theme;
    } else {
      return this.dark ? 'dark' : 'light';
    }
  }
}

export interface ThemeStore extends Readable<CurrentTheme> {
  setTheme: (themeName: string) => void;
}

export interface ThemeStoreOptions {
  light: string[];
  dark: string[];
}

export function createThemeStore(options: ThemeStoreOptions): ThemeStore {
  let store = writable<CurrentTheme>(new CurrentTheme(null, false));

  if (!browser) {
    // Stub out most of the store when running SSR.
    return {
      subscribe: store.subscribe,
      setTheme: (themeName: string) => {
        store.set(new CurrentTheme(themeName, options.dark.includes(themeName)));
      },
    };
  }

  // With no themes configured there is nothing to manage, and touching `<html>` would be actively
  // harmful — the fallback settings used outside a `settings()` provider are built this way, and
  // would otherwise strip the `dark` class the real store had just applied
  const managed = options.light.length > 0 || options.dark.length > 0;
  if (!managed) {
    return {
      subscribe: store.subscribe,
      setTheme: (themeName: string) => {
        store.set(new CurrentTheme(themeName, options.dark.includes(themeName)));
      },
    };
  }

  const isKnown = (themeName: string) =>
    options.light.includes(themeName) || options.dark.includes(themeName);

  let darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

  function resolveSystemTheme({ matches }: { matches: boolean }) {
    // Only manage dark mode (`<html class="dark">`) if there are any dark themes defined
    if (options.dark.length) {
      if (matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    store.set(new CurrentTheme(null, matches));
  }

  function setTheme(themeName: string) {
    if (themeName === 'system') {
      // Remove setting
      localStorage.removeItem('theme');
      delete document.documentElement.dataset.theme;

      resolveSystemTheme(darkMatcher);
      darkMatcher.addEventListener('change', resolveSystemTheme);
    } else {
      darkMatcher.removeEventListener('change', resolveSystemTheme);

      // Save theme to local storage, set `<html data-theme="">`, and set `<html class="dark">` if dark mode
      localStorage.theme = themeName;
      document.documentElement.dataset.theme = themeName;

      let dark = options.dark.includes(themeName);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      store.set(new CurrentTheme(themeName, dark));
    }
  }

  // Ignore a stored theme this app does not define, rather than applying a `data-theme` we cannot
  // classify as light or dark — that leaves the palette dark while `dark:` utilities stay light
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme && isKnown(savedTheme) ? savedTheme : 'system');

  return {
    subscribe: store.subscribe,
    setTheme,
  };
}
