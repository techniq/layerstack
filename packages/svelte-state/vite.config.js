import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  // Required to compile runes in `*.svelte.ts` modules (ex. `TimerState`, `ThemeState`)
  plugins: [svelte()],
  resolve: {
    // Use svelte's client runtime so `$state` is reactive under the `happy-dom` environment
    conditions: ['browser'],
  },
  test: {
    include: ['src/**/*.{test,test.svelte,spec}.{js,ts}'],
  },
});
