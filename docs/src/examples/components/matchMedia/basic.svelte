<script lang="ts">
  import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
  import { Icon } from 'svelte-ux';
  import {
    smScreen,
    mdScreen,
    lgScreen,
    xlScreen,
    xxlScreen,
    screen,
    print,
    darkColorScheme,
    motionReduce,
  } from '@layerstack/svelte-stores';

  let innerWidth = 0;
</script>

<div class="grid grid-cols-[auto_1fr] items-center gap-2">
  {#if $smScreen}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $smScreen (640px)

  {#if $mdScreen}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $mdScreen (768px)

  {#if $lgScreen}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $lgScreen (1024px)

  {#if $xlScreen}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $xlScreen (1280px)

  {#if $xxlScreen}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $xxlScreen (1536px)

  {#if $screen}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $screen

  {#if $print}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $print

  {#if $darkColorScheme}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $darkColorScheme

  {#if $motionReduce}<Icon data={mdiCheckCircle} size="1rem" class="text-success" />{:else}<Icon
      data={mdiCloseCircle}
      size="1rem"
      class="text-danger"
    />{/if}
  $motionReduce
</div>

<div class="ml-6 mt-3 text-surface-content/50 text-xs">
  current width: {innerWidth}px
</div>

<svelte:window bind:innerWidth />
