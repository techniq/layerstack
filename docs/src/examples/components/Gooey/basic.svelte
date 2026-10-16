<script lang="ts">
  import { Gooey } from '@layerstack/ui';
</script>

<!-- Blur plus an alpha ramp makes overlapping shapes merge -->
<Gooey blur={10}>
  <div class="flex">
    <div class="size-16 rounded-full bg-primary"></div>
    <div class="size-16 rounded-full bg-primary -ml-6"></div>
    <div class="size-16 rounded-full bg-primary -ml-6"></div>
  </div>
</Gooey>
