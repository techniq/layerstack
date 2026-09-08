// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';

import { spotlight } from './spotlight.js';

let node: HTMLElement;

beforeEach(() => {
  node = document.createElement('div');
  document.body.appendChild(node);
});

describe('spotlight', () => {
  it('marks the element with the attribute its injected rule targets', () => {
    spotlight()(node);

    expect(node.hasAttribute('data-spotlight')).toBe(true);
  });

  it('adds no classes at all — Tailwind never scans a class added from a library', () => {
    spotlight({ radius: '100px', hover: { radius: '50px' } })(node);

    expect([...node.classList]).toEqual([]);
  });

  it('establishes a positioning context and its own stacking context', () => {
    spotlight()(node);

    expect(node.style.position).toBe('relative');
    expect(node.style.isolation).toBe('isolate');
  });

  it('leaves an element the app already positioned alone', () => {
    node.style.position = 'absolute';

    spotlight()(node);

    expect(node.style.position).toBe('absolute');
  });

  it('sets no spotlight properties when given no options, leaving the defaults to apply', () => {
    spotlight()(node);

    expect(node.style.getPropertyValue('--default-spotlight-radius')).toBe('');
  });

  it('writes each option as its `--default-spotlight-*` property', () => {
    spotlight({
      radius: '100px',
      borderWidth: '2px',
      borderColorStops: 'red, blue',
      surfaceColorStops: 'white, black',
    })(node);

    expect(node.style.getPropertyValue('--default-spotlight-radius')).toBe('100px');
    expect(node.style.getPropertyValue('--default-spotlight-border-width')).toBe('2px');
    expect(node.style.getPropertyValue('--default-spotlight-border-color-stops')).toBe('red, blue');
    expect(node.style.getPropertyValue('--default-spotlight-surface-color-stops')).toBe(
      'white, black'
    );
  });

  it('writes hover options as their `--hover-spotlight-*` counterparts', () => {
    spotlight({ radius: '100px', hover: { radius: '50px', borderWidth: '4px' } })(node);

    expect(node.style.getPropertyValue('--default-spotlight-radius')).toBe('100px');
    expect(node.style.getPropertyValue('--hover-spotlight-radius')).toBe('50px');
    expect(node.style.getPropertyValue('--hover-spotlight-border-width')).toBe('4px');
    expect(node.style.getPropertyValue('--default-spotlight-border-width')).toBe('');
  });

  it('reverses its class and properties on cleanup', () => {
    const cleanup = spotlight({ radius: '100px', hover: { radius: '50px' } })(node);
    cleanup?.();

    expect(node.hasAttribute('data-spotlight')).toBe(false);
    expect(node.style.getPropertyValue('--default-spotlight-radius')).toBe('');
    expect(node.style.getPropertyValue('--hover-spotlight-radius')).toBe('');
    expect(node.style.position).toBe('');
  });
});
