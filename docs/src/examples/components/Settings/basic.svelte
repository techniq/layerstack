<script lang="ts">
  import { Button, Settings, TextField } from '@layerstack/ui';
</script>

<div class="grid gap-4">
  <!-- Defaults and classes set here apply to every descendant -->
  <Settings
    themeInit={false}
    components={{
      Button: { variant: 'fill', color: 'primary', size: 'sm' },
      TextField: { classes: { container: 'border-primary/30' } },
    }}
  >
    <div class="flex gap-3 items-center">
      <Button>Inherits fill/primary/sm</Button>
      <Button variant="outline">Overrides just the variant</Button>
    </div>

    <TextField label="Inherits the container class" class="max-w-sm mt-3" />
  </Settings>

  <div class="flex gap-3 items-center">
    <Button>Outside the Settings scope</Button>
  </div>
</div>
