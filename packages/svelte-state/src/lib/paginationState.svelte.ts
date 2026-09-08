import { clamp } from '@layerstack/utils';

export type PaginationOptions = {
  /** Initial page  */
  page?: number;

  /** Number of items per page */
  perPage?: number;

  /** Total number of items */
  total?: number;
};

export class PaginationState {
  // `$state` so `page`/`perPage`/`total` — and everything derived from them (`totalPages`,
  // `from`, `to`, `hasNext`, ...) — are reactive when read in a template or `$derived`
  #page = $state(1);
  #perPage = $state(25);
  #total = $state(0);

  constructor(options: PaginationOptions = {}) {
    this.#page = options.page ?? 1;
    this.#perPage = options.perPage ?? 25;
    this.#total = options.total ?? 0;
  }

  get page() {
    return this.#page;
  }

  set page(value: number) {
    // Do not allow page to exceed bounds (ex. call nextPage() when on last page)
    this.#page = clamp(value, 1, this.totalPages);
  }

  get perPage() {
    return this.#perPage;
  }

  set perPage(value: number) {
    this.#perPage = value;
  }

  get total() {
    return this.#total;
  }

  set total(value: number) {
    this.#total = value;
  }

  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }

  get from() {
    return Math.min(this.total, Math.max(0, (this.page - 1) * this.perPage + 1));
  }

  get to() {
    return Math.min(this.total, this.page * this.perPage);
  }

  get isFirst() {
    return this.page === 1;
  }

  get isLast() {
    return this.page >= this.totalPages;
  }

  get hasPrevious() {
    return this.page > 1 && this.totalPages > 0;
  }

  get hasNext() {
    return this.page < this.totalPages;
  }

  nextPage = () => {
    this.page = this.page + 1;
  };

  prevPage = () => {
    this.page = this.page - 1;
  };

  firstPage = () => {
    this.page = 1;
  };

  lastPage = () => {
    this.page = Math.ceil(this.total / this.perPage);
  };

  slice<T>(data: T[]) {
    return data.slice((this.page - 1) * this.perPage, this.page * this.perPage);
  }
}
