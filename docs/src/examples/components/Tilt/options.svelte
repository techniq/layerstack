<script lang="ts">
  import { Shine, Tilt } from '@layerstack/ui';

  const cards = ['bg-primary', 'bg-secondary', 'bg-accent'];
</script>

<div class="grid gap-8">
  <div class="flex gap-6 items-center">
    {#each cards as bg, i (bg)}
      <Tilt class="hover:scale-105 transition duration-500">
        <div class="{bg} rounded-lg w-32 h-40 grid place-items-center text-white">Card {i + 1}</div>
      </Tilt>
    {/each}
  </div>

  <div class="flex gap-6 items-center">
    <!-- `setBrightness` also dims/brightens with the pointer's vertical position -->
    <Tilt setBrightness>
      <div class="bg-primary rounded-lg w-32 h-40 grid place-items-center text-white">
        Brightness
      </div>
    </Tilt>

    <!-- `maxRotation` limits the tilt -->
    <Tilt maxRotation={5}>
      <div class="bg-secondary rounded-lg w-32 h-40 grid place-items-center text-white">Subtle</div>
    </Tilt>

    <!-- Perspective is a plain CSS utility on the wrapper -->
    <Tilt class="[perspective:300px]">
      <div class="bg-accent rounded-lg w-32 h-40 grid place-items-center text-white">Close</div>
    </Tilt>

    <Shine>
      <Tilt>
        <div class="bg-neutral-800 rounded-lg w-32 h-40 grid place-items-center text-white">
          With Shine
        </div>
      </Tilt>
    </Shine>
  </div>
</div>
