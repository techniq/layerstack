import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import contentCollections from '@content-collections/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), contentCollections(), Icons({ compiler: 'svelte' })],
  resolve: {
    noExternal: true, // https://github.com/AdrianGonz97/refined-cf-pages-action/issues/26#issuecomment-2878397440
  },
  server: {
    fs: {
      // Allow serving the generated `live` code-block components (```svelte live)
      allow: ['.live-code'],
    },
  },
});
