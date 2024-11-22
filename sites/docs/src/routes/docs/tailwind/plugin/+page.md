<script lang="ts">
	import Preview from '$docs/Preview.svelte';
</script>

<h1>Usage</h1>

```js
const colors = require('tailwindcss/colors');
const layerstack = require('@layerstack/tailwind/plugin');

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ['./src/**/*.{html,svelte}', './node_modules/svelte-ux/**/*.{svelte,js}'],
  ux: {
    // see also: https://svelte-ux.techniq.dev/customization
    themes: {
      // light mode
      light: {
        primary: colors['emerald']['600'],
        'primary-content': 'white',
        secondary: colors['blue']['500'],
        'surface-100': 'white',
        'surface-200': colors['gray']['100'],
        'surface-300': colors['gray']['300'],
        'surface-content': colors['gray']['900'],
      },
      // dark mode
      dark: {
        primary: colors['emerald']['600'],
        'primary-content': 'white',
        secondary: colors['blue']['500'],
        'surface-100': colors['zinc']['800'],
        'surface-200': colors['zinc']['900'],
        'surface-300': colors['zinc']['950'],
        'surface-content': colors['zinc']['100'],
      },
    },
  },
  plugins: [layerstack],
};

module.exports = config;
```
