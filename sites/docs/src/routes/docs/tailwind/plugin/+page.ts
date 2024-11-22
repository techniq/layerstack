import source from '$tailwind/plugin.cjs?raw';
import pageSource from './+page.md?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description: 'Tailwind CSS plugiun to providing theming and additional utility classes',
      related: [
        'https://svelte-ux.techniq.dev/customization',
        'https://svelte-ux.techniq.dev/theme',
      ],
    },
  };
}
