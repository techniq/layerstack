<script lang="ts">
  import { ThemeState } from '@layerstack/svelte-state';

  // Read-only view of the theme this page is already using.  A `storageKey` other than the
  // default (`theme`) is used so this example never overwrites the site's own selection.
  const theme = new ThemeState({
    light: ['light'],
    dark: ['dark'],
    storageKey: 'example-theme',
  });
</script>

<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
  <dt class="font-medium">theme</dt>
  <dd class="font-mono">{theme.theme ?? 'null (system)'}</dd>

  <dt class="font-medium">dark</dt>
  <dd class="font-mono">{theme.dark}</dd>

  <dt class="font-medium">resolvedTheme</dt>
  <dd class="font-mono">{theme.resolvedTheme}</dd>
</dl>

<div class="mt-4 flex gap-2">
  {#each ['light', 'dark', 'system'] as name}
    <button class="border rounded-sm px-2 py-1" onclick={() => theme.setTheme(name)}>
      {name}
    </button>
  {/each}
</div>
