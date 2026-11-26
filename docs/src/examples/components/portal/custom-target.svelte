<script lang="ts">
  import { Button, Toggle } from 'svelte-ux';
  import { portal } from '@layerstack/svelte-actions';
</script>

<Toggle let:on={enabled} let:toggleOn let:toggleOff>
  <div class="relative">
    <Button on:click={toggleOn} class="border mt-4">
      Move to <code>.custom-portal-target</code>
    </Button>
    <div
      use:portal={{ enabled, target: '.custom-portal-target' }}
      class="absolute top-1/2 left-1/2 shadow bg-surface-100 p-4 -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <div>Portal content</div>
      {#if enabled}
        <Button on:click={toggleOff} class="border mt-4">Move back to parent</Button>
      {/if}
    </div>
  </div>
  <div class="custom-portal-target relative h-32 bg-surface-200 mt-4"></div>
</Toggle>
