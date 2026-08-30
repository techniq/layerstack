<script lang="ts">
  import { Button, Checkbox, Field, Switch } from '@layerstack/ui';
  import { mdiPlus } from '@mdi/js';

  let enabled = $state(true);
  let agreed = $state(false);
</script>

<div class="grid gap-4 max-w-sm">
  <!-- `Field` is the chrome; anything can be the control -->
  <Field label="Enabled">
    <Switch bind:checked={enabled} />
  </Field>

  <Field label="Terms" error={agreed ? '' : 'You must agree'}>
    <Checkbox bind:checked={agreed}>I agree</Checkbox>
  </Field>

  <Field label="Native input">
    {#snippet children({ id })}
      <input {id} type="number" class="w-full bg-transparent outline-none" value={5} />
    {/snippet}
  </Field>

  <Field label="With a button">
    Read only text
    {#snippet append()}
      <Button icon={mdiPlus} class="rounded-l-none" />
    {/snippet}
  </Field>

  <!-- Empty and placeholder states -->
  <Field label="Empty" value={null} />
  <Field label="Placeholder" value={null} placeholder="Nothing selected" />
</div>
