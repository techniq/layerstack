<script lang="ts">
  import { TextField, DatePickerField, MenuField } from 'svelte-ux';
  import { format, PeriodType, type FormatNumberStyle, DateToken } from '@layerstack/utils';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';

  let value = 1234.56;
  let style: FormatNumberStyle = 'decimal';
  let currency: Intl.NumberFormatOptions['currency'] | undefined = 'USD';
  let notation: Intl.NumberFormatOptions['notation'] = 'standard';

  let myDate = new Date('1982-03-30T07:11:00');

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
    label="style"
    bind:value={style}
    options={[
      'integer',
      'decimal',
      'currency',
      'currencyRound',
      'percent',
      'percentRound',
      'metric',
    ].map((value) => ({ label: value, value }))}
  />

  <MenuField
    label="currency"
    bind:value={currency}
    options={[undefined, 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'MXN'].map((value) => ({
      label: value ?? 'None',
      value,
    }))}
  />

  <MenuField
    label="locale"
    bind:value={locale}
    options={locales.map((value) => ({ label: value, value }))}
  />

  <MenuField
    label="notation"
    bind:value={notation}
    options={['standard', 'scientific', 'engineering', 'compact'].map((value) => ({
      label: value,
      value,
    }))}
  />
</div>

<Preview>
  <div>{format(value, style, { currency, notation })}</div>
</Preview>

<h2>Playground dates</h2>

<div class="grid grid-cols-xs gap-2 mb-2">
  <DatePickerField format="dd/MM/yyyy" label="date" bind:value={myDate}></DatePickerField>

  <MenuField
    label="locale"
    bind:value={locale}
    options={locales.map((value) => ({ label: value, value }))}
  />
</div>

<Preview>
  <div>{format(myDate, PeriodType.Day)}</div>
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
      {format(myDate, PeriodType.Custom, {
        custom: 'eee, MMMM do',
      })}
    </Preview>
  </div>
  <div>
    <h3>With descriptive tokens</h3>
    <Preview>
      {format(myDate, PeriodType.Custom, {
        custom: [DateToken.DayOfWeek_short, DateToken.Month_long, DateToken.DayOfMonth_withOrdinal],
      })}
    </Preview>
  </div>
  <div>
    <h3>With full intl</h3>
    <Preview>
      {format(myDate, PeriodType.Custom, {
        custom: { weekday: 'short', month: 'long', day: 'numeric', withOrdinal: true },
      })}
    </Preview>
  </div>
</div>

{#each [PeriodType.Day, PeriodType.DayTime, PeriodType.TimeOnly, PeriodType.Week, PeriodType.BiWeek1, PeriodType.Month, PeriodType.MonthYear, PeriodType.Quarter, PeriodType.CalendarYear, PeriodType.FiscalYearOctober] as periodType}
  <h2>PeriodType.{PeriodType[periodType]}</h2>

  {#if periodType === PeriodType.Week || periodType === PeriodType.BiWeek1}
    <span>
      It will take your default <b>weekStartsOn</b>
      <a
        class="text-accent-500"
        href="https://svelte-ux.techniq.dev/customization#settings"
        target="_blank">settings</a
      >, if you want to be specific, you can also use
      <b>{periodType === PeriodType.Week ? 'PeriodType.WeekSun' : 'PeriodType.BiWeek1Sun'}</b>
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
