import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sveld } from './src/lib/plugins/vite.js';

export default defineConfig({
  plugins: [sveltekit(), sveld()],
  resolve: {
    noExternal: true, // https://github.com/AdrianGonz97/refined-cf-pages-action/issues/26#issuecomment-2878397440
  },
});
