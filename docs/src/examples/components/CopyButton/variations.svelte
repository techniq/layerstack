<script lang="ts">
  import { CopyButton } from '@layerstack/ui';
</script>

<div class="grid gap-4">
  <div class="flex gap-3 items-center">
    <CopyButton value="Copied!" />
    <CopyButton value="Copied!" color="primary" variant="outline" />
    <CopyButton value="Copied!" color="primary" variant="fill" />
    <CopyButton value="Copied!" color="primary" variant="fill-light" size="sm" />
  </div>

  <div class="flex gap-3 items-center">
    <!-- A function is called at click time, so the value can be computed -->
    <CopyButton value={() => new Date().toISOString()}>Copy timestamp</CopyButton>

    <CopyButton value="Copied!" message="Got it">Custom message</CopyButton>

    <!-- `message={null}` skips the built-in confirmation -->
    <CopyButton value="Copied!" message={null} onclick={() => alert('Copied!')}>
      Own notification
    </CopyButton>
  </div>
</div>
