<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';

  import { Icon } from 'svelte-ux';
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';

  import Code from '$docs/Code.svelte';
  import Preview from '$docs/Preview.svelte';

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

  let innerWidth = 0;
</script>

<h1>Usage</h1>

<Code
  source={'<' +
    `script>
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  const { mdScreen, print} = new MediaQueryPresets();
</script>

{#if mdScreen.current}
  <div>Only visible on 768px+ screens</div>
{/if}

{#if print.current}
  <div>Only visable when printing</div>
{/if}`}
  language="svelte"
/>

<h1>Examples</h1>

<Preview>
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
</Preview>

<svelte:window bind:innerWidth />
