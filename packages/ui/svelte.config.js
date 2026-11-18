import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  // `svelte-kit sync` generates ambient `$app/*` types used by some components.
  // No adapter is required for `svelte-package`.
  kit: {},
};

export default config;
