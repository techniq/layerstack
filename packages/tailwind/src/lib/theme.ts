import { range } from 'd3-array';

export const semanticColors = ['primary', 'secondary', 'accent', 'neutral'] as const;
export const stateColors = ['info', 'success', 'warning', 'danger'] as const;
export const colors = [...semanticColors, ...stateColors];
export const shades = [50, ...range(100, 1000, 100)];

/**
 * Get themes names from css file (`[data-theme="..."]`) split into `light` and `dark` collections determined by `color-scheme` property
 */
export function getThemeNames(cssContent: string) {
  const themeBlocks = cssContent.split(/\[data-theme=/);

  const light = [];
  const dark = [];

  // Skip first element as it's content before first theme
  for (let i = 1; i < themeBlocks.length; i++) {
    const block = themeBlocks[i];

    // Extract theme name
    const nameMatch = block.match(/^"([^"]+)"/);
    if (!nameMatch) continue;
    const themeName = nameMatch[1];

    if (block.includes('color-scheme: dark')) {
      dark.push(themeName);
    } else {
      light.push(themeName);
    }
  }

  return { light, dark };
}

/**
 * Apply the stored theme (or the system preference) to `<html>`.
 *
 * Sets `data-theme` for an explicitly chosen theme and toggles the `dark` class, which is what
 * drives the `dark:` variant for an explicit selection.  The system case needs no class — the
 * palettes and the `dark:` variant both follow `prefers-color-scheme` on their own.
 */
export function applyInitialTheme(darkThemes: string[]) {
  const theme = localStorage.getItem('theme');
  // Ignore if no dark themes are registered (default 'dark' removed)
  if (darkThemes.length > 0) {
    if (theme) {
      document.documentElement.dataset.theme = theme;
      document.documentElement.classList.toggle('dark', darkThemes.includes(theme));
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
}

/**
 * Return a script tag that applies the stored theme before anything renders, avoiding a flash of
 * the wrong theme when SSR is in use.
 *
 * The function is serialized rather than referenced so `darkThemes` can be baked into it.
 *
 * Note this only runs when the markup is served by the server.  Injected client-side — through
 * `{@html}` in `<svelte:head>` on a `ssr = false` app, say — the browser will not execute it, so
 * call `applyInitialTheme` directly there instead.
 */
export function createHeadSnippet(darkThemes: string[]) {
  const source = `(${applyInitialTheme.toString()})`;
  const darkThemeList = darkThemes.map((theme) => `'${theme}'`).join(', ');

  return `<script>${source}([${darkThemeList}])<\/script>`;
}
