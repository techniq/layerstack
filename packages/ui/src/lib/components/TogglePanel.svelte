<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type TogglePanelProps = {
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { untrack } from 'svelte';

  import { getToggleGroup } from './ToggleGroup.svelte';

  let { children }: TogglePanelProps = $props();

  const group = getToggleGroup();

  let panelElement = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!panelElement) return;
    const el = panelElement;
    // See `ToggleOption` — `untrack` avoids a register/unregister loop
    untrack(() => group.registerPanel(el));
    return () => untrack(() => group.unregisterPanel(el));
  });

  const selected = $derived(group.selectedPanel === panelElement);
</script>

<!-- The wrapper is always present so it can register with the group; only its contents toggle -->
<div bind:this={panelElement} class="TogglePanel" hidden={!selected}>
  {#if selected}
    {@render children?.()}
  {/if}
</div>
