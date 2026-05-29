<script lang="ts">
	import { Field, ToggleGroup, ToggleOption } from 'svelte-ux';
	import { computedStyles } from '@layerstack/svelte-actions';
	import { cls } from '@layerstack/tailwind';

	import { Json } from '@layerstack/docs/components';

	let _styles: CSSStyleDeclaration;
	let backgroundClass = 'bg-primary';
	let outlineStyle = 'solid';
</script>

<div class="grid gap-3">
	<div
		use:computedStyles={(styles) => (_styles = styles)}
		class={cls('size-10 rounded-sm outline-offset-2', backgroundClass)}
		style:outline-style={outlineStyle}
	></div>

	<div class="grid grid-cols-2 gap-3">
		<Field label="Background Class">
			<ToggleGroup bind:value={backgroundClass} variant="outline" inset>
				<ToggleOption value="bg-primary">primary</ToggleOption>
				<ToggleOption value="bg-secondary">secondary</ToggleOption>
			</ToggleGroup>
		</Field>

		<Field label="Outline Style">
			<ToggleGroup bind:value={outlineStyle} variant="outline" inset>
				<ToggleOption value="solid">solid</ToggleOption>
				<ToggleOption value="dashed">dashed</ToggleOption>
				<ToggleOption value="dotted">dotted</ToggleOption>
			</ToggleGroup>
		</Field>
	</div>

	<Field label="Focal styles">
		<Json
			value={{ backgroundColor: _styles?.backgroundColor, outlineStyle: _styles?.outlineStyle }}
			defaultExpandedPaths={[]}
		/>
	</Field>

	<Field label="All styles">
		<Json value={_styles} defaultExpandedPaths={[]} />
	</Field>
</div>
