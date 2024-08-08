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
      $utils: '../../packages/utils/src/lib',
    },
  },
};

export default config;
