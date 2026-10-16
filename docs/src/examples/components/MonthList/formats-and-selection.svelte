<script lang="ts">
  import { MonthList } from '@layerstack/ui';
  import { DateToken } from '@layerstack/utils';

  const m = (month: number) => new Date(2026, month, 1);
</script>

<div class="grid grid-cols-2 gap-6 max-w-2xl">
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Short name (default)</div>
    <MonthList year={2026} selected={m(7)} />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Numeric</div>
    <MonthList year={2026} selected={m(7)} format={DateToken.Month_numeric} />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Array selection</div>
    <MonthList year={2026} selected={[m(0), m(3), m(6), m(9)]} />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">Range (a quarter)</div>
    <MonthList year={2026} selected={{ from: m(3), to: m(5) }} />
  </div>
</div>
