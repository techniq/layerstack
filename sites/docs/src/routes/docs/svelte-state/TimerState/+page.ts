import source from '$svelte-state/timerState.svelte.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description: 'Manage interval ticks, useful for timely updates and countdowns',
      related: ['components/Duration', 'components/ScrollingValue'],
    },
  };
}
