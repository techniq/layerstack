import type { Attachment } from 'svelte/attachments';

/**
 * Apply changes to an element with the ability to reverse them.
 *
 * Attachments re-run whenever the state they read changes, so a tracker is scoped to a single run:
 * create one at the top of the attachment, record each change as it is applied, and return
 * `() => tracker.reset()` as the cleanup.  Only the changes this tracker made are reversed, so
 * classes and attributes set by anything else are left alone.
 */
export class DomTracker {
  node: HTMLElement;

  changes: {
    classes: string[];
    styles: string[];
    attributes: string[];
    eventListeners: { type: string; listener: EventListener }[];
    cleanups: (() => void)[];
  };

  constructor(node: HTMLElement) {
    this.node = node;

    this.changes = {
      classes: [],
      styles: [],
      attributes: [],
      eventListeners: [],
      cleanups: [],
    };
  }

  addClass(...classNames: string[]) {
    this.node.classList.add(...classNames);
    this.changes.classes.push(...classNames);
  }

  addStyle(property: string, value: string) {
    this.node.style.setProperty(property, value);
    this.changes.styles.push(property);
  }

  addAttribute(qualifiedName: string, value: string) {
    this.node.setAttribute(qualifiedName, value);
    this.changes.attributes.push(qualifiedName);
  }

  addEventListener(type: string, listener: EventListener) {
    this.node.addEventListener(type, listener);
    this.changes.eventListeners.push({ type, listener });
  }

  /** Run another attachment against the same node and reverse it along with everything else */
  addAttachment(attachment: Attachment<HTMLElement>) {
    const cleanup = attachment(this.node);
    if (cleanup) {
      this.changes.cleanups.push(cleanup);
    }
  }

  /** Register an arbitrary cleanup to run with `reset()` */
  addCleanup(cleanup: () => void) {
    this.changes.cleanups.push(cleanup);
  }

  /** Reverse every change made through this tracker */
  reset() {
    this.changes.classes.forEach((className) => {
      this.node.classList.remove(className);
    });

    this.changes.styles.forEach((property) => {
      this.node.style.removeProperty(property);
    });

    this.changes.attributes.forEach((qualifiedName) => {
      this.node.removeAttribute(qualifiedName);
    });

    this.changes.eventListeners.forEach(({ type, listener }) => {
      this.node.removeEventListener(type, listener);
    });

    this.changes.cleanups.forEach((cleanup) => cleanup());

    this.changes = {
      classes: [],
      styles: [],
      attributes: [],
      eventListeners: [],
      cleanups: [],
    };
  }
}

export default DomTracker;
