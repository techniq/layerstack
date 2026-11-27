// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomTracker } from './domTracker.js';

let node: HTMLElement;

beforeEach(() => {
  node = document.createElement('div');
  document.body.appendChild(node);
});

describe('DomTracker', () => {
  it('reverses classes, styles, and attributes on reset', () => {
    const tracker = new DomTracker(node);

    tracker.addClass('one', 'two');
    tracker.addStyle('position', 'sticky');
    tracker.addAttribute('colspan', '2');

    expect(node.classList.contains('one')).toBe(true);
    expect(node.classList.contains('two')).toBe(true);
    expect(node.style.position).toBe('sticky');
    expect(node.getAttribute('colspan')).toBe('2');

    tracker.reset();

    expect(node.classList.contains('one')).toBe(false);
    expect(node.classList.contains('two')).toBe(false);
    expect(node.style.position).toBe('');
    expect(node.hasAttribute('colspan')).toBe(false);
  });

  it('leaves changes it did not make alone', () => {
    node.classList.add('external');
    node.style.setProperty('color', 'red');
    node.setAttribute('data-external', 'yes');

    const tracker = new DomTracker(node);
    tracker.addClass('tracked');
    tracker.reset();

    expect(node.classList.contains('external')).toBe(true);
    expect(node.style.color).toBe('red');
    expect(node.getAttribute('data-external')).toBe('yes');
  });

  it('removes event listeners on reset', () => {
    const tracker = new DomTracker(node);
    const listener = vi.fn();

    tracker.addEventListener('click', listener);
    node.dispatchEvent(new Event('click'));
    expect(listener).toHaveBeenCalledTimes(1);

    tracker.reset();
    node.dispatchEvent(new Event('click'));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('runs nested attachment cleanups on reset', () => {
    const tracker = new DomTracker(node);
    const cleanup = vi.fn();

    tracker.addAttachment((n) => {
      n.setAttribute('data-attached', 'yes');
      return cleanup;
    });

    expect(node.getAttribute('data-attached')).toBe('yes');
    expect(cleanup).not.toHaveBeenCalled();

    tracker.reset();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('tolerates attachments that return no cleanup', () => {
    const tracker = new DomTracker(node);

    tracker.addAttachment((n) => {
      n.setAttribute('data-attached', 'yes');
    });

    expect(() => tracker.reset()).not.toThrow();
  });

  it('is idempotent — a second reset does not re-run cleanups', () => {
    const tracker = new DomTracker(node);
    const cleanup = vi.fn();

    tracker.addClass('one');
    tracker.addCleanup(cleanup);

    tracker.reset();
    tracker.reset();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
