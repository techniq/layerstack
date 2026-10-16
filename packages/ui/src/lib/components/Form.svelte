<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { FormState, type FormSchema } from '@layerstack/svelte-state';

  type FormOwnProps<T extends object> = {
    /** Starting value.  Ignored when `form` is supplied */
    initial?: T;

    /** Validated on submit.  Any zod-compatible schema.  Ignored when `form` is supplied */
    schema?: FormSchema<T>;

    /** Bring your own state, to read or drive the form from outside */
    form?: FormState<T>;

    /** Endpoint to submit the form to */
    action?: string;

    /**
     * How to submit the form.  Defaults to `post` when `action` is set, and otherwise to
     * `undefined`, which keeps submission client-side.
     */
    method?: 'post' | 'get' | 'dialog';

    class?: string;

    /** Called after a successful commit, with the newly committed value */
    onChange?: (value: T) => void;

    children?: Snippet<[{ form: FormState<T> }]>;
  };

  export type FormProps<T extends object = any> = FormOwnProps<T> &
    Omit<HTMLFormAttributes, keyof FormOwnProps<T>>;
</script>

<script lang="ts" generics="T extends object">
  import { untrack } from 'svelte';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    initial = {} as T,
    schema,
    form: formProp,
    action,
    method = action != null ? 'post' : undefined,
    class: className,
    onChange,
    children,
    ...restProps
  }: FormProps<T> = $props();

  const settingsClasses = getComponentClasses('Form');

  // svelte-ignore state_referenced_locally
  const ownForm = new FormState<T>(initial, { schema });
  const form = $derived(formProp ?? ownForm);

  // Replaces Svelte UX's `changeStore` — an effect that skips its first run says the same thing.
  // Compared by reference: `state` is only reassigned by a commit/undo/revertAll, so reads in
  // between return the same object.  A snapshot here would never match and would fire on mount.
  // svelte-ignore state_referenced_locally
  let lastState = form.state;
  $effect(() => {
    const next = form.state;
    if (next === untrack(() => lastState)) return;

    lastState = next;
    untrack(() => onChange?.(next));
  });
</script>

<form
  {action}
  {method}
  onsubmit={(e) => {
    const committed = form.commit();
    if (!committed || method === undefined) {
      // Do not reach the server when validation failed, or when there is nothing to submit to
      e.preventDefault();
    }
  }}
  onreset={(e) => {
    e.preventDefault();
    form.revert();
  }}
  class={cls('Form', settingsClasses.root, className)}
  {...restProps}
>
  {@render children?.({ form })}
</form>
