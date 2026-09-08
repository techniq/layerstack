/**
 * Registry of what has already been injected, keyed by the root it went into.
 *
 * `Symbol.for` rather than a module-level `WeakMap` so that two copies of this code — the
 * attachment and its deprecated action counterpart, or two versions of this package on one page —
 * still agree and inject a given block only once.
 */
const REGISTRY = Symbol.for('layerstack.injectedStyles');

type InjectionRoot = (Document | ShadowRoot) & {
  [REGISTRY]?: Set<string>;
};

/**
 * Add a stylesheet to the document (or shadow root) containing `node`, once.
 *
 * Attachments that need a pseudo-element cannot express it inline, and cannot rely on a CSS
 * framework generating a class for them — a class applied from library code is never seen by
 * Tailwind's scanner.  Shipping the rule from the attachment itself keeps it self-contained and
 * framework-agnostic.
 *
 * Rules are wrapped in a `@layer`, which puts them below any unlayered app CSS.  That alone is not
 * enough — a layer declared here sorts *after* one the app declared earlier (Tailwind's
 * `utilities`, say), so callers should also wrap their selectors in `:where()` to drop them to zero
 * specificity.  Between the two, an app rule targeting the same element wins whatever it uses.
 */
export function injectStyles(node: Element, id: string, css: string) {
  const rootNode = node.getRootNode();
  const root = (
    typeof ShadowRoot !== 'undefined' && rootNode instanceof ShadowRoot
      ? rootNode
      : node.ownerDocument
  ) as InjectionRoot | null;

  if (!root) {
    return;
  }

  const injected = (root[REGISTRY] ??= new Set<string>());
  if (injected.has(id)) {
    return;
  }
  injected.add(id);

  const layered = `@layer layerstack {\n${css}\n}`;

  // Constructable stylesheets keep the rules out of the DOM entirely, and work in a shadow root
  if ('adoptedStyleSheets' in root) {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(layered);
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      return;
    } catch {
      // Fall through — some browsers reject constructing a stylesheet, and a CSP without
      // `style-src 'unsafe-inline'` can reject the `<style>` below too.  Neither is fatal: the
      // effect is decorative and simply will not render.
    }
  }

  const style = node.ownerDocument.createElement('style');
  style.dataset.layerstack = id;
  style.textContent = layered;
  // Duck-typed rather than `instanceof Document`, which is false for a document from another realm
  const parent = 'head' in root && root.head ? root.head : root;
  parent.appendChild(style);
}
