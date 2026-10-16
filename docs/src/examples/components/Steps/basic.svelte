<script lang="ts">
  import { Steps } from '@layerstack/ui';

  const data = [
    { label: 'Cart', completed: true },
    { label: 'Shipping', completed: true },
    { label: 'Payment' },
    { label: 'Confirm' },
  ];
</script>

<div class="grid gap-8">
  <Steps {data} class="w-full" />
  <Steps {data} vertical />
</div>
