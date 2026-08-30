<script lang="ts">
  import { TextField } from '@layerstack/ui';
</script>

<div class="grid gap-4 max-w-sm">
  <TextField label="Notes" multiline placeholder="Grows as you type" />

  <!-- A fixed height turns off the auto-grow -->
  <TextField
    label="Fixed height"
    multiline
    classes={{ input: 'h-24 resize-none' }}
    value={'Line one\nLine two\nLine three'}
  />
</div>
