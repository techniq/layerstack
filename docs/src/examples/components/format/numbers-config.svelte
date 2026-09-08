<script lang="ts">
  import { format } from '@layerstack/utils';
</script>

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
