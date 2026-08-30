<script lang="ts">
  import Button from '../Button.svelte';
  import { settings, type SettingsOptions } from '../settingsState.svelte.js';

  let { options, ...props }: { options: SettingsOptions } & Record<string, any> = $props();

  // Settings are established once on mount, which is exactly what this harness wants
  // svelte-ignore state_referenced_locally
  settings(options);
</script>

<Button {...props}>Labelled</Button>
