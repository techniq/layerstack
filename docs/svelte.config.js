import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsx } from 'mdsx';

import { mdsxConfig } from './mdsx.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [mdsx(mdsxConfig), vitePreprocess()],

  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'alt-shift',
      toggleButtonPos: 'bottom-right',
    },
  },

  kit: {
    adapter: adapter(),
    alias: {
      $examples: 'src/examples',
      'content-collections': './.content-collections/generated',
      // Resolve workspace libraries to their *source* during dev/build so Vite compiles
      // them directly — instant HMR, no per-package build/watch. (`@layerstack/tailwind`
      // is intentionally excluded: its CSS themes are generated into `dist`, and
      // `@layerstack/docs` keeps its custom export map, so both stay dist-resolved.)
      '@layerstack/svelte-actions': '../packages/svelte-actions/src/lib',
      '@layerstack/svelte-state': '../packages/svelte-state/src/lib',
      '@layerstack/svelte-stores': '../packages/svelte-stores/src/lib',
      '@layerstack/svelte-table': '../packages/svelte-table/src/lib',
      '@layerstack/utils': '../packages/utils/src/lib',
      // `?raw` source-display aliases (kept for legacy pages)
      '$svelte-actions': '../packages/svelte-actions/src/lib',
      '$svelte-state': '../packages/svelte-state/src/lib',
      '$svelte-stores': '../packages/svelte-stores/src/lib',
      '$svelte-table': '../packages/svelte-table/src/lib',
      $tailwind: '../packages/tailwind/src/lib',
      $utils: '../packages/utils/src/lib',
    },
  },
};

export default config;
