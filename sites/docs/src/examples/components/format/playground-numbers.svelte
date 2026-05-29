<script lang="ts">
	import { TextField, MenuField } from 'svelte-ux';
	import { format, type FormatNumberStyle } from '@layerstack/utils';

	let value = 1234.56;
	let numberType: FormatNumberStyle = 'decimal';
	let currency: Intl.NumberFormatOptions['currency'] | undefined = 'USD';
	let notation: Intl.NumberFormatOptions['notation'] = 'standard';

	const locales = ['en', 'de', 'fr', 'it', 'es', 'jp', 'zh'] as const;
	let locale: (typeof locales)[number] = 'en';
</script>

<div class="grid grid-cols-xs gap-2 mb-2">
	<TextField label="value" bind:value type="decimal" />

	<MenuField
		label="type"
		bind:value={numberType}
		options={[
			'integer',
			'decimal',
			'currency',
			'currencyRound',
			'percent',
			'percentRound',
			'metric'
		].map((value) => ({ label: value, value }))}
		stepper
	/>

	<MenuField
		label="currency"
		bind:value={currency}
		options={[undefined, 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'MXN'].map((value) => ({
			label: value ?? 'None',
			value
		}))}
		stepper
		disabled={numberType !== 'currency' && numberType !== 'currencyRound'}
	/>

	<MenuField
		label="locale"
		bind:value={locale}
		options={locales.map((value) => ({ label: value, value }))}
		stepper
	/>

	<MenuField
		label="notation"
		bind:value={notation}
		options={['standard', 'scientific', 'engineering', 'compact'].map((value) => ({
			label: value,
			value
		}))}
		stepper
	/>
</div>

<div>{format(value, { type: numberType, locale, options: { currency, notation } })}</div>
