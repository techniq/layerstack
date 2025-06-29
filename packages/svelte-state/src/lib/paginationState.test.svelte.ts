import { describe, it, expect } from 'vitest';

import { PaginationState } from './paginationState.svelte.js';

describe('PaginationState', () => {
  it('should initialize with default values', () => {
    const paginationState = new PaginationState();
    expect(paginationState.page).toEqual(1);
    expect(paginationState.perPage).toEqual(25);
    expect(paginationState.total).toEqual(0);
    expect(paginationState.totalPages).toEqual(0);
    expect(paginationState.from).toEqual(0);
    expect(paginationState.to).toEqual(0);
    expect(paginationState.isFirst).toEqual(true);
    expect(paginationState.isLast).toEqual(true);
    expect(paginationState.hasPrevious).toEqual(false);
    expect(paginationState.hasNext).toEqual(false);
  });

  it('should initialize with total only', () => {
    const paginationState = new PaginationState({ total: 100 });
    expect(paginationState.page).toEqual(1);
    expect(paginationState.perPage).toEqual(25);
    expect(paginationState.total).toEqual(100);
    expect(paginationState.totalPages).toEqual(4);
    expect(paginationState.from).toEqual(1);
    expect(paginationState.to).toEqual(25);
    expect(paginationState.isFirst).toEqual(true);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(false);
    expect(paginationState.hasNext).toEqual(true);
  });

  it('should initialize with page', () => {
    const paginationState = new PaginationState({ page: 2, total: 100 });
    expect(paginationState.page).toEqual(2);
    expect(paginationState.perPage).toEqual(25);
    expect(paginationState.total).toEqual(100);
    expect(paginationState.totalPages).toEqual(4);
    expect(paginationState.from).toEqual(26);
    expect(paginationState.to).toEqual(50);
    expect(paginationState.isFirst).toEqual(false);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(true);
    expect(paginationState.hasNext).toEqual(true);
  });

  it('should initialize with perPage', () => {
    const paginationState = new PaginationState({ perPage: 10, total: 100 });
    expect(paginationState.page).toEqual(1);
    expect(paginationState.perPage).toEqual(10);
    expect(paginationState.total).toEqual(100);
    expect(paginationState.totalPages).toEqual(10);
    expect(paginationState.from).toEqual(1);
    expect(paginationState.to).toEqual(10);
    expect(paginationState.isFirst).toEqual(true);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(false);
    expect(paginationState.hasNext).toEqual(true);
  });

  it('should increment page', () => {
    const paginationState = new PaginationState({ total: 100 });
    expect(paginationState.page).toEqual(1);
    expect(paginationState.from).toEqual(1);
    expect(paginationState.to).toEqual(25);
    expect(paginationState.isFirst).toEqual(true);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(false);
    expect(paginationState.hasNext).toEqual(true);

    paginationState.nextPage();
    expect(paginationState.page).toEqual(2);
    expect(paginationState.from).toEqual(26);
    expect(paginationState.to).toEqual(50);
    expect(paginationState.isFirst).toEqual(false);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(true);
    expect(paginationState.hasNext).toEqual(true);
  });

  it('should decrement page', () => {
    const paginationState = new PaginationState({ page: 2, total: 100 });
    expect(paginationState.page).toEqual(2);
    expect(paginationState.from).toEqual(26);
    expect(paginationState.to).toEqual(50);
    expect(paginationState.isFirst).toEqual(false);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(true);
    expect(paginationState.hasNext).toEqual(true);

    paginationState.prevPage();
    expect(paginationState.page).toEqual(1);
    expect(paginationState.from).toEqual(1);
    expect(paginationState.to).toEqual(25);
    expect(paginationState.isFirst).toEqual(true);
    expect(paginationState.isLast).toEqual(false);
    expect(paginationState.hasPrevious).toEqual(false);
    expect(paginationState.hasNext).toEqual(true);
  });

  it('should clamp page', () => {
    const paginationState = new PaginationState({ page: 4, total: 100 });
    expect(paginationState.page).toEqual(4);
    expect(paginationState.from).toEqual(76);
    expect(paginationState.to).toEqual(100);
    expect(paginationState.isFirst).toEqual(false);
    expect(paginationState.isLast).toEqual(true);
    expect(paginationState.hasPrevious).toEqual(true);
    expect(paginationState.hasNext).toEqual(false);

    paginationState.nextPage();
    expect(paginationState.page).toEqual(4);
    expect(paginationState.from).toEqual(76);
    expect(paginationState.to).toEqual(100);
    expect(paginationState.isFirst).toEqual(false);
    expect(paginationState.isLast).toEqual(true);
    expect(paginationState.hasPrevious).toEqual(true);
    expect(paginationState.hasNext).toEqual(false);
  });

  it('should slice data', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const paginationState = new PaginationState({ perPage: 5, total: data.length });
    expect(paginationState.slice(data)).toEqual([1, 2, 3, 4, 5]);

    paginationState.nextPage();
    expect(paginationState.slice(data)).toEqual([6, 7, 8, 9, 10]);

    paginationState.nextPage();
    expect(paginationState.slice(data)).toEqual([6, 7, 8, 9, 10]); // clamped

    paginationState.prevPage();
    expect(paginationState.slice(data)).toEqual([1, 2, 3, 4, 5]);

    paginationState.prevPage();
    expect(paginationState.slice(data)).toEqual([1, 2, 3, 4, 5]); // clamped
  });
});
