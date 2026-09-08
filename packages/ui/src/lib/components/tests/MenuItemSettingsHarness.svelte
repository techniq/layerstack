<script lang="ts">
  import Button from '../Button.svelte';
  import MenuItem from '../MenuItem.svelte';
  import { settings, type SettingsOptions } from '../settingsState.svelte.js';

  let { options }: { options: SettingsOptions } = $props();

  // svelte-ignore state_referenced_locally
  settings(options);
</script>

<Button>Outside</Button>
<MenuItem>Inside</MenuItem>
