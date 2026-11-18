// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { scrollFade, scrollShadow } from './scroll.js';

let node: HTMLElement;

beforeEach(() => {
  node = document.createElement('div');
  document.body.appendChild(node);
});

/** happy-dom reports every layout metric as 0, so stand in for a scrollable box */
function makeScrollable({
  clientHeight = 100,
  scrollHeight = 100,
  clientWidth = 100,
  scrollWidth = 100,
  scrollTop = 0,
  scrollLeft = 0,
} = {}) {
  for (const [property, value] of Object.entries({
    clientHeight,
    scrollHeight,
    clientWidth,
    scrollWidth,
    scrollTop,
    scrollLeft,
  })) {
    Object.defineProperty(node, property, { value, configurable: true });
  }
}

describe('scrollShadow', () => {
  it('marks the element with the attribute its injected rule targets, and adds no classes', () => {
    makeScrollable();
    scrollShadow()(node);

    expect(node.hasAttribute('data-scroll-shadow')).toBe(true);
    expect([...node.classList]).toEqual([]);
  });

  it('shows only a bottom shadow when scrolled to the top', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 0 });
    scrollShadow()(node);
    node.dispatchEvent(new Event('scroll'));

    const shadow = node.style.getPropertyValue('--scroll-shadow');
    expect(shadow).toContain('inset 0px -10px');
    expect(shadow).not.toContain('inset 0px 10px');
  });

  it('shows both vertical shadows when scrolled to the middle', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 100 });
    scrollShadow()(node);
    node.dispatchEvent(new Event('scroll'));

    const shadow = node.style.getPropertyValue('--scroll-shadow');
    expect(shadow).toContain('inset 0px 10px');
    expect(shadow).toContain('inset 0px -10px');
  });

  it('shows only a top shadow when scrolled to the bottom', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 200 });
    scrollShadow()(node);
    node.dispatchEvent(new Event('scroll'));

    const shadow = node.style.getPropertyValue('--scroll-shadow');
    expect(shadow).toContain('inset 0px 10px');
    expect(shadow).not.toContain('inset 0px -10px');
  });

  it('eases the offset in by `scrollRatio` rather than snapping', () => {
    // 20px scrolled / ratio 5 = 4px, below the 10px maximum
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 20 });
    scrollShadow()(node);
    node.dispatchEvent(new Event('scroll'));

    expect(node.style.getPropertyValue('--scroll-shadow')).toContain('inset 0px 4px');
  });

  it('honors per-edge options', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 200 });
    scrollShadow({ top: { color: 'red', offset: 20, blur: 1, spread: 0 } })(node);
    node.dispatchEvent(new Event('scroll'));

    expect(node.style.getPropertyValue('--scroll-shadow')).toContain('inset 0px 20px 1px 0px red');
  });

  it('reverses the class and property on cleanup', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300 });
    const cleanup = scrollShadow()(node);
    node.dispatchEvent(new Event('scroll'));

    cleanup?.();

    expect(node.hasAttribute('data-scroll-shadow')).toBe(false);
    expect(node.style.getPropertyValue('--scroll-shadow')).toBe('');
  });

  it('stops listening after cleanup', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 100 });
    const cleanup = scrollShadow()(node);
    cleanup?.();

    const setProperty = vi.spyOn(node.style, 'setProperty');
    node.dispatchEvent(new Event('scroll'));

    expect(setProperty).not.toHaveBeenCalled();
  });
});

describe('scrollFade', () => {
  it('sets `overflow` directly rather than relying on a Tailwind class', () => {
    makeScrollable();
    scrollFade()(node);

    expect(node.style.overflow).toBe('auto');
    expect([...node.classList]).toEqual([]);
  });

  it('masks the bottom when scrolled to the top of a vertical container', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 0 });
    scrollFade()(node);
    node.dispatchEvent(new Event('scroll'));

    expect(node.style.maskImage).toContain('linear-gradient(to bottom');
    // 200px of remaining scroll / ratio 5 = 40px, still under the 50px maximum
    expect(node.style.maskImage).toContain('calc(100% - 40px)');
  });

  it('masks horizontally when only the width overflows', () => {
    makeScrollable({ clientWidth: 100, scrollWidth: 300, scrollLeft: 50 });
    scrollFade()(node);
    node.dispatchEvent(new Event('scroll'));

    expect(node.style.maskImage).toContain('linear-gradient(to right');
  });

  it('applies no mask when nothing overflows', () => {
    makeScrollable();
    scrollFade()(node);
    node.dispatchEvent(new Event('scroll'));

    expect(node.style.maskImage).toBe('');
  });

  it('caps the fade at `length`', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 1000, scrollTop: 500 });
    scrollFade({ length: 20 })(node);
    node.dispatchEvent(new Event('scroll'));

    expect(node.style.maskImage).toContain('rgba(0, 0, 0, 1) 20px');
  });

  it('clears the mask on cleanup', () => {
    makeScrollable({ clientHeight: 100, scrollHeight: 300, scrollTop: 50 });
    const cleanup = scrollFade()(node);
    node.dispatchEvent(new Event('scroll'));

    cleanup?.();

    expect(node.style.maskImage).toBe('');
    expect(node.style.overflow).toBe('');
  });
});
