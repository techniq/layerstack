import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit() /*, sveld()*/],
  resolve: {
    noExternal: true, // https://github.com/AdrianGonz97/refined-cf-pages-action/issues/26#issuecomment-2878397440
  },
});
