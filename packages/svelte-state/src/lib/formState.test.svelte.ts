import { describe, expect, it } from 'vitest';

import { FormState, type FormSchema } from './formState.svelte.js';

type Person = { name: string; address: { city: string } };

const initial: Person = { name: 'Ada', address: { city: 'London' } };

/** Stands in for a zod schema — `FormState` only requires `safeParse` */
const nameRequired: FormSchema<Person> = {
  safeParse(value: any) {
    return value?.name
      ? { success: true as const, data: value }
      : {
          success: false as const,
          error: { issues: [{ path: ['name'], message: 'Name is required' }] },
        };
  },
};

describe('FormState', () => {
  it('starts with the draft matching the initial value', () => {
    const form = new FormState(initial);

    expect(form.draft).toEqual(initial);
    expect(form.state).toEqual(initial);
    expect(form.isDirty).toBe(false);
    expect(form.canUndo).toBe(false);
  });

  it('does not write through to the caller`s object', () => {
    const source = { name: 'Ada', address: { city: 'London' } };
    const form = new FormState(source);

    form.draft.name = 'Grace';
    form.draft.address.city = 'New York';
    form.commit();

    expect(source).toEqual({ name: 'Ada', address: { city: 'London' } });
  });

  it('tracks dirty state against the last commit', () => {
    const form = new FormState(initial);

    form.draft.name = 'Grace';
    expect(form.isDirty).toBe(true);
    expect(form.state.name).toBe('Ada');

    form.commit();
    expect(form.isDirty).toBe(false);
    expect(form.state.name).toBe('Grace');
  });

  it('reports nested changes as dirty', () => {
    const form = new FormState(initial);

    form.draft.address.city = 'New York';
    expect(form.isDirty).toBe(true);
  });

  it('is not dirty when a change is reverted by hand', () => {
    const form = new FormState(initial);

    form.draft.name = 'Grace';
    form.draft.name = 'Ada';

    expect(form.isDirty).toBe(false);
  });

  it('reverts the draft to the last commit', () => {
    const form = new FormState(initial);

    form.draft.name = 'Grace';
    form.commit();

    form.draft.name = 'Alan';
    form.revert();

    expect(form.draft.name).toBe('Grace');
    expect(form.state.name).toBe('Grace');
  });

  it('reverts everything back to the initial value', () => {
    const form = new FormState(initial);

    form.draft.name = 'Grace';
    form.commit();
    form.draft.address.city = 'New York';
    form.commit();

    form.revertAll();

    expect(form.draft).toEqual(initial);
    expect(form.state).toEqual(initial);
    expect(form.canUndo).toBe(false);
  });

  it('undoes commits one at a time', () => {
    const form = new FormState(initial);

    form.draft.name = 'Grace';
    form.commit();
    form.draft.name = 'Alan';
    form.commit();

    expect(form.state.name).toBe('Alan');

    form.undo();
    expect(form.state.name).toBe('Grace');
    expect(form.draft.name).toBe('Grace');

    form.undo();
    expect(form.state.name).toBe('Ada');
    expect(form.canUndo).toBe(false);

    // Further undos are a no-op rather than an error
    form.undo();
    expect(form.state.name).toBe('Ada');
  });

  it('caps the undo history', () => {
    const form = new FormState({ count: 0 }, { historyLimit: 2 });

    for (let i = 1; i <= 5; i++) {
      form.draft.count = i;
      form.commit();
    }

    form.undo();
    form.undo();
    expect(form.canUndo).toBe(false);
    expect(form.state.count).toBe(3);
  });

  it('blocks the commit and collects errors when the schema fails', () => {
    const form = new FormState(initial, { schema: nameRequired });

    form.draft.name = '';
    expect(form.commit()).toBe(false);

    expect(form.errors).toEqual({ name: 'Name is required' });
    // State is untouched and the draft keeps the invalid value so it can be corrected
    expect(form.state.name).toBe('Ada');
    expect(form.draft.name).toBe('');
  });

  it('clears errors once the schema passes', () => {
    const form = new FormState(initial, { schema: nameRequired });

    form.draft.name = '';
    form.commit();
    expect(form.errors.name).toBe('Name is required');

    form.draft.name = 'Grace';
    expect(form.commit()).toBe(true);
    expect(form.errors).toEqual({});
  });

  it('clears errors on revert', () => {
    const form = new FormState(initial, { schema: nameRequired });

    form.draft.name = '';
    form.commit();
    expect(form.errors.name).toBe('Name is required');

    form.revert();
    expect(form.errors).toEqual({});
  });

  it('nests errors by schema path', () => {
    const schema: FormSchema<Person> = {
      safeParse: () => ({
        success: false as const,
        error: { issues: [{ path: ['address', 'city'], message: 'City is required' }] },
      }),
    };
    const form = new FormState(initial, { schema });

    form.commit();
    expect(form.errors).toEqual({ address: { city: 'City is required' } });
  });

  it('does not share nested objects between the draft and the committed state', () => {
    const form = new FormState(initial);

    form.commit();
    form.draft.address.city = 'New York';

    expect(form.state.address.city).toBe('London');
  });
});
