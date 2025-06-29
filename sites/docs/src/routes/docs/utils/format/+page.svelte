<script lang="ts">
  import { TextField, DatePickerField, MenuField } from 'svelte-ux';
  import {
    format,
    type FormatNumberStyle,
    DateToken,
    type PeriodTypeCode,
  } from '@layerstack/utils';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';

  let value = 1234.56;
  let numberType: FormatNumberStyle = 'decimal';
  let currency: Intl.NumberFormatOptions['currency'] | undefined = 'USD';
  let notation: Intl.NumberFormatOptions['notation'] = 'standard';

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
    'fiscal-year-october',
  ];
  let periodType: PeriodTypeCode = 'day';

  const locales = ['en', 'de', 'fr', 'it', 'es', 'jp', 'zh'] as const;
  let locale: (typeof locales)[number] = 'en';
</script>

<h1>Usage</h1>

<Code
  source={"import { format } from '@layerstack/utils';\nformat(123.456, 'decimal');"}
  language="javascript"
  class="mb-4"
/>

<h1>Playgrounds</h1>
<h2>Playground numbers</h2>

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
      'metric',
    ].map((value) => ({ label: value, value }))}
    stepper
  />

  <MenuField
    label="currency"
    bind:value={currency}
    options={[undefined, 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'MXN'].map((value) => ({
      label: value ?? 'None',
      value,
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
      value,
    }))}
    stepper
  />
</div>

<Preview>
  <div>{format(value, { type: numberType, locale, options: { currency, notation } })}</div>
</Preview>

<h2>Playground dates</h2>

<div class="grid grid-cols-xs gap-2 mb-2">
  <DatePickerField format="dd/MM/yyyy" label="date" bind:value={myDate}></DatePickerField>

  <MenuField
    label="periodType"
    bind:value={periodType}
    options={periodTypeCodes.map((value) => ({ label: value, value }))}
    stepper
  />

  <MenuField
    label="locale"
    bind:value={locale}
    options={locales.map((value) => ({ label: value, value }))}
    stepper
  />
</div>

<Preview>
  <div>{format(myDate, { type: periodType, locale })}</div>
</Preview>

<h1>Numbers</h1>

<h2>format (default settings)</h2>

<Preview showCode>
  <div>{format(1234.56, 'integer')}</div>
  <div>{format(1234.56, 'decimal')}</div>
  <div>{format(1234.56, 'currency')}</div>
  <div>{format(0.5678, 'percent')}</div>
  <div>{format(0.5678, 'percentRound')}</div>
  <div>{format(1_234_567, 'metric')}</div>
  <div>{format(1_200_000, 'metric')}</div>
  <div>{format(0.5678, 'percent')}</div>
</Preview>

<h2>format (additional options)</h2>

<span>
  You can customize numbers with the 3rd arg that is an enhanced <b>`Intl.NumberFormatOptions`</b> type.
</span>

<Preview showCode>
  <div>{format(1234.56, 'integer', { maximumSignificantDigits: 2 })}</div>
  <div>{format(1234.56, 'decimal', { maximumSignificantDigits: 5 })}</div>
  <div>{format(1234.56, 'currency', { currency: 'EUR' })}</div>
  <div>
    {format(123_456_789.99, 'currency', { notation: 'compact', maximumSignificantDigits: 3 })}
  </div>
  <div>{format(0.5678, 'percent', { signDisplay: 'always' })}</div>
  <div>{format(0.5678, 'percentRound', { signDisplay: 'always' })}</div>
  <div>{format(1_234_567, 'metric', { minimumSignificantDigits: 12 })}</div>
  <div>{format(0.5678, 'percent', { fractionDigits: 1 })}</div>
</Preview>

<h2>config</h2>

<span> You can customize numbers with a config option. </span>

<Preview showCode>
  <div>{format(1234.56, { type: 'integer', options: { maximumSignificantDigits: 2 } })}</div>
  <div>{format(1234.56, { type: 'decimal', options: { maximumSignificantDigits: 5 } })}</div>
  <div>{format(1234.56, { type: 'currency', options: { currency: 'EUR' } })}</div>
  <div>
    {format(123_456_789.99, {
      type: 'currency',
      options: { notation: 'compact', maximumSignificantDigits: 3 },
    })}
  </div>
  <div>{format(0.5678, { type: 'percent', options: { signDisplay: 'always' } })}</div>
  <div>{format(0.5678, { type: 'percentRound', options: { signDisplay: 'always' } })}</div>
  <div>{format(1_234_567, { type: 'metric', options: { minimumSignificantDigits: 12 } })}</div>
  <div>{format(0.5678, { type: 'percent', options: { fractionDigits: 1 } })}</div>
</Preview>

<h1>Dates</h1>

<h2>Custom format</h2>

<div class="grid grid-cols-3 gap-4">
  <div>
    <h3>With format string</h3>
    <Preview>
      {format(myDate, 'custom', {
        custom: 'eee, MMMM do',
      })}
    </Preview>
  </div>
  <div>
    <h3>With descriptive tokens</h3>
    <Preview>
      {format(myDate, 'custom', {
        custom: [DateToken.DayOfWeek_short, DateToken.Month_long, DateToken.DayOfMonth_withOrdinal],
      })}
    </Preview>
  </div>
  <div>
    <h3>With full intl</h3>
    <Preview>
      {format(myDate, 'custom', {
        custom: { weekday: 'short', month: 'long', day: 'numeric', withOrdinal: true },
      })}
    </Preview>
  </div>
</div>

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
      <Preview>
        {format(myDate, periodType, {
          variant: 'short',
        })}
      </Preview>
    </div>
    <div>
      <h3>default</h3>
      <Preview>
        {format(myDate, periodType, {
          // variant: 'default',
        })}
      </Preview>
    </div>
    <div>
      <h3>long</h3>
      <Preview>
        {format(myDate, periodType, {
          variant: 'long',
        })}
      </Preview>
    </div>
  </div>
{/each}
