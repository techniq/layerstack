<script lang="ts">
  import { TextField } from 'svelte-ux';
  import { styleProps } from '@layerstack/svelte-actions';

  let background = '#ddd';
  let border = '1px solid #aaa';

  $: styles = { '--background': background, '--border': border };
</script>

<div class="grid gap-4" use:styleProps={styles}>
  <div
    class="size-10 rounded-sm"
    style:background-color="var(--background)"
    style:border="var(--border)"
  ></div>
  <div class="grid grid-flow-col gap-2">
    <TextField label="Background" bind:value={background} />
    <TextField label="Border" bind:value={border} />
  </div>
</div>
