import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsx } from 'mdsx';

import { mdsxConfig } from './mdsx.config.js';
import { codePreview } from './src/lib/plugins/svelte.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  // `codePreview` retained during migration for legacy `<Preview>`-based pages; harmless otherwise.
  preprocess: [mdsx(mdsxConfig), vitePreprocess(), codePreview()],

  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'alt-shift',
      toggleButtonPos: 'bottom-right',
    },
  },

  kit: {
    adapter: adapter(),
    alias: {
      $docs: 'src/docs',
      $examples: 'src/examples',
      'content-collections': './.content-collections/generated',
      '$svelte-actions': '../../packages/svelte-actions/src/lib',
      '$svelte-state': '../../packages/svelte-state/src/lib',
      '$svelte-stores': '../../packages/svelte-stores/src/lib',
      '$svelte-table': '../../packages/svelte-table/src/lib',
      $tailwind: '../../packages/tailwind/src/lib',
      $utils: '../../packages/utils/src/lib',
    },
  },
};

export default config;
