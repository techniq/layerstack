<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { SettingsOptions } from './settingsState.svelte.js';

  export type SettingsProps = SettingsOptions & {
    /** Render `ThemeInit` to apply the stored theme before first paint */
    themeInit?: boolean;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import ThemeInit from './ThemeInit.svelte';
  import { settings as setSettings } from './settingsState.svelte.js';

  let { themeInit = true, children, ...options }: SettingsProps = $props();

  // Settings are established once, on mount
  // svelte-ignore state_referenced_locally
  setSettings(options);
</script>

{#if themeInit}
  <ThemeInit />
{/if}

{@render children?.()}
