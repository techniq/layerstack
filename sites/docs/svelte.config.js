import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

import mdsvexConfig from './mdsvex.config.js';
import { codePreview } from './src/lib/plugins/svelte.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [mdsvex(mdsvexConfig), vitePreprocess(), codePreview()],

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
      '$svelte-actions': '../../packages/svelte-actions/src/lib',
      '$svelte-stores': '../../packages/svelte-stores/src/lib',
      '$svelte-table': '../../packages/svelte-table/src/lib',
      $utils: '../../packages/utils/src/lib',
    },
  },
};

export default config;
