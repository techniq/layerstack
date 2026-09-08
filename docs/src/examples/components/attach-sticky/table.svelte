<script lang="ts">
  import { sticky, stickyContext } from '@layerstack/svelte-attachments';

  const columns = Array.from({ length: 12 }).map((_, i) => `Column ${i + 1}`);
  const rows = Array.from({ length: 30 }).map((_, i) => i + 1);
</script>

<div class="h-64 border rounded-sm" {@attach stickyContext({ type: 'container' })}>
  <table class="text-sm border-separate border-spacing-0">
    <thead>
      <tr>
        <!-- Corner cell sticks to both edges, so it stays put in either direction -->
        <th
          class="bg-surface-200 border-b border-r px-3 py-2 text-left z-20"
          {@attach sticky({ top: true, left: true })}
        >
          Row
        </th>
        {#each columns as column}
          <th
            class="bg-surface-200 border-b px-3 py-2 text-left whitespace-nowrap z-10"
            {@attach sticky()}
          >
            {column}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <th
            class="bg-surface-200 border-b border-r px-3 py-2 text-left z-10"
            {@attach sticky({ left: true })}
          >
            {row}
          </th>
          {#each columns as _, columnIndex}
            <td class="border-b border-surface-content/10 px-3 py-2 whitespace-nowrap">
              {row} &middot; {columnIndex + 1}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
