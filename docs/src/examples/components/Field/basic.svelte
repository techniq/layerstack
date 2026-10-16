<script lang="ts">
  import { Field } from '@layerstack/ui';
</script>

<div class="grid gap-4 max-w-sm">
  <Field label="Custom control">
    {#snippet children({ id })}
      <select {id} class="w-full bg-transparent outline-hidden text-sm">
        <option>One</option>
        <option>Two</option>
      </select>
    {/snippet}
  </Field>
</div>
