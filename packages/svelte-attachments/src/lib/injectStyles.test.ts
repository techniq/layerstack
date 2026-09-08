// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';

import { injectStyles } from './injectStyles.js';

const REGISTRY = Symbol.for('layerstack.injectedStyles');

let node: HTMLElement;

beforeEach(() => {
  // Each test starts from a clean document, since injection is deliberately once-per-root
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.adoptedStyleSheets = [];
  delete (document as any)[REGISTRY];

  node = document.createElement('div');
  document.body.appendChild(node);
});

/** Everything injected into a root, however it got there */
function injectedCss(root: Document | ShadowRoot) {
  const adopted = [...root.adoptedStyleSheets].map((sheet) =>
    [...sheet.cssRules].map((rule) => rule.cssText).join('')
  );
  const elements = [...root.querySelectorAll('style')].map((style) => style.textContent ?? '');
  return [...adopted, ...elements];
}

describe('injectStyles', () => {
  it('injects the css into the document', () => {
    injectStyles(node, 'test', '.probe { color: red }');

    expect(injectedCss(document)).toHaveLength(1);
  });

  it('falls back to a `<style>` element, wrapping the rules in a layer', () => {
    // Stand in for a browser that rejects constructing a stylesheet
    const original = globalThis.CSSStyleSheet;
    globalThis.CSSStyleSheet = class {
      constructor() {
        throw new Error('nope');
      }
    } as any;

    try {
      injectStyles(node, 'test', '.probe { color: red }');
    } finally {
      globalThis.CSSStyleSheet = original;
    }

    const style = document.head.querySelector('style');
    expect(style?.dataset.layerstack).toBe('test');
    // Layered, so anything the app writes unlayered wins over it
    expect(style?.textContent).toContain('@layer layerstack {');
    expect(style?.textContent).toContain('.probe { color: red }');
  });

  it('injects a given id only once per root', () => {
    injectStyles(node, 'test', '.probe { color: red }');
    injectStyles(node, 'test', '.probe { color: red }');

    const other = document.createElement('div');
    document.body.appendChild(other);
    injectStyles(other, 'test', '.probe { color: red }');

    expect(injectedCss(document)).toHaveLength(1);
  });

  it('injects each distinct id', () => {
    injectStyles(node, 'one', '.one { color: red }');
    injectStyles(node, 'two', '.two { color: blue }');

    expect(injectedCss(document)).toHaveLength(2);
  });

  it('shares its registry across copies of the helper via a global symbol', () => {
    injectStyles(node, 'test', '.probe { color: red }');

    // What a second copy of this module — the deprecated action package — would see
    expect((document as any)[REGISTRY].has('test')).toBe(true);
  });

  it('injects into a shadow root rather than the document', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('div');
    shadow.appendChild(inner);

    injectStyles(inner, 'test', '.probe { color: red }');

    expect(injectedCss(shadow)).toHaveLength(1);
    expect(injectedCss(document)).toHaveLength(0);
  });
});
