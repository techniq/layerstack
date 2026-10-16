<script lang="ts">
  import { Button, Tooltip } from '@layerstack/ui';
</script>

<div class="flex flex-wrap gap-8 py-8">
  <Tooltip title="Saves your changes">
    <Button variant="fill" color="primary">Save</Button>
  </Tooltip>

  <Tooltip title="Shown above" placement="top">
    <Button variant="outline">Top</Button>
  </Tooltip>

  <Tooltip title="No delay" delay={0}>
    <Button variant="outline">Instant</Button>
  </Tooltip>

  <Tooltip title="Explains a term" underline cursor>
    <span class="text-sm">hover this text</span>
  </Tooltip>
</div>
