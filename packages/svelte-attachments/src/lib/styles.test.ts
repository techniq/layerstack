// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { computedStyles, styleProps } from './styles.js';

let node: HTMLElement;

beforeEach(() => {
  node = document.createElement('div');
  document.body.appendChild(node);
});

describe('styleProps', () => {
  it('sets style properties, including custom properties', () => {
    styleProps({ color: 'red', '--gap': '4px' })(node);

    expect(node.style.getPropertyValue('color')).toBe('red');
    expect(node.style.getPropertyValue('--gap')).toBe('4px');
  });

  it('writes booleans as 1/0 so they can be used in `calc()`', () => {
    styleProps({ '--on': true, '--off': false })(node);

    expect(node.style.getPropertyValue('--on')).toBe('1');
    expect(node.style.getPropertyValue('--off')).toBe('0');
  });

  it('ignores null and undefined values', () => {
    styleProps({ '--set': 'x', '--nullish': null, '--missing': undefined })(node);

    expect(node.style.getPropertyValue('--set')).toBe('x');
    expect(node.style.getPropertyValue('--nullish')).toBe('');
    expect(node.style.getPropertyValue('--missing')).toBe('');
  });

  it('removes properties on cleanup, so a re-run drops properties that went away', () => {
    // An attachment re-run is a cleanup followed by a fresh call
    const cleanup = styleProps({ '--a': '1', '--b': '2' })(node);
    cleanup?.();

    expect(node.style.getPropertyValue('--a')).toBe('');
    expect(node.style.getPropertyValue('--b')).toBe('');

    styleProps({ '--a': '3' })(node);
    expect(node.style.getPropertyValue('--a')).toBe('3');
    expect(node.style.getPropertyValue('--b')).toBe('');
  });

  it('leaves properties it did not set alone', () => {
    node.style.setProperty('--external', 'keep');

    const cleanup = styleProps({ '--a': '1' })(node);
    cleanup?.();

    expect(node.style.getPropertyValue('--external')).toBe('keep');
  });
});

describe('computedStyles', () => {
  it('calls back with the computed styles immediately', () => {
    const onStyles = vi.fn();

    computedStyles(onStyles)(node);

    expect(onStyles).toHaveBeenCalledTimes(1);
    expect(onStyles.mock.calls[0][0]).toBeInstanceOf(CSSStyleDeclaration);
  });

  it('calls back again when `style` changes, and stops after cleanup', async () => {
    const onStyles = vi.fn();
    const cleanup = computedStyles(onStyles)(node);

    node.style.setProperty('color', 'red');
    await vi.waitFor(() => expect(onStyles).toHaveBeenCalledTimes(2));

    cleanup?.();

    node.style.setProperty('color', 'blue');
    // Give the observer a chance to fire before asserting it did not
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(onStyles).toHaveBeenCalledTimes(2);
  });
});
