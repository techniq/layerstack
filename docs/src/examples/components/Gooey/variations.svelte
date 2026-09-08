<script lang="ts">
  import { Gooey } from '@layerstack/ui';
  import { blur } from 'svelte/transition';
  import { circIn, circOut } from 'svelte/easing';
  import { TimerState } from '@layerstack/svelte-state';

  const words = ['Why', 'is', 'this', 'so', 'satisfying', 'to', 'watch?'];
  const emoji = ['🚀', '🍩', '🍔', '🥨', '🥓'];

  const timer = new TimerState({ initial: 0, delay: 1200, tick: (c) => (c ?? 0) + 1 });
  const index = $derived(timer.current ?? 0);

  let gooeyBlur = $state(8);
</script>

<div class="grid gap-8">
  <!-- Morphing text: the blur is thresholded back to hard edges, so glyphs melt into each other -->
  <Gooey blur={4} alphaPixel={255} alphaShift={-144}>
    <div class="grid place-items-center h-24 text-6xl font-bold">
      {#key index}
        <span
          class="col-start-1 row-start-1"
          in:blur={{ amount: '10px', duration: 1000, easing: circOut }}
          out:blur={{ amount: '100px', duration: 1000, easing: circIn }}
        >
          {words[index % words.length]}
        </span>
      {/key}
    </div>
  </Gooey>

  <!-- `composite` changes how the thresholded shape is combined with the source -->
  <Gooey blur={4} alphaPixel={255} alphaShift={-144} composite="atop">
    <div class="grid place-items-center h-24 text-6xl">
      {#key index}
        <span
          class="col-start-1 row-start-1"
          in:blur={{ amount: '10px', duration: 1000, easing: circOut }}
          out:blur={{ amount: '100px', duration: 1000, easing: circIn }}
        >
          {emoji[index % emoji.length]}
        </span>
      {/key}
    </div>
  </Gooey>

  <!-- A lower alphaPixel/alphaShift rounds and merges adjacent shapes instead -->
  <div>
    <label class="text-sm text-surface-content/70">
      blur: {gooeyBlur}
      <input type="range" min="0" max="13" bind:value={gooeyBlur} class="align-middle" />
    </label>

    <div class="bg-primary rounded-lg p-6 mt-2">
      <Gooey blur={gooeyBlur} alphaPixel={19} alphaShift={-9} composite="atop">
        <div class="text-primary-content text-3xl font-bold leading-loose">
          <span class="bg-primary-content/20 px-2">Rounded</span>
          <span class="bg-primary-content/20 px-2">text background</span>
        </div>
      </Gooey>
    </div>
  </div>
</div>
