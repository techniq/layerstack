import { env } from '$env/dynamic/private';

import themes from '../../themes.json' assert { type: 'json' };
import { getThemeNames } from '@layerstack/tailwind';

export async function load() {
  return {
    themes: getThemeNames(themes),
    // themes: { light: ['light'], dark: ['dark'] },
    pr_id: env.VERCEL_GIT_PULL_REQUEST_ID,
  };
}
