<script lang="ts">
  import { Collapse, Icon } from '@layerstack/ui';
  import { fly, slide } from 'svelte/transition';
  import { mdiPlus } from '@mdi/js';
</script>

<div class="grid gap-6 max-w-md">
  <!-- `popout` adds spacing around the open item -->
  <div>
    <Collapse name="Popout" popout>
      <div class="px-4 py-2 text-sm">Content</div>
    </Collapse>
    <Collapse name="Popout" popout>
      <div class="px-4 py-2 text-sm">Content</div>
    </Collapse>
  </div>

  <!-- Custom transition and params -->
  <Collapse name="Slow slide" transition={slide} transitionParams={{ duration: 600 }}>
    <div class="px-4 py-2 text-sm">Content</div>
  </Collapse>

  <Collapse name="Fly in" transition={fly} transitionParams={{ y: -8, duration: 300 }}>
    <div class="px-4 py-2 text-sm">Content</div>
  </Collapse>

  <!-- Replace the trigger label and the chevron -->
  <Collapse>
    {#snippet trigger({ open })}
      <div class="flex-1 px-4 py-2 text-sm font-semibold">
        {open ? 'Hide details' : 'Show details'}
      </div>
    {/snippet}

    {#snippet iconSnippet({ open })}
      <Icon
        data={mdiPlus}
        class="mr-2 transition-transform duration-300 {open ? 'rotate-45' : ''}"
      />
    {/snippet}

    <div class="px-4 py-2 text-sm">Content</div>
  </Collapse>

  <Collapse name="Disabled" disabled>
    <div class="px-4 py-2 text-sm">Never revealed</div>
  </Collapse>
</div>
