import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';

// Tests run under a fixed non-zero UTC offset so bugs where local and UTC boundaries differ (day
// starts, month boundaries, ...) actually surface.  Applied to both the node processes and the
// browser context below - Chromium picks up `TZ` on macOS but ignores it on Linux (CI).
const TEST_TIMEZONE = 'Etc/GMT-5'; // UTC+5 (IANA inverts the sign)
if (process.env.VITEST) {
  process.env.TZ = TEST_TIMEZONE;
}

/** @type {import('vite').UserConfig} */
const config = defineConfig({
  plugins: [sveltekit()],
  test: {
    projects: [
      {
        // Client-side tests (Svelte components)
        extends: true,
        test: {
          name: 'client',
          browser: {
            enabled: true,
            provider: playwright({
              contextOptions: { timezoneId: TEST_TIMEZONE },
            }),
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.ssr.{test,spec}.{js,ts}'],
          setupFiles: ['./src/vitest-setup-client.ts'],
        },
      },
      {
        // SSR tests (server-side rendering)
        extends: true,
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
      {
        // Plain module tests (utils, type helpers, ...)
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
    ],
    coverage: {
      // Improved performance: only check files in `src/` instead of scanning the whole project
      include: ['src'],
    },
  },
});

export default config;
