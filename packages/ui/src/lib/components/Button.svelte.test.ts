import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createAttachmentKey } from 'svelte/attachments';

import Button from './Button.svelte';
import ButtonLabelHarness from './tests/ButtonLabelHarness.svelte';
import ButtonGroupHarness from './tests/ButtonGroupHarness.svelte';
import ButtonSettingsHarness from './tests/ButtonSettingsHarness.svelte';

const mdiHome = 'M12 2L2 7l10 5 10-5-10-5z';

function buttonOf(container: HTMLElement) {
  return container.querySelector('.Button') as HTMLElement;
}

describe('Button', () => {
  describe('element', () => {
    it('renders a `<button>` by default', async () => {
      const { container } = render(ButtonLabelHarness, {});

      const el = buttonOf(container);
      expect(el.tagName).toBe('BUTTON');
      expect(el.getAttribute('type')).toBe('button');
      expect(el.textContent?.trim()).toBe('Click me');
    });

    it('renders an `<a>` when `href` is set', async () => {
      // `target` is also a render option, so pass props explicitly here
      const { container } = render(ButtonLabelHarness, {
        props: { href: '/somewhere', target: '_blank' },
      });

      const el = buttonOf(container);
      expect(el.tagName).toBe('A');
      expect(el.getAttribute('href')).toBe('/somewhere');
      expect(el.getAttribute('target')).toBe('_blank');
      // `type`/`disabled` are button-only attributes and must not leak onto the anchor
      expect(el.getAttribute('type')).toBeNull();
    });

    it('honors an explicit `type`', async () => {
      const { container } = render(ButtonLabelHarness, { type: 'submit' });

      expect(buttonOf(container).getAttribute('type')).toBe('submit');
    });
  });

  describe('disabled', () => {
    it('sets both `disabled` and `aria-disabled`', async () => {
      const { container } = render(ButtonLabelHarness, { disabled: true });

      const el = buttonOf(container) as HTMLButtonElement;
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('aria-disabled')).toBe('true');
      expect(el.className).toContain('pointer-events-none');
    });

    it('marks an anchor `aria-disabled` without an invalid `disabled` attribute', async () => {
      const { container } = render(ButtonLabelHarness, { href: '/x', disabled: true });

      const el = buttonOf(container);
      expect(el.getAttribute('aria-disabled')).toBe('true');
      expect(el.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('variants', () => {
    it('applies a `variant-*` class', async () => {
      const { container } = render(ButtonLabelHarness, { variant: 'fill' });

      expect(buttonOf(container).className).toContain('variant-fill');
    });

    it('defaults to the `default` variant', async () => {
      const { container } = render(ButtonLabelHarness, {});

      expect(buttonOf(container).className).toContain('variant-default');
    });

    it('applies size padding', async () => {
      const sm = render(ButtonLabelHarness, { size: 'sm' });
      const lg = render(ButtonLabelHarness, { size: 'lg' });

      expect(buttonOf(sm.container).className).toContain('px-2');
      expect(buttonOf(lg.container).className).toContain('px-6');
    });

    it('applies `fullWidth`', async () => {
      const { container } = render(ButtonLabelHarness, { fullWidth: true });

      const el = buttonOf(container);
      expect(el.className).toContain('w-full');
      expect(el.className).not.toContain('inline-flex');
    });

    it('rounds fully when `rounded` is `full`', async () => {
      const { container } = render(ButtonLabelHarness, { rounded: 'full' });

      expect(buttonOf(container).className).toContain('rounded-full');
    });

    it('drops rounding when `rounded` is false', async () => {
      const { container } = render(ButtonLabelHarness, { rounded: false });

      const cls = buttonOf(container).className;
      expect(cls).not.toContain('rounded-full');
      expect(cls).not.toContain('rounded-sm');
    });
  });

  describe('icon', () => {
    it('renders an icon from path data', async () => {
      const { container } = render(ButtonLabelHarness, { icon: mdiHome });

      expect(container.querySelector('.Button .Icon')).not.toBeNull();
    });

    it('accepts `Icon` props', async () => {
      const { container } = render(ButtonLabelHarness, {
        icon: { data: mdiHome, class: 'text-danger' },
      });

      const icon = container.querySelector('.Button .Icon')!;
      expect(icon.classList.contains('text-danger')).toBe(true);
    });

    it('is icon-only (and round) with an icon and no children', async () => {
      const { container } = render(Button, { icon: mdiHome });

      const el = buttonOf(container);
      expect(el.className).toContain('rounded-full');
      // icon-only uses square padding rather than the wider label padding
      expect(el.className).toContain('p-2');
    });

    it('is not icon-only when children are present', async () => {
      const { container } = render(ButtonLabelHarness, { icon: mdiHome });

      expect(buttonOf(container).className).not.toContain('rounded-full');
    });

    it('respects an explicit `iconOnly`', async () => {
      const { container } = render(ButtonLabelHarness, { icon: mdiHome, iconOnly: true });

      expect(buttonOf(container).className).toContain('rounded-full');
    });
  });

  describe('loading', () => {
    it('replaces the icon with a progress circle', async () => {
      const { container } = render(ButtonLabelHarness, { icon: mdiHome, loading: true });

      expect(container.querySelector('.ProgressCircle')).not.toBeNull();
      expect(container.querySelector('.Button .Icon')).toBeNull();
    });

    it('renders an indeterminate circle', async () => {
      const { container } = render(ButtonLabelHarness, { loading: true });

      const progress = container.querySelector('.ProgressCircle')!;
      expect(progress.classList.contains('indeterminate')).toBe(true);
    });
  });

  describe('classes', () => {
    it('merges `class` and `classes.root`', async () => {
      const { container } = render(ButtonLabelHarness, {
        class: 'custom-class',
        classes: { root: 'root-class' },
      });

      const el = buttonOf(container);
      expect(el.classList.contains('custom-class')).toBe(true);
      expect(el.classList.contains('root-class')).toBe(true);
    });

    it('applies `classes.icon`', async () => {
      const { container } = render(ButtonLabelHarness, {
        icon: mdiHome,
        classes: { icon: 'icon-class' },
      });

      expect(container.querySelector('.Button .Icon')!.classList.contains('icon-class')).toBe(true);
    });

    it('applies `classes.loading`', async () => {
      const { container } = render(ButtonLabelHarness, {
        loading: true,
        classes: { loading: 'loading-class' },
      });

      expect(container.querySelector('.ProgressCircle')!.classList.contains('loading-class')).toBe(
        true
      );
    });
  });

  describe('rest props', () => {
    it('forwards click handlers', async () => {
      const onclick = vi.fn();
      const { container } = render(ButtonLabelHarness, { onclick });

      buttonOf(container).click();
      expect(onclick).toHaveBeenCalledTimes(1);
    });

    it('forwards arbitrary attributes', async () => {
      const { container } = render(ButtonLabelHarness, { 'data-testid': 'my-button' });

      expect(buttonOf(container).getAttribute('data-testid')).toBe('my-button');
    });

    it('applies attachments passed through rest props', async () => {
      // Replaces Svelte UX's `actions` prop + `multi` action — `{@attach}` values travel as
      // symbol-keyed props and are applied by the spread onto the element
      const attached: Element[] = [];
      const cleanup = vi.fn();
      const { container, unmount } = render(ButtonLabelHarness, {
        props: {
          [createAttachmentKey()]: (node: Element) => {
            attached.push(node);
            return cleanup;
          },
        },
      } as any);

      expect(attached).toHaveLength(1);
      expect(attached[0]).toBe(buttonOf(container));

      unmount();
      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  });

  describe('ButtonGroup', () => {
    it('applies group defaults to its buttons', async () => {
      const { container } = render(ButtonGroupHarness, { variant: 'fill', size: 'lg' });

      const buttons = [...container.querySelectorAll('.Button')];
      expect(buttons).toHaveLength(3);
      for (const button of buttons) {
        expect(button.className).toContain('variant-fill');
        expect(button.className).toContain('px-6');
      }
    });

    it('lets a button override the group', async () => {
      const { container } = render(ButtonGroupHarness, {
        variant: 'fill',
        count: 1,
        buttonProps: { variant: 'outline' },
      });

      expect(container.querySelector('.Button')!.className).toContain('variant-outline');
    });

    it('updates its buttons when the group props change', async () => {
      const screen = render(ButtonGroupHarness, { variant: 'fill', count: 1 });
      expect(screen.container.querySelector('.Button')!.className).toContain('variant-fill');

      await screen.rerender({ variant: 'outline', count: 1 });

      await vi.waitFor(() => {
        expect(screen.container.querySelector('.Button')!.className).toContain('variant-outline');
      });
    });

    it('renders a `role="group"` wrapper carrying the variant', async () => {
      const { container } = render(ButtonGroupHarness, { variant: 'outline' });

      const group = container.querySelector('.ButtonGroup')!;
      expect(group.getAttribute('role')).toBe('group');
      expect(group.className).toContain('variant-outline');
    });

    it('disables the whole group', async () => {
      const { container } = render(ButtonGroupHarness, { disabled: true });

      expect(container.querySelector('.ButtonGroup')!.className).toContain('pointer-events-none');
    });
  });

  describe('settings', () => {
    it('applies configured default props', async () => {
      const { container } = render(ButtonSettingsHarness, {
        options: { components: { Button: { variant: 'fill', size: 'lg' } } },
      });

      const el = buttonOf(container);
      expect(el.className).toContain('variant-fill');
      expect(el.className).toContain('px-6');
    });

    it('applies configured default classes', async () => {
      const { container } = render(ButtonSettingsHarness, {
        options: { components: { Button: { classes: 'settings-class' } } },
      });

      expect(buttonOf(container).classList.contains('settings-class')).toBe(true);
    });

    it('lets explicit props win over settings defaults', async () => {
      const { container } = render(ButtonSettingsHarness, {
        options: { components: { Button: { variant: 'fill' } } },
        variant: 'outline',
      });

      expect(buttonOf(container).className).toContain('variant-outline');
    });
  });
});
