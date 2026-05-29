<script lang="ts">
	import { format, type PeriodTypeCode } from '@layerstack/utils';

	let myDate = new Date('1982-03-30T07:11:00');

	const periodTypeCodes: PeriodTypeCode[] = [
		'day',
		'daytime',
		'time',
		'week',
		'biweek1',
		'month',
		'month-year',
		'quarter',
		'year',
		'fiscal-year-october'
	];
</script>

{#each periodTypeCodes as periodType}
	<h2>{periodType}</h2>

	{#if periodType === 'week' || periodType === 'biweek1'}
		<span>
			It will take your default <b>weekStartsOn</b>
			<a
				class="text-accent-500"
				href="https://svelte-ux.techniq.dev/customization#settings"
				target="_blank">settings</a
			>, if you want to be specific, you can also use
			<b>{periodType === 'week' ? 'PeriodType.WeekSun' : 'PeriodType.BiWeek1Sun'}</b>
		</span>
	{/if}

	<div class="grid grid-cols-3 gap-4">
		<div>
			<h3>short</h3>
			{format(myDate, periodType, {
				variant: 'short'
			})}
		</div>
		<div>
			<h3>default</h3>
			{format(myDate, periodType, {
				// variant: 'default',
			})}
		</div>
		<div>
			<h3>long</h3>
			{format(myDate, periodType, {
				variant: 'long'
			})}
		</div>
	</div>
{/each}
