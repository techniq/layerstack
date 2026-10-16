<script lang="ts">
  import { QuickSearch } from '@layerstack/ui';

  const options = [
    { label: 'Dashboard', value: '/dashboard' },
    { label: 'Settings', value: '/settings' },
  ];

  let open = $state(false);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<QuickSearch {options} bind:open />

<div class="mt-3 text-sm text-surface-content/70">Press ⌘K / Ctrl+K</div>
