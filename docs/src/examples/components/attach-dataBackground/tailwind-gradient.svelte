<script lang="ts">
  import { dataBackground } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';
  import { randomInteger } from '@layerstack/utils';

  const domain: [number, number] = [-100, 100];

  function getValues() {
    return Array.from({ length: 20 }).map(() => randomInteger(domain[0], domain[1]));
  }

  let values = $state(getValues());
</script>

<div class="mb-4">
  <button class="border rounded-sm px-2 py-1" onclick={() => (values = getValues())}>
    Update data
  </button>
</div>

<table class="w-full border">
  <tbody>
    {#each values as value}
      <tr>
        <!-- `color` is omitted, so `--color-from`/`--color-to` fall back to Tailwind's gradient vars -->
        <td
          class={cls(
            'text-right border tabular-nums',
            value > 0 ? 'from-success-100 to-success-500' : 'from-danger-500 to-danger-100'
          )}
          {@attach dataBackground(() => ({ value, domain }))}
        >
          {value}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
