<script lang="ts">
  import { format } from '@layerstack/utils';
</script>

<div>{format(1234.56, 'integer')}</div>
<div>{format(1234.56, 'decimal')}</div>
<div>{format(1234.56, 'currency')}</div>
<div>{format(0.5678, 'percent')}</div>
<div>{format(0.5678, 'percentRound')}</div>
<div>{format(1_234_567, 'metric')}</div>
<div>{format(1_200_000, 'metric')}</div>
<div>{format(0.5678, 'percent')}</div>
