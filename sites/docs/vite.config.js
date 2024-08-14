import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sveld } from './src/lib/plugins/vite.js';

export default defineConfig({
  plugins: [sveltekit(), sveld()],
});
