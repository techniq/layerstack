---
'@layerstack/svelte-actions': patch
---

fix(spotlight): Filter empty class strings before calling node.classList.add(...) to fix SyntaxError (recent browser change?)
