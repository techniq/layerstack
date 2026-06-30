import { env } from '$env/dynamic/private';

import { getThemeNames } from '@layerstack/tailwind';
import themeCss from '@layerstack/tailwind/themes/all.css?raw';

export async function load() {
  return {
    themes: getThemeNames(themeCss),
    // themes: { light: ['light'], dark: ['dark'] },
    pr_id: env.VERCEL_GIT_PULL_REQUEST_ID,
  };
}
