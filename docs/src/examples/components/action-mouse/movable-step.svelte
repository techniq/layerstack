<script lang="ts">
  import { spring } from 'svelte/motion';
  import { movable } from '@layerstack/svelte-actions';

  const coords = spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.4 });
</script>

<div class="h-40">
  <div
    class="w-10 h-10 bg-danger rounded-sm cursor-move"
    use:movable={{ step: 25 }}
    on:movestart={() => {
      coords.stiffness = 1;
      coords.damping = 1;
    }}
    on:move={(e) => {
      $coords.x += e.detail.dx;
      $coords.y += e.detail.dy;
    }}
    on:moveend={() => {
      coords.stiffness = 0.2;
      coords.damping = 0.4;
      coords.set({ x: 0, y: 0 });
    }}
    style="transform: translate({$coords.x}px,{$coords.y}px) rotate({$coords.x * 0.2}deg)"
  ></div>
</div>
