<script lang="ts">
  import { sort } from 'd3-array';

  import { dataBackground } from '@layerstack/svelte-attachments';
  import { randomInteger } from '@layerstack/utils';

  let originalDomain: [number, number] = $state([-100, 100]);

  function getValues() {
    return Array.from({ length: 20 }).map(() =>
      randomInteger(originalDomain[0], originalDomain[1])
    );
  }

  let values = $state(getValues());
  let domainSelected = $state('original'); // 'derived'
  let sorted = $state(false);
  let inset: [number, number] = $state([0, 0]);
  let baseline = $state(false);
  let duration = $state(300);

  // Use original domain (ex. -100 => 100) or derive based on data
  let domain = $derived(
    domainSelected === 'original'
      ? originalDomain
      : ([Math.min(...values), Math.max(...values)] as [number, number])
  );
</script>

<div class="grid gap-2 mb-4">
  <div class="flex flex-wrap items-center gap-4">
    <label class="flex items-center gap-2">
      Domain
      <select bind:value={domainSelected} class="border rounded-sm px-1 py-0.5">
        <option value="original">Original</option>
        <option value="derived">Derived</option>
      </select>
    </label>

    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={sorted} /> Sorted
    </label>

    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={baseline} /> Show baseline
    </label>
  </div>

  <div class="flex flex-wrap items-center gap-4">
    <label class="flex items-center gap-2">
      Domain min
      <input type="number" bind:value={originalDomain[0]} class="border rounded-sm w-20 px-1" />
    </label>
    <label class="flex items-center gap-2">
      Domain max
      <input type="number" bind:value={originalDomain[1]} class="border rounded-sm w-20 px-1" />
    </label>
    <label class="flex items-center gap-2">
      Inset x
      <input type="number" bind:value={inset[0]} min={0} class="border rounded-sm w-16 px-1" />
    </label>
    <label class="flex items-center gap-2">
      Inset y
      <input type="number" bind:value={inset[1]} min={0} class="border rounded-sm w-16 px-1" />
    </label>
  </div>

  <label class="flex items-center gap-2">
    Tween duration
    <input type="range" bind:value={duration} max={1000} />
    <span class="tabular-nums">{duration}ms</span>
  </label>

  <button class="border rounded-sm px-2 py-1" onclick={() => (values = getValues())}>
    Update data
  </button>
</div>

<table class="w-full border">
  <tbody>
    {#each sorted ? sort(values) : values as value}
      <!-- `tween` is read untracked, so re-mount when it changes -->
      {#key duration}
        <tr>
          <td
            class="text-right border tabular-nums"
            {@attach dataBackground(() => ({
              value,
              color: value > 0 ? 'hsl(140 80% 80%)' : 'hsl(0 80% 80%)',
              domain,
              inset,
              baseline,
              tween: { duration },
            }))}
          >
            {value}
          </td>
        </tr>
      {/key}
    {/each}
  </tbody>
</table>
