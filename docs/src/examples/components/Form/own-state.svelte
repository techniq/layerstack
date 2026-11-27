<script lang="ts">
  import { Button, Form, TextField } from '@layerstack/ui';
  import { FormState } from '@layerstack/svelte-state';

  const form = new FormState({ name: 'Ada Lovelace' });
</script>

<div class="grid gap-3 max-w-sm">
  <Form {form}>
    {#snippet children({ form })}
      <TextField label="Name" bind:value={form.draft.name} />
      <Button type="submit" variant="fill" color="primary" disabled={!form.isDirty}>Save</Button>
    {/snippet}
  </Form>

  <!-- Read and drive the same state from outside the form -->
  <div class="text-sm text-surface-content/70">
    Committed: {form.state.name} &middot; dirty: {form.isDirty}
  </div>
  <Button onclick={() => (form.draft.name = 'Grace Hopper')}>Set from outside</Button>
</div>
