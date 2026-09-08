import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { FormState, type FormSchema } from '@layerstack/svelte-state';

import FormHarness from './tests/FormHarness.svelte';

const testId = (root: ParentNode, id: string) =>
  root.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

type Person = { name: string; address: { city: string } };

const initial: Person = { name: 'Ada', address: { city: 'London' } };

/** `input` is delegated in Svelte 5, so synthetic events must bubble */
function type(el: HTMLInputElement, value: string) {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

const nameRequired: FormSchema<Person> = {
  safeParse: (value: any) =>
    value?.name
      ? { success: true as const, data: value }
      : {
          success: false as const,
          error: { issues: [{ path: ['name'], message: 'Name is required' }] },
        },
};

const inputs = (root: ParentNode) =>
  [...root.querySelectorAll('input.Input')] as HTMLInputElement[];

const button = (root: ParentNode, label: string) =>
  [...root.querySelectorAll('.Button')].find(
    (b) => b.textContent?.trim() === label
  ) as HTMLButtonElement;

describe('Form', () => {
  it('renders the initial value into its fields', () => {
    const { container } = render(FormHarness, { props: { initial } });

    expect(inputs(container).map((i) => i.value)).toEqual(['Ada', 'London']);
    expect(testId(container, 'dirty')!.textContent).toBe('false');
  });

  it('edits the draft without touching the committed state', async () => {
    const { container } = render(FormHarness, { props: { initial } });

    type(inputs(container)[0], 'Grace');

    await vi.waitFor(() => {
      expect(testId(container, 'dirty')!.textContent).toBe('true');
      expect(JSON.parse(testId(container, 'draft')!.textContent!).name).toBe('Grace');
      expect(JSON.parse(testId(container, 'state')!.textContent!).name).toBe('Ada');
    });
  });

  it('commits on submit and reports through onChange', async () => {
    const onChange = vi.fn();
    const { container } = render(FormHarness, { props: { initial, onChange } });

    type(inputs(container)[0], 'Grace');
    button(container, 'Save').click();

    await vi.waitFor(() => {
      expect(JSON.parse(testId(container, 'state')!.textContent!).name).toBe('Grace');
      expect(testId(container, 'dirty')!.textContent).toBe('false');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'Grace' }));
    });
  });

  it('does not report a change on mount', async () => {
    const onChange = vi.fn();
    render(FormHarness, { props: { initial, onChange } });

    await vi.waitFor(() => expect(document.querySelector('.Form')).toBeTruthy());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reverts the draft on reset', async () => {
    const { container } = render(FormHarness, { props: { initial } });

    type(inputs(container)[0], 'Grace');
    await vi.waitFor(() => expect(testId(container, 'dirty')!.textContent).toBe('true'));

    button(container, 'Cancel').click();

    await vi.waitFor(() => {
      expect(inputs(container)[0].value).toBe('Ada');
      expect(testId(container, 'dirty')!.textContent).toBe('false');
    });
  });

  it('blocks the commit and shows errors when the schema fails', async () => {
    const onChange = vi.fn();
    const { container } = render(FormHarness, {
      props: { initial, schema: nameRequired, onChange },
    });

    type(inputs(container)[0], '');
    button(container, 'Save').click();

    await vi.waitFor(() => {
      expect(JSON.parse(testId(container, 'errors')!.textContent!)).toEqual({
        name: 'Name is required',
      });
      expect(JSON.parse(testId(container, 'state')!.textContent!).name).toBe('Ada');
      expect(container.textContent).toContain('Name is required');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('undoes the last commit', async () => {
    const { container } = render(FormHarness, { props: { initial } });

    expect(button(container, 'Undo').disabled).toBe(true);

    type(inputs(container)[0], 'Grace');
    button(container, 'Save').click();

    await vi.waitFor(() => expect(button(container, 'Undo').disabled).toBe(false));

    button(container, 'Undo').click();

    await vi.waitFor(() => {
      expect(JSON.parse(testId(container, 'state')!.textContent!).name).toBe('Ada');
      expect(inputs(container)[0].value).toBe('Ada');
      expect(button(container, 'Undo').disabled).toBe(true);
    });
  });

  it('restores the initial value with revertAll', async () => {
    const { container } = render(FormHarness, { props: { initial } });

    type(inputs(container)[0], 'Grace');
    button(container, 'Save').click();
    await vi.waitFor(() =>
      expect(JSON.parse(testId(container, 'state')!.textContent!).name).toBe('Grace')
    );

    type(inputs(container)[1], 'New York');
    await vi.waitFor(() => expect(testId(container, 'dirty')!.textContent).toBe('true'));

    button(container, 'Reset all').click();

    await vi.waitFor(() => {
      expect(inputs(container).map((i) => i.value)).toEqual(['Ada', 'London']);
      expect(testId(container, 'dirty')!.textContent).toBe('false');
    });
  });

  it('accepts externally owned state', async () => {
    const form = new FormState<Person>(initial);
    const { container } = render(FormHarness, { props: { form } });

    type(inputs(container)[0], 'Grace');
    button(container, 'Save').click();

    await vi.waitFor(() => expect(form.state.name).toBe('Grace'));
  });

  it('stays client-side unless an action is set', async () => {
    const plain = render(FormHarness, { props: { initial } });
    expect(plain.container.querySelector('form')!.getAttribute('method')).toBe(null);

    const posted = render(FormHarness, { props: { initial, action: '/save' } });
    const form = posted.container.querySelector('form')!;
    expect(form.getAttribute('action')).toBe('/save');
    expect(form.getAttribute('method')).toBe('post');
  });

  it('edits nested values', async () => {
    const { container } = render(FormHarness, { props: { initial } });

    type(inputs(container)[1], 'New York');
    button(container, 'Save').click();

    await vi.waitFor(() =>
      expect(JSON.parse(testId(container, 'state')!.textContent!).address.city).toBe('New York')
    );
  });
});
