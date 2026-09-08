<script lang="ts">
  import { TextField } from '@layerstack/ui';
</script>

<div class="grid gap-4 max-w-sm">
  <TextField label="Hint" hint="We'll never share it" />
  <TextField label="Error" error="This field is required" />
  <TextField label="Disabled" value="Can't touch this" disabled />
  <TextField label="Clearable" value="Clear me" clearable />
  <TextField label="Multiline" multiline placeholder="Several lines…" />
</div>
