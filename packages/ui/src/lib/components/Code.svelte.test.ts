import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Code, { stripIndent } from './Code.svelte';
import CopyButton from './CopyButton.svelte';

describe('stripIndent', () => {
  it('removes the shared leading indentation', () => {
    const source = ['    const a = 1;', '    if (a) {', '      return a;', '    }'].join('\n');

    expect(stripIndent(source)).toBe(['const a = 1;', 'if (a) {', '  return a;', '}'].join('\n'));
  });

  it('ignores blank lines when measuring indentation', () => {
    expect(stripIndent('  a\n\n  b')).toBe('a\n\nb');
  });

  it('trims surrounding whitespace', () => {
    expect(stripIndent('\n\n  hello  \n\n')).toBe('hello');
  });
});

describe('Code', () => {
  it('renders nothing without a source', async () => {
    const { container } = render(Code, {});

    expect(container.querySelector('.Code')).not.toBeNull();
    expect(container.querySelector('pre')).toBeNull();
  });

  it('renders the source in a pre/code pair', async () => {
    const { container } = render(Code, { source: 'const a = 1;' });

    const code = container.querySelector('pre code')!;
    expect(code.textContent).toContain('const a = 1;');
  });

  it('strips shared indentation from the rendered source', async () => {
    const { container } = render(Code, { source: '    const a = 1;\n    const b = 2;' });

    const text = container.querySelector('pre code')!.textContent!;
    expect(text.startsWith('const a')).toBe(true);
  });

  it('renders a copy button by default', async () => {
    const { container } = render(Code, { source: 'x' });

    expect(container.querySelector('.CopyButton')).not.toBeNull();
  });

  it('omits the copy button when disabled', async () => {
    const { container } = render(Code, { source: 'x', copyButton: false });

    expect(container.querySelector('.CopyButton')).toBeNull();
  });

  it('adds hover styling for `copyButton="hover"`', async () => {
    const { container } = render(Code, { source: 'x', copyButton: 'hover' });

    expect(container.querySelector('.Code > div')!.className).toContain('group');
  });

  it('opts into line numbers', async () => {
    const { container } = render(Code, { source: 'x', showLineNumbers: true });

    expect(container.querySelector('.Code > div')!.className).toContain('show-line-numbers');
  });

  it('merges classes per part', async () => {
    const { container } = render(Code, {
      source: 'x',
      class: 'root-c',
      classes: { pre: 'pre-c', code: 'code-c' },
    });

    expect(container.querySelector('.Code')!.classList.contains('root-c')).toBe(true);
    expect(container.querySelector('pre')!.classList.contains('pre-c')).toBe(true);
    expect(container.querySelector('code')!.classList.contains('code-c')).toBe(true);
  });
});

describe('CopyButton', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    writeText.mockClear();
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('copies a string value', async () => {
    const { container } = render(CopyButton, { value: 'hello' });

    (container.querySelector('.CopyButton') as HTMLButtonElement).click();
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('copies the result of a function value', async () => {
    const { container } = render(CopyButton, { value: () => 'computed' });

    (container.querySelector('.CopyButton') as HTMLButtonElement).click();
    expect(writeText).toHaveBeenCalledWith('computed');
  });

  it('shows a confirmation message, then hides it', async () => {
    const { container } = render(CopyButton, { value: 'x', messageDuration: 50 });

    (container.querySelector('.CopyButton') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(container.querySelector('.CopyButton')!.textContent).toContain('Copied!');
    });

    await vi.waitFor(() => {
      expect(container.querySelector('.CopyButton')!.textContent).not.toContain('Copied!');
    });
  });

  it('skips the message when `message` is null', async () => {
    const { container } = render(CopyButton, { value: 'x', message: null });

    (container.querySelector('.CopyButton') as HTMLButtonElement).click();
    expect(container.querySelector('.CopyButton')!.textContent).not.toContain('Copied!');
  });

  it('still calls a caller-supplied `onclick`', async () => {
    const onclick = vi.fn();
    const { container } = render(CopyButton, { value: 'x', onclick });

    (container.querySelector('.CopyButton') as HTMLButtonElement).click();
    expect(onclick).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
