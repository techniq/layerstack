import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    noExternal: true, // https://github.com/AdrianGonz97/refined-cf-pages-action/issues/26#issuecomment-2878397440
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
