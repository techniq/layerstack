<script lang="ts">
  import { Button, TextField } from '@layerstack/ui';
  import { mdiMagnify, mdiEye, mdiCurrencyUsd } from '@mdi/js';

  let search = $state('');
</script>

<div class="grid gap-4 max-w-sm">
  <!-- `icon`/`iconRight` are the shorthand for the common cases -->
  <TextField label="Search" icon={mdiMagnify} bind:value={search} clearable />
  <TextField label="Password" type="password" iconRight={mdiEye} />

  <!-- `prefix`/`suffix` sit next to the text, inside the border -->
  <TextField label="Amount" type="currency">
    {#snippet prefix()}
      <span class="text-surface-content/50 pl-2">$</span>
    {/snippet}
    {#snippet suffix()}
      <span class="text-surface-content/50 pr-2">USD</span>
    {/snippet}
  </TextField>

  <!-- `prepend`/`append` are outside the text area, for controls -->
  <TextField label="With actions">
    {#snippet prepend()}
      <Button icon={mdiCurrencyUsd} class="rounded-r-none" />
    {/snippet}
    {#snippet append()}
      <Button class="rounded-l-none">Go</Button>
    {/snippet}
  </TextField>

  <TextField label="Hint" hint="Shown below the field until an error replaces it" />
</div>
