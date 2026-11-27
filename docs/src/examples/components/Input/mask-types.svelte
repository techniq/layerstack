<script lang="ts">
  import { Field, Input } from '@layerstack/ui';

  let phone = $state('');
  let card = $state('');
</script>

<div class="grid gap-4 max-w-sm">
  <Field label="Date">
    <Input mask="mm/dd/yyyy" replace="dmy" />
  </Field>

  <Field label="Date and time">
    <Input mask="mm/dd/yyyy --:-- am" replace="dmy-" />
  </Field>

  <Field label="Telephone">
    <Input bind:value={phone} mask="(___) ___-____" replace="_" />
  </Field>

  <Field label="Credit card">
    <Input bind:value={card} mask="____ ____ ____ ____" replace="_" />
  </Field>

  <Field label="MAC address">
    <Input mask="__:__:__:__:__:__" replace="_" />
  </Field>

  <!-- `accept` filters characters without imposing a shape -->
  <Field label="Alphanumeric only">
    <Input accept="[a-zA-Z0-9]" />
  </Field>
</div>

<div class="mt-3 text-sm text-surface-content/70">
  <div>phone: {phone || '(empty)'}</div>
  <div>card: {card || '(empty)'}</div>
</div>
