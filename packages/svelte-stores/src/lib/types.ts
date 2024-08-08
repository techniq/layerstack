import type { derived, Readable } from 'svelte/store';

// Export until `Stores` and `StoresValues` are exported from svelte -  https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts#L111-L112
export type Stores = Parameters<typeof derived>[0];
export type StoresValues<T> =
  T extends Readable<infer U>
    ? U
    : {
        [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
      };
