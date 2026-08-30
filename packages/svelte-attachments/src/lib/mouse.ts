import type { Attachment } from 'svelte/attachments';

export type LongpressOptions = {
  /** How long the element must be held, in milliseconds */
  duration?: number;
  /** Called once the element has been held for `duration` */
  onLongpress?: () => void;
};

/** Call back once an element has been pressed for a duration of time */
export function longpress(options: LongpressOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function onMouseDown() {
      timeoutId = setTimeout(() => options.onLongpress?.(), options.duration ?? 500);
    }

    function onMouseUp() {
      clearTimeout(timeoutId);
    }

    node.addEventListener('mousedown', onMouseDown);
    node.addEventListener('mouseup', onMouseUp);

    return () => {
      clearTimeout(timeoutId);
      node.removeEventListener('mousedown', onMouseDown);
      node.removeEventListener('mouseup', onMouseUp);
    };
  };
}

export type MovePosition = { x: number; y: number };
export type MoveDelta = MovePosition & { dx: number; dy: number };

export type MovableOptions = {
  /** Number of pixels to step */
  step?: number;
  /** Percentage of the parent element's size to step */
  stepPercent?: number;
  axis?: 'x' | 'y' | 'xy';
  onMoveStart?: (detail: MovePosition) => void;
  onMove?: (detail: MoveDelta) => void;
  onMoveEnd?: (detail: MovePosition) => void;
};

/**
 * Track pointer movement between mousedown and mouseup on the node.  Replaces the `movestart`,
 * `move`, and `moveend` custom events with callbacks.
 */
export function movable(options: MovableOptions = {}): Attachment<HTMLElement | SVGElement> {
  return (node: HTMLElement | SVGElement) => {
    let lastX = 0;
    let lastY = 0;
    let moved = false;

    function onMouseMove(event: MouseEvent) {
      moved = true;

      // TODO: Handle page scroll?  `clientX`/`clientY` are viewport-relative
      let dx = event.clientX - lastX;
      let dy = event.clientY - lastY;

      const xEnabled = options.axis?.includes('x') ?? true;
      const yEnabled = options.axis?.includes('y') ?? true;

      if (options.step) {
        if (Math.abs(dx) >= options.step) {
          const overStep = dx % options.step;
          dx = dx - overStep;
          lastX = event.clientX - overStep;
        } else {
          dx = 0;
        }

        if (Math.abs(dy) >= options.step) {
          const overStep = dy % options.step;
          dy = dy - overStep;
          lastY = event.clientY - overStep;
        } else {
          dy = 0;
        }
      } else if (options.stepPercent) {
        const parentWidth = node.parentElement?.offsetWidth ?? 0;
        const parentHeight = node.parentElement?.offsetHeight ?? 0;

        if (Math.abs(dx / parentWidth) >= options.stepPercent) {
          const overStep = dx % (parentWidth * options.stepPercent);
          dx = dx - overStep;
          lastX = event.clientX - overStep;
        } else {
          dx = 0;
        }

        if (Math.abs(dy / parentHeight) >= options.stepPercent) {
          const overStep = dy % (parentHeight * options.stepPercent);
          dy = dy - overStep;
          lastY = event.clientY - overStep;
        } else {
          dy = 0;
        }
      } else {
        lastX = event.clientX;
        lastY = event.clientY;
      }

      if ((xEnabled && dx) || (yEnabled && dy)) {
        options.onMove?.({ x: lastX, y: lastY, dx: xEnabled ? dx : 0, dy: yEnabled ? dy : 0 });
      }
    }

    function onMouseUp(event: MouseEvent) {
      lastX = event.clientX;
      lastY = event.clientY;

      options.onMoveEnd?.({ x: lastX, y: lastY });

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseDown(event: MouseEvent) {
      lastX = event.clientX;
      lastY = event.clientY;
      moved = false;

      options.onMoveStart?.({ x: lastX, y: lastY });

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    /** Swallow the click that ends a drag, so dragging a control does not also activate it */
    function onClick(event: MouseEvent) {
      if (moved) {
        event.stopImmediatePropagation();
      }
    }

    node.addEventListener('mousedown', onMouseDown as EventListener);
    node.addEventListener('click', onClick as EventListener);

    return () => {
      node.removeEventListener('mousedown', onMouseDown as EventListener);
      node.removeEventListener('click', onClick as EventListener);
      // Also detach the window listeners, in case the node is removed mid-drag
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  };
}

export type MouseCoordsOptions = {
  /** Element to listen on.  Defaults to the node itself */
  target?: HTMLElement;
};

/** Set pointer coordinates relative to the node as `--x`/`--y` CSS variables */
export function mouseCoords(options: MouseCoordsOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const target = options.target ?? node;

    function onMouseMove(e: MouseEvent) {
      // Relative to the node rather than the viewport (`e.offsetX/Y` varies with the event target)
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--x', `${e.clientX - rect.left}px`);
      node.style.setProperty('--y', `${e.clientY - rect.top}px`);
    }

    function onMouseLeave() {
      node.style.setProperty('--x', '-9999px');
      node.style.setProperty('--y', '-9999px');
    }

    // Initialize off-screen so any hover styling starts hidden
    onMouseLeave();

    target.addEventListener('mousemove', onMouseMove);
    node.addEventListener('mouseleave', onMouseLeave);

    return () => {
      target.removeEventListener('mousemove', onMouseMove);
      node.removeEventListener('mouseleave', onMouseLeave);
    };
  };
}
