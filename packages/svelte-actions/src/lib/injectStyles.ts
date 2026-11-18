/**
 * Add a stylesheet to the document (or shadow root) containing `node`, once.
 *
 * A copy of the helper in `@layerstack/svelte-attachments`, so this deprecated package stays
 * dependency-free.  The registry key is shared, so whichever package runs first wins and a given
 * block is still injected only once even when both are on the page.
 */
const REGISTRY = Symbol.for('layerstack.injectedStyles');

type InjectionRoot = (Document | ShadowRoot) & {
  [REGISTRY]?: Set<string>;
};

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

  if ('adoptedStyleSheets' in root) {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(layered);
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      return;
    } catch {
      // Fall through to a `<style>` element
    }
  }

  const style = node.ownerDocument.createElement('style');
  style.dataset.layerstack = id;
  style.textContent = layered;
  // Duck-typed rather than `instanceof Document`, which is false for a document from another realm
  const parent = 'head' in root && root.head ? root.head : root;
  parent.appendChild(style);
}
