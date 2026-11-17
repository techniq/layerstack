<script lang="ts">
  import { Icon } from 'svelte-ux';
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';

  const {
    smScreen,
    mdScreen,
    lgScreen,
    xlScreen,
    xxlScreen,
    screen,
    print,
    dark,
    motion,
    motionReduce,
  } = new MediaQueryPresets();

  let innerWidth = $state(0);
</script>

<div class="grid grid-cols-[auto_1fr] items-center gap-2">
  {#if smScreen.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  smScreen (640px)

  {#if mdScreen.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  mdScreen (768px)

  {#if lgScreen.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  lgScreen (1024px)

  {#if xlScreen.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  xlScreen (1280px)

  {#if xxlScreen.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  xxlScreen (1536px)

  {#if screen.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  screen

  {#if print.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  print

  {#if dark.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  dark

  {#if motion.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  motion

  {#if motionReduce.current}
    <Icon data={mdiCheckCircle} size="1rem" class="text-success" />
  {:else}
    <Icon data={mdiCloseCircle} size="1rem" class="text-danger" />
  {/if}
  motionReduce
</div>

<div class="ml-6 mt-3 text-surface-content/50 text-xs">
  current width: {innerWidth}px
</div>

<svelte:window bind:innerWidth />
