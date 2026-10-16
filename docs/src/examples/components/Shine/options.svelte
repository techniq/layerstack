<script lang="ts">
  import { Button, Shine } from '@layerstack/ui';
</script>

<div class="grid gap-8">
  <!-- `depth` exaggerates the relief -->
  <div class="flex gap-8 items-center">
    <Shine>
      <div class="text-6xl">🚀 🧸 🍩</div>
    </Shine>

    <Shine depth={3}>
      <div class="text-6xl">🚀 🧸 🍩</div>
    </Shine>
  </div>

  <!-- `lightColor` tints the highlight -->
  <div class="bg-neutral-800 rounded-lg p-6 w-fit">
    <Shine depth={3} lightColor="#FF3355">
      <div class="text-6xl grayscale brightness-50">👻 💀 🧪</div>
    </Shine>
  </div>

  <!-- Works over any content, including components -->
  <Shine>
    <div class="flex gap-2">
      <Button variant="fill" color="primary">Primary</Button>
      <Button variant="fill" color="danger">Danger</Button>
      <Button variant="fill" color="success">Success</Button>
    </div>
  </Shine>
</div>
