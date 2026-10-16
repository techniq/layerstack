import { browser } from '@layerstack/utils/env';

export type ThemeStateOptions = {
  /** Names of the available light themes */
  light?: string[];
  /** Names of the available dark themes */
  dark?: string[];
  /** `localStorage` key used to persist the selected theme.  Defaults to `theme` */
  storageKey?: string;
};

/**
 * State for the currently selected theme, persisted to `localStorage` and applied to
 * `<html data-theme="...">` (and `<html class="dark">` for dark themes).
 *
 * Selecting `system` follows the `prefers-color-scheme` media query.
 */
export class ThemeState {
  /** The currently selected theme.  `null` when following the system setting */
  #theme = $state<string | null>(null);
  /** Whether the current theme is a dark theme */
  #dark = $state(false);

  #light: string[];
  #darkThemes: string[];
  #storageKey: string;
  #darkMatcher: MediaQueryList | undefined;

  /** Whether any themes are configured at all.  When none are, this instance is inert */
  get #managed() {
    return this.#light.length > 0 || this.#darkThemes.length > 0;
  }

  constructor(options: ThemeStateOptions = {}) {
    this.#light = options.light ?? [];
    this.#darkThemes = options.dark ?? [];
    this.#storageKey = options.storageKey ?? 'theme';

    // With no themes configured there is nothing to manage, and touching `<html>` would be
    // actively harmful — the fallback settings used outside a `settings()` provider are built this
    // way, and would otherwise strip the `dark` class the real instance had just applied
    if (browser && this.#managed) {
      this.#darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

      const stored = localStorage.getItem(this.#storageKey);
      // Ignore a stored theme this app does not define, rather than applying a `data-theme` we
      // cannot classify as light or dark
      this.setTheme(stored && this.#isKnown(stored) ? stored : 'system');
    }
  }

  #isKnown(themeName: string) {
    return this.#light.includes(themeName) || this.#darkThemes.includes(themeName);
  }

  /** The currently selected theme.  `null` when following the system setting */
  get theme() {
    return this.#theme;
  }

  /** Whether the current theme is a dark theme */
  get dark() {
    return this.#dark;
  }

  /** The theme in use — either the selected theme, or the one resolved from the system setting */
  get resolvedTheme() {
    return this.#theme ?? (this.#dark ? 'dark' : 'light');
  }

  /** The available themes, grouped by light/dark */
  get themes() {
    return { light: this.#light, dark: this.#darkThemes };
  }

  #resolveSystemTheme = ({ matches }: { matches: boolean }) => {
    // Only manage dark mode (`<html class="dark">`) if there are any dark themes defined
    if (this.#darkThemes.length) {
      document.documentElement.classList.toggle('dark', matches);
    }

    this.#theme = null;
    this.#dark = matches;
  };

  /** Select a theme by name, or `system` to follow `prefers-color-scheme` */
  setTheme(themeName: string) {
    if (browser && !this.#managed) {
      // Inert — see the constructor
      return;
    }

    if (!browser) {
      // Stub out persistence/DOM when running SSR
      this.#theme = themeName;
      this.#dark = this.#darkThemes.includes(themeName);
      return;
    }

    if (themeName === 'system') {
      localStorage.removeItem(this.#storageKey);
      delete document.documentElement.dataset.theme;

      this.#resolveSystemTheme(this.#darkMatcher!);
      this.#darkMatcher!.addEventListener('change', this.#resolveSystemTheme);
    } else {
      this.#darkMatcher!.removeEventListener('change', this.#resolveSystemTheme);

      localStorage.setItem(this.#storageKey, themeName);
      document.documentElement.dataset.theme = themeName;

      const dark = this.#darkThemes.includes(themeName);
      document.documentElement.classList.toggle('dark', dark);

      this.#theme = themeName;
      this.#dark = dark;
    }
  }
}
