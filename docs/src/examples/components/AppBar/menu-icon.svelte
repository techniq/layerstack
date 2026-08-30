<script lang="ts">
  import { AppBar, Button } from '@layerstack/ui';
  import { cls } from '@layerstack/tailwind';
  import { mdiViewGrid, mdiChevronRight } from '@mdi/js';
</script>

<div class="grid gap-3">
  <!-- Swap the icon -->
  <AppBar title="Custom icon" head={false} menuIcon={mdiViewGrid} />

  <!-- `null` removes it entirely -->
  <AppBar title="No icon" head={false} menuIcon={null} />

  <!-- Or replace the whole button; the snippet receives the drawer state -->
  <AppBar title="Custom button" head={false}>
    {#snippet menuIconSnippet({ toggleMenu, isMenuOpen })}
      <Button
        icon={mdiChevronRight}
        onclick={toggleMenu}
        class={cls('p-3 transition-transform', isMenuOpen && 'rotate-180')}
      />
    {/snippet}
  </AppBar>
</div>
