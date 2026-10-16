<script lang="ts">
  import { Button, TextField } from '@layerstack/ui';
  import { FormState } from '@layerstack/svelte-state';

  const form = new FormState({ name: 'Ada Lovelace', email: 'ada@example.com' });
</script>

<div class="grid gap-3 max-w-sm">
  <TextField label="Name" bind:value={form.draft.name} />
  <TextField label="Email" bind:value={form.draft.email} />

  <div class="flex gap-2">
    <Button onclick={() => form.commit()} disabled={!form.isDirty} variant="fill" color="primary">
      Apply
    </Button>
    <Button onclick={() => form.revert()} disabled={!form.isDirty}>Cancel</Button>
    <Button onclick={() => form.undo()} disabled={!form.canUndo}>Undo</Button>
    <Button onclick={() => form.revertAll()}>Reset</Button>
  </div>

  <div class="text-sm text-surface-content/70">
    <div>draft: {JSON.stringify(form.draft)}</div>
    <div>state: {JSON.stringify(form.state)}</div>
    <div>dirty: {form.isDirty}</div>
  </div>
</div>
