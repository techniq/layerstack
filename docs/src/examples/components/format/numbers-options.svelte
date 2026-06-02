<script lang="ts">
  import { format } from '@layerstack/utils';
</script>

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
