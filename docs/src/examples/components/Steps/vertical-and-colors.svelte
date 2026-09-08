<script lang="ts">
  import { Step, Steps } from '@layerstack/ui';
</script>

<div class="grid grid-cols-2 gap-8">
  <Steps vertical>
    <Step completed>Fly to the moon</Step>
    <Step completed>Shrink the moon</Step>
    <Step>Grab the moon</Step>
  </Steps>

  <!-- `classes.completed` colors the point and the line leading into it -->
  <Steps vertical>
    <Step completed classes={{ completed: 'bg-success text-success-content' }}>Ordered</Step>
    <Step completed classes={{ completed: 'bg-success text-success-content' }}>Shipped</Step>
    <Step completed classes={{ completed: 'bg-warning text-warning-content' }}>Delayed</Step>
    <Step classes={{ completed: 'bg-danger text-danger-content' }}>Delivered</Step>
  </Steps>
</div>
