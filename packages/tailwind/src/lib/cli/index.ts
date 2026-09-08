import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { format, resolveConfig } from 'prettier';

import { entries } from '@layerstack/utils';
import { mapKeys } from '@layerstack/utils/object';

import { colorNames, themeStylesString, type Colors, type SupportedColorSpace } from './utils.js';
import { themes as daisyThemes } from './daisy.js';
import { themes as skeletonThemes } from './skeleton.js';
import { getThemeNames } from '../theme.js';

/**
 * Build theme CSS variables
 */
function buildThemeCss(colorSpace: SupportedColorSpace) {
  let result: string[] = [];

  result.push('@theme {');

  // Register theme colors variables with placeholder values
  colorNames.forEach((color) => {
    result.push(`--color-${color}: ${colorSpace}(0 0 0);`);
  });

  result.push('}');

  return format(result.join('\n'), { parser: 'css' });
}

/**
 * Build themes as CSS files
 */
async function buildThemesCss(themes: Record<string, Colors>, colorSpace: SupportedColorSpace) {
  let result: string[] = [];

  let rootThemeName: string = '';
  entries(themes).map(([themeName, themeColors], index) => {
    if (index === 0) {
      // Root / default theme
      result.push(`:root { ${themeStylesString(themeColors, colorSpace)} }`);
      rootThemeName = themeName;
    } else if (index === 1) {
      // Dark theme
      result.push(`@media (prefers-color-scheme: dark) {
        :root { ${themeStylesString(themeColors, colorSpace)} }
      }`);

      // Also register first and second theme by name AFTER @media for precedence
      result.push(
        `[data-theme=${rootThemeName}] { ${themeStylesString(themes[rootThemeName], colorSpace)} }`
      );
      result.push(`[data-theme=${themeName}] { ${themeStylesString(themeColors, colorSpace)} }`);
    } else {
      result.push(`[data-theme=${themeName}] { ${themeStylesString(themeColors, colorSpace)} }`);
    }
  });

  return format(result.join('\n\n'), { parser: 'css' });
}

function writeFile(filePath: string, data: string) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, data);
  console.log(`Wrote ${filePath}`);
}

const daisyCss = await buildThemesCss(daisyThemes, 'hsl');
writeFile('src/lib/css/themes/generated/daisy.css', daisyCss);

const skeletonCss = await buildThemesCss(skeletonThemes, 'hsl');
writeFile('src/lib/css/themes/generated/skeleton.css', skeletonCss);

const allThemes = {
  ...daisyThemes,
  ...mapKeys(skeletonThemes, (key: string) =>
    key === 'light' ? 'skeleton-light' : key === 'dark' ? 'skeleton-dark' : key
  ),
};
const allThemesCss = await buildThemesCss(allThemes, 'hsl');
writeFile('src/lib/css/themes/generated/all.css', allThemesCss);

/*
  Derive the `dark:` variant from the themes themselves.

  A theme declares its own darkness with `color-scheme: dark`, so that is the one source of truth.
  Keying the variant on `<html class="dark">` alone means any bug that sets `data-theme` without the
  class — or the window before JS runs at all — renders a dark palette with light `dark:` utilities
  on top.  Listing the dark themes here makes the two impossible to desync.
*/
const basicCss = readFileSync('src/lib/css/themes/basic.css', 'utf-8');
const darkThemes = [
  ...new Set([...getThemeNames(allThemesCss).dark, ...getThemeNames(basicCss).dark]),
].sort();

const darkSelectors = [
  '.dark',
  '.dark *',
  ...darkThemes.flatMap((theme) => [`[data-theme='${theme}']`, `[data-theme='${theme}'] *`]),
].join(',\n      ');

const darkVariant = `@custom-variant dark {
  /* An explicit selection — the class, or a theme that declares itself dark */
  &:where(
      ${darkSelectors}
    ) {
    @slot;
  }

  /* Otherwise follow the system, exactly as the palettes on \`:root\` do */
  @media (prefers-color-scheme: dark) {
    &:where(html:not([data-theme]), html:not([data-theme]) *) {
      @slot;
    }
  }
}`;

const corePath = 'src/lib/css/core.css';
const coreCss = readFileSync(corePath, 'utf-8');
const START = '/* @generated dark-variant — see cli/index.ts */';
const END = '/* @end generated dark-variant */';
const startIndex = coreCss.indexOf(START);
const endIndex = coreCss.indexOf(END);
if (startIndex === -1 || endIndex === -1) {
  throw new Error(`Missing generated dark-variant markers in ${corePath}`);
}
// Format with the repo's own prettier config, so the rewritten file still passes `pnpm lint`
const prettierConfig = await resolveConfig(corePath);
writeFile(
  corePath,
  await format(
    coreCss.slice(0, startIndex + START.length) +
      '\n' +
      darkVariant +
      '\n' +
      coreCss.slice(endIndex),
    { ...prettierConfig, parser: 'css' }
  )
);
