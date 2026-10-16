<script lang="ts">
  import { Button, Form, TextField } from '@layerstack/ui';

  let saved = $state({ name: 'Ada Lovelace', email: 'ada@example.com' });
</script>

<Form initial={saved} onChange={(value) => (saved = value)} class="grid gap-3 max-w-sm">
  {#snippet children({ form })}
    <TextField label="Name" bind:value={form.draft.name} />
    <TextField label="Email" bind:value={form.draft.email} />

    <div class="flex gap-2">
      <Button type="submit" variant="fill" color="primary" disabled={!form.isDirty}>Save</Button>
      <Button type="reset" disabled={!form.isDirty}>Cancel</Button>
      <Button onclick={() => form.undo()} disabled={!form.canUndo}>Undo</Button>
      <Button onclick={() => form.revertAll()}>Reset</Button>
    </div>

    <div class="text-sm text-surface-content/70">
      Saved: {JSON.stringify(form.state)}
    </div>
  {/snippet}
</Form>
