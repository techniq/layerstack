<script lang="ts">
  import { CopyButton } from '@layerstack/ui';
</script>

<div class="flex flex-wrap items-center gap-3">
  <CopyButton value="npm install @layerstack/ui" variant="fill" color="primary">
    Copy install command
  </CopyButton>

  <CopyButton value={() => new Date().toISOString()} variant="outline" />

  <CopyButton value="no confirmation" message={null} variant="outline">Quiet</CopyButton>
</div>
