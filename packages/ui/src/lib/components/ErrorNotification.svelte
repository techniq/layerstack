<script lang="ts" module>
  import type { NotificationProps } from './Notification.svelte';

  type ErrorNotificationOwnProps = {
    title: string;
    description: string;
    /** Shown as the details dialog's title */
    message?: string;
    stackTrace?: string;
    /** Called once the notification has transitioned out */
    onClose?: () => void;
  };

  export type ErrorNotificationProps = ErrorNotificationOwnProps &
    Omit<NotificationProps, keyof ErrorNotificationOwnProps | 'variant' | 'actionsPlacement'>;
</script>

<script lang="ts">
  import Button from './Button.svelte';
  import Dialog from './Dialog.svelte';
  import Icon from './Icon.svelte';
  import Notification from './Notification.svelte';
  import { getSettings } from './settingsState.svelte.js';

  let {
    title,
    description,
    message = '',
    stackTrace = '',
    onClose,
    ...restProps
  }: ErrorNotificationProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);

  let detailsOpen = $state(false);

  const hasDetails = $derived(Boolean(message || stackTrace));
</script>

<Notification {...restProps} actionsPlacement="below" closeIcon {onClose}>
  {#snippet iconSnippet()}
    <div class="self-start">
      <Icon data={icons.alert} class="text-danger" />
    </div>
  {/snippet}

  {#snippet titleSnippet()}
    {title}
  {/snippet}

  {#snippet descriptionSnippet()}
    <div class="max-w-3xl max-h-64 overflow-auto whitespace-pre">
      {#if description}
        <div class="grid gap-2">
          {#each description.split('\n') as line, i (i)}
            <div>{line}</div>
          {/each}
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet actionsSnippet()}
    {#if hasDetails}
      <Button
        onclick={(e) => {
          // Keep the notification open while the details dialog is shown
          e.stopPropagation();
          detailsOpen = true;
        }}
        class="primary"
      >
        View Details
      </Button>
    {/if}
    <Button color={hasDetails ? 'default' : 'primary'}>Dismiss</Button>
  {/snippet}
</Notification>

<Dialog bind:open={detailsOpen} style="max-width: 90vw">
  {#snippet title()}
    {#if message}
      {#each message.split('\n') as line, i (i)}
        <div>{line}</div>
      {/each}
    {/if}
  {/snippet}

  <div class="grid gap-4 p-6">
    {#if stackTrace}
      <div>
        <div class="text-xs text-surface-content/50 mb-1">Stacktrace:</div>
        <pre class="bg-surface-200 border rounded-sm p-2 text-xs overflow-auto">{stackTrace}</pre>
      </div>
    {/if}
  </div>

  {#snippet actions()}
    <Button color="primary" onclick={() => (detailsOpen = false)}>Close</Button>
  {/snippet}
</Dialog>
