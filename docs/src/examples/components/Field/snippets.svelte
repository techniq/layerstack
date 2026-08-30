<script lang="ts">
  import { Field } from '@layerstack/ui';
</script>

<div class="grid gap-4 max-w-sm">
  <Field label="Amount" value="1234">
    {#snippet prefix()}
      <span class="text-surface-content/50 mr-1">$</span>
    {/snippet}
    {#snippet suffix()}
      <span class="text-surface-content/50 ml-1">.00</span>
    {/snippet}
  </Field>

  <Field label="With prepend and append" value="middle">
    {#snippet prepend()}
      <span class="text-surface-content/50 mr-2">pre</span>
    {/snippet}
    {#snippet append()}
      <span class="text-surface-content/50 ml-2">post</span>
    {/snippet}
  </Field>
</div>
