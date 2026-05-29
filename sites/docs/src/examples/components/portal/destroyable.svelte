<script lang="ts">
	import { Button, Toggle } from 'svelte-ux';
	import { portal } from '@layerstack/svelte-actions';
</script>

<Toggle let:on={destroyed} let:toggleOn={destroy} let:toggleOff={restore}>
	<Toggle let:on={enabled} let:toggleOn let:toggleOff>
		{#if !destroyed}
			<div class="PortalTarget relative">
				<div class="relative">
					<Button on:click={toggleOn} class="border mt-4">Move to target</Button>
					<Button on:click={destroy} class="border mt-4">Destroy</Button>
					<div
						use:portal={{ enabled, target: '.destroyable-example-target' }}
						class="absolute top-1/2 left-1/2 shadow bg-surface-100 p-4 -translate-x-1/2 -translate-y-1/2 text-center"
					>
						<div>Portal content</div>
						{#if enabled}
							<Button on:click={toggleOff} class="border mt-4">Move back to parent</Button>
						{/if}
					</div>
				</div>
				<div class="destroyable-example-target relative h-32 bg-surface-200 mt-4"></div>
			</div>
		{:else}
			<Button on:click={restore} class="border mt-4">Restore</Button>
		{/if}
	</Toggle>
</Toggle>
