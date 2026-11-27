// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sticky, stickyContext } from './sticky.js';

let node: HTMLElement;

beforeEach(() => {
  node = document.createElement('div');
  document.body.appendChild(node);
});

/**
 * happy-dom's CSS parser rejects `calc()` containing `var()` on standard properties (custom
 * properties are stored verbatim), so the edge offsets never land in `node.style`.  Browsers accept
 * them, so assert the values the attachment writes rather than what this DOM chose to keep.
 */
function trackSetProperty() {
  const calls = new Map<string, string>();
  vi.spyOn(node.style, 'setProperty').mockImplementation((property, value) => {
    calls.set(property, value ?? '');
  });
  return calls;
}

describe('sticky', () => {
  it('defaults to sticking to the top when no options are passed', () => {
    const calls = trackSetProperty();

    sticky()(node);

    expect(calls.get('position')).toBe('sticky');
    expect(calls.get('top')).toBe('calc(var(--sticky-top, 0px) + 0px)');
  });

  it('offsets the top edge by `offsetTop`, for nested table headers', () => {
    vi.spyOn(node, 'offsetTop', 'get').mockReturnValue(24);
    const calls = trackSetProperty();

    sticky({ top: true })(node);

    expect(calls.get('top')).toBe('calc(var(--sticky-top, 0px) + 24px)');
  });

  it('sets a property per enabled edge', () => {
    const calls = trackSetProperty();

    sticky({ bottom: true, left: true, right: true })(node);

    expect(calls.get('position')).toBe('sticky');
    expect(calls.get('bottom')).toBe('calc(var(--sticky-bottom, 0px))');
    expect(calls.get('left')).toBe('calc(var(--sticky-left, 0px))');
    expect(calls.get('right')).toBe('calc(var(--sticky-right, 0px))');
    expect(calls.has('top')).toBe(false);
  });

  it('ignores disabled edges and does not position when every edge is disabled', () => {
    const calls = trackSetProperty();

    sticky({ top: false, bottom: false })(node);

    expect(calls.has('position')).toBe(false);
    expect(calls.has('top')).toBe(false);
    expect(calls.has('bottom')).toBe(false);
  });

  it('reverses its styles on cleanup', () => {
    const cleanup = sticky({ top: true })(node);
    expect(node.style.getPropertyValue('position')).toBe('sticky');

    cleanup?.();
    expect(node.style.getPropertyValue('position')).toBe('');
    expect(node.style.getPropertyValue('top')).toBe('');
  });
});

describe('stickyContext', () => {
  it('sets the offsets `sticky` children position against', () => {
    stickyContext()(node);

    expect(node.style.getPropertyValue('--sticky-top')).toBe('0px');
    expect(node.style.getPropertyValue('--sticky-bottom')).toBe('0px');
  });

  it('scrolls the container itself for `container` type', () => {
    stickyContext({ type: 'container' })(node);

    expect(node.style.getPropertyValue('overflow')).toBe('scroll');
    expect(node.style.getPropertyValue('--sticky-top')).toBe('0px');
  });

  it('subtracts the offset of any scrolling ancestor', () => {
    const scrollParent = document.createElement('div');
    scrollParent.style.setProperty('overflow', 'auto');
    document.body.appendChild(scrollParent);
    scrollParent.appendChild(node);

    vi.spyOn(node, 'offsetTop', 'get').mockReturnValue(50);
    vi.spyOn(scrollParent, 'offsetTop', 'get').mockReturnValue(20);

    stickyContext()(node);

    expect(node.style.getPropertyValue('--sticky-top')).toBe('30px');
  });

  it('reverses its styles on cleanup', () => {
    const cleanup = stickyContext({ type: 'container' })(node);
    cleanup?.();

    expect(node.style.getPropertyValue('overflow')).toBe('');
    expect(node.style.getPropertyValue('--sticky-top')).toBe('');
    expect(node.style.getPropertyValue('--sticky-bottom')).toBe('');
  });
});
