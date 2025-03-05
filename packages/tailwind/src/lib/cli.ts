import { parseArgs } from 'node:util';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { format } from 'prettier';

import { entries } from '@layerstack/utils';
import { mapKeys } from '@layerstack/utils/object';

import {
  colorNames,
  themeStylesString,
  type NestedColors,
  type SupportedColorSpace,
} from './theme.js';
import { themes as daisyThemes } from './daisy.js';
import { themes as skeletonThemes } from './skeleton.js';

const options = {
  daisy: {
    type: 'boolean',
    short: 'd',
  },
  skeleton: {
    type: 'string',
  },
} as const;

const { values, positionals } = parseArgs({ args: process.argv, options, allowPositionals: true });

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

  return format(result.join('\n\n'), { parser: 'css' });
}

/**
 * Build themes as CSS files
 */
async function buildThemesCss(themes: NestedColors, colorSpace: SupportedColorSpace) {
  let result: string[] = [];

  let rootThemeName: string = '';
  entries(themes).map(([themeName, themeColors], index) => {
    if (index === 0) {
      // Root / default theme
      result.push(`:root { ${themeStylesString(themeColors as NestedColors, colorSpace)} }`);
      rootThemeName = themeName;
    } else if (index === 1) {
      // Dark theme
      result.push(`@media (prefers-color-scheme: dark) {
        :root { ${themeStylesString(themeColors as NestedColors, colorSpace)} }
      }`);

      // Also register first and second theme by name AFTER @media for precedence
      result.push(
        `[data-theme=${rootThemeName}] { ${themeStylesString(themes[rootThemeName] as NestedColors, colorSpace)} }`
      );
      result.push(
        `[data-theme=${themeName}] { ${themeStylesString(themeColors as NestedColors, colorSpace)} }`
      );
    } else {
      result.push(
        `[data-theme=${themeName}] { ${themeStylesString(themeColors as NestedColors, colorSpace)} }`
      );
    }
  });

  return format(result.join('\n\n'), { parser: 'css' });
}

function writeFile(filePath: string, data: string) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, data);
  console.log(`Wrote ${filePath}`);
}

const themeCss = await buildThemeCss('hsl');
writeFile(join('dist/css', 'theme.css'), themeCss);

const daisyCss = await buildThemesCss(daisyThemes, 'hsl');
writeFile('dist/css/daisy.css', daisyCss);

const skeletonCss = await buildThemesCss(skeletonThemes, 'hsl');
writeFile('dist/css/skeleton.css', skeletonCss);

const allThemes = {
  ...daisyThemes,
  ...mapKeys(skeletonThemes, (key: string) =>
    key === 'light' ? 'skeleton-light' : key === 'dark' ? 'skeleton-dark' : key
  ),
};
const allThemesCss = await buildThemesCss(allThemes, 'hsl');
writeFile('dist/css/themes.css', allThemesCss);
