<script lang="ts">
  import { Step, Steps } from '@layerstack/ui';
  import { mdiCheck, mdiClipboardList, mdiCreditCard, mdiTruck } from '@mdi/js';
</script>

<div class="grid gap-8">
  <!-- `point` replaces the incrementing counter -->
  <Steps>
    <Step point="?">Question</Step>
    <Step point="!">Alert</Step>
    <Step point="★">Star</Step>
    <Step point="">Blank</Step>
    <Step>Counter</Step>
  </Steps>

  <!-- `icon` renders inside the point instead -->
  <Steps>
    <Step icon={mdiCheck} completed>Register</Step>
    <Step icon={mdiClipboardList} completed>Choose plan</Step>
    <Step icon={mdiCreditCard}>Purchase</Step>
    <Step icon={mdiTruck}>Receive</Step>
  </Steps>
</div>
