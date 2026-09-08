<script lang="ts">
  import type { FormSchema, FormState } from '@layerstack/svelte-state';

  import Button from '../Button.svelte';
  import Form from '../Form.svelte';
  import Settings from '../Settings.svelte';
  import TextField from '../TextField.svelte';

  type Person = { name: string; address: { city: string } };

  // Props are listed rather than spread: a `{...props as any}` spread widens `Form`'s generic back
  // to its `object` constraint, and `form.draft.name` stops type-checking
  let {
    initial = { name: '', address: { city: '' } },
    form,
    schema,
    action,
    onChange,
  }: {
    initial?: Person;
    form?: FormState<Person>;
    schema?: FormSchema<Person>;
    action?: string;
    onChange?: (value: Person) => void;
  } = $props();
</script>

<Settings themeInit={false}>
  <Form {initial} {form} {schema} {action} {onChange}>
    {#snippet children({ form })}
      <TextField label="Name" bind:value={form.draft.name} error={form.errors.name} />
      <TextField label="City" bind:value={form.draft.address.city} />

      <Button type="submit">Save</Button>
      <Button type="reset">Cancel</Button>
      <Button onclick={() => form.undo()} disabled={!form.canUndo}>Undo</Button>
      <Button onclick={() => form.revertAll()}>Reset all</Button>

      <output data-testid="state">{JSON.stringify(form.state)}</output>
      <output data-testid="draft">{JSON.stringify(form.draft)}</output>
      <output data-testid="dirty">{form.isDirty}</output>
      <output data-testid="errors">{JSON.stringify(form.errors)}</output>
    {/snippet}
  </Form>
</Settings>
