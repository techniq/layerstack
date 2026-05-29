<script lang="ts">
	import { format, DateToken } from '@layerstack/utils';

	let myDate = new Date('1982-03-30T07:11:00');
</script>

<div class="grid grid-cols-3 gap-4">
	<div>
		<h3>With format string</h3>
		{format(myDate, 'custom', {
			custom: 'eee, MMMM do'
		})}
	</div>
	<div>
		<h3>With descriptive tokens</h3>
		{format(myDate, 'custom', {
			custom: [DateToken.DayOfWeek_short, DateToken.Month_long, DateToken.DayOfMonth_withOrdinal]
		})}
	</div>
	<div>
		<h3>With full intl</h3>
		{format(myDate, 'custom', {
			custom: { weekday: 'short', month: 'long', day: 'numeric', withOrdinal: true }
		})}
	</div>
</div>
