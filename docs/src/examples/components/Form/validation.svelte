<script lang="ts">
  import { Button, Form, TextField } from '@layerstack/ui';
  import { z } from 'zod';

  const schema = z.object({
    firstName: z.string().min(1, 'First name is required').max(10),
    lastName: z.string().min(1, 'Last name is required').max(10),
  });
</script>

<Form initial={{ firstName: '', lastName: '' }} {schema} class="grid gap-3 max-w-sm">
  {#snippet children({ form })}
    <TextField label="First name" bind:value={form.draft.firstName} error={form.errors.firstName} />
    <TextField label="Last name" bind:value={form.draft.lastName} error={form.errors.lastName} />

    <div class="flex gap-2">
      <Button type="submit" variant="fill" color="primary">Save</Button>
      <Button type="reset">Cancel</Button>
    </div>

    <div class="text-sm text-surface-content/70">
      Saved: {JSON.stringify(form.state)}
    </div>
  {/snippet}
</Form>
