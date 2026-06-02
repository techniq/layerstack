<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Toggle } from 'svelte-ux';
  import { intersection } from '@layerstack/svelte-actions';
</script>

<Toggle let:on={showHeader} let:toggleOn let:toggleOff>
  <div class="relative overflow-hidden">
    {#if showHeader}
      <div
        class="absolute top-0 left-0 bg-primary text-primary-content p-4 w-full"
        transition:fly={{ y: '-100%', opacity: 1 }}
      >
        Header
      </div>
    {/if}
    <div class="h-[200px] overflow-auto">
      {#each { length: 10 } as _}
        <div>Scroll down</div>
      {/each}
      <div
        use:intersection={{ threshold: 1 }}
        on:intersecting={(e) => {
          if (e.detail.isIntersecting) {
            // Visible
            toggleOff();
          } else {
            if (e.detail.boundingClientRect.top < (e.detail.rootBounds?.top ?? 0)) {
              // Scrolled off top
              toggleOn();
            } else {
              // Scrolled off bottom
            }
          }
        }}
      >
        Watch me scroll away
      </div>
      {#each { length: 10 } as _}
        <div>Scroll up</div>
      {/each}
    </div>
  </div>
</Toggle>
