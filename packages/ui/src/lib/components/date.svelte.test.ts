import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { PeriodType } from '@layerstack/utils';

import DateHarness from './tests/DateHarness.svelte';

const testId = (root: ParentNode, id: string) =>
  root.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

/** Tests run under `Etc/GMT-5`, so build local dates explicitly */
const jan15 = new Date(2024, 0, 15);
const jan20 = new Date(2024, 0, 20);

describe('DateButton', () => {
  it('renders the day number for a Day period', async () => {
    const { container } = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
    });

    expect(container.querySelector('.DateButton')!.textContent?.trim()).toBe('15');
  });

  it('marks a matching single selection', async () => {
    const selected = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
      selected: jan15,
    });
    const other = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
      selected: jan20,
    });

    expect(selected.container.querySelector('.Button')!.className).toContain('variant-fill');
    expect(other.container.querySelector('.Button')!.className).not.toContain('variant-fill');
  });

  it('marks dates within a selected range', async () => {
    const { container } = render(DateHarness, {
      kind: 'date-button',
      date: new Date(2024, 0, 17),
      periodType: PeriodType.Day,
      selected: { from: jan15, to: jan20 },
    });

    expect(container.querySelector('.Button')!.className).toContain('variant-fill');
  });

  it('marks a date in a selected array', async () => {
    const { container } = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
      selected: [jan15, jan20],
    });

    expect(container.querySelector('.Button')!.className).toContain('variant-fill');
  });

  it('reports the date on click', async () => {
    const onDateChange = vi.fn();
    const { container } = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
      onDateChange,
    });

    (container.querySelector('.Button') as HTMLButtonElement).click();

    expect(onDateChange).toHaveBeenCalledWith(jan15);
  });

  it('does not report when disabled', async () => {
    const onDateChange = vi.fn();
    const { container } = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
      disabled: true,
      onDateChange,
    });

    (container.querySelector('.Button') as HTMLButtonElement).click();

    expect(onDateChange).not.toHaveBeenCalled();
  });

  it('hides without removing layout space', async () => {
    const { container } = render(DateHarness, {
      kind: 'date-button',
      date: jan15,
      periodType: PeriodType.Day,
      hidden: true,
    });

    expect(container.querySelector('.DateButton')!.className).toContain('opacity-0');
  });
});

describe('Month', () => {
  it('renders a weekday header and a 6-week grid', async () => {
    const { container } = render(DateHarness, {
      kind: 'month',
      startOfMonth: new Date(2024, 0, 1),
    });

    const headers = container.querySelectorAll('.grid-cols-7 > div');
    expect(headers.length).toBeGreaterThanOrEqual(7);
    // whole weeks — the count varies by month (January 2024 spans 5)
    const days = container.querySelectorAll('.DateButton').length;
    expect(days % 7).toBe(0);
    expect(days).toBeGreaterThanOrEqual(28);
  });

  it('shows the current month name and steps between months', async () => {
    const { container } = render(DateHarness, {
      kind: 'month',
      startOfMonth: new Date(2024, 0, 1),
    });

    const label = () => container.querySelectorAll('.Button')[1].textContent?.trim();
    expect(label()).toContain('January');

    (container.querySelectorAll('.Button')[2] as HTMLButtonElement).click();

    await vi.waitFor(() => expect(label()).toContain('February'));
  });

  it('derives the displayed month from the selection', async () => {
    const { container } = render(DateHarness, { kind: 'month', selected: new Date(2024, 5, 10) });

    await vi.waitFor(() => {
      expect(container.querySelectorAll('.Button')[1].textContent).toContain('June');
    });
  });

  it('hides outside days by default and fades them when shown', async () => {
    const hidden = render(DateHarness, { kind: 'month', startOfMonth: new Date(2024, 0, 1) });
    const shown = render(DateHarness, {
      kind: 'month',
      startOfMonth: new Date(2024, 0, 1),
      showOutsideDays: true,
    });

    expect(hidden.container.querySelectorAll('.DateButton.opacity-0').length).toBeGreaterThan(0);
    expect(shown.container.querySelectorAll('.DateButton.opacity-0')).toHaveLength(0);
    expect(shown.container.querySelectorAll('.Button.opacity-25').length).toBeGreaterThan(0);
  });

  it('hides the controls when asked', async () => {
    const { container } = render(DateHarness, {
      kind: 'month',
      startOfMonth: new Date(2024, 0, 1),
      hideControls: true,
    });

    // only day buttons remain — no prev/next/month-label controls
    const days = container.querySelectorAll('.DateButton').length;
    expect(container.querySelectorAll('.Button').length).toBe(days);
  });

  it('disables dates matching `disabledDates`', async () => {
    const { container } = render(DateHarness, {
      kind: 'month',
      startOfMonth: new Date(2024, 0, 1),
      disabledDates: (d: Date) => d.getDay() === 0,
    });

    const disabled = [...container.querySelectorAll('.DateButton .Button')].filter(
      (b) => (b as HTMLButtonElement).disabled
    );
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('opens the month picker from the header', async () => {
    const { container } = render(DateHarness, {
      kind: 'month',
      startOfMonth: new Date(2024, 0, 1),
    });

    (container.querySelectorAll('.Button')[1] as HTMLButtonElement).click();

    await vi.waitFor(() => {
      // the year list replaces the day grid
      expect(container.textContent).toContain('More');
    });
  });
});

describe('MonthList', () => {
  it('renders twelve months', async () => {
    const { container } = render(DateHarness, { kind: 'month-list', year: 2024 });

    const buttons = [...container.querySelectorAll('.DateButton')];
    expect(buttons).toHaveLength(12);
    expect(buttons[0].textContent?.trim()).toBe('Jan');
    expect(buttons[11].textContent?.trim()).toBe('Dec');
  });

  it('reports the selected month', async () => {
    const onDateChange = vi.fn();
    const { container } = render(DateHarness, { kind: 'month-list', year: 2024, onDateChange });

    (container.querySelectorAll('.DateButton .Button')[2] as HTMLButtonElement).click();

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect((onDateChange.mock.calls[0][0] as Date).getMonth()).toBe(2);
  });
});

describe('YearList', () => {
  it('renders a range of years around the selection', async () => {
    const { container } = render(DateHarness, {
      kind: 'year-list',
      selected: new Date(2024, 0, 1),
    });

    const years = [...container.querySelectorAll('.DateButton')].map((b) => b.textContent?.trim());
    expect(years).toContain('2024');
    expect(years).toContain('2022');
    expect(years).toContain('2026');
  });

  it('extends the range with the More buttons', async () => {
    const { container } = render(DateHarness, {
      kind: 'year-list',
      selected: new Date(2024, 0, 1),
    });

    const before = container.querySelectorAll('.DateButton').length;
    (container.querySelector('.Button') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(container.querySelectorAll('.DateButton').length).toBe(before + 1);
    });
  });
});

describe('DateSelect', () => {
  it('renders a month grid for Day', async () => {
    const { container } = render(DateHarness, { kind: 'date-select', periodType: PeriodType.Day });

    const days = container.querySelectorAll('.DateButton').length;
    expect(days % 7).toBe(0);
    expect(days).toBeGreaterThanOrEqual(28);
  });

  it('renders a year list for CalendarYear', async () => {
    const { container } = render(DateHarness, {
      kind: 'date-select',
      periodType: PeriodType.CalendarYear,
    });

    const labels = [...container.querySelectorAll('.DateButton')].map((b) => b.textContent?.trim());
    expect(labels.every((l) => /^\d{4}$/.test(l ?? ''))).toBe(true);
  });

  it('renders months by year for Month', async () => {
    const { container } = render(DateHarness, {
      kind: 'date-select',
      periodType: PeriodType.Month,
    });

    expect(container.textContent).toContain('Jan');
    expect(container.textContent).toContain('Dec');
  });
});

describe('DateRangeDisplay', () => {
  it('renders nothing meaningful without a value', async () => {
    const { container } = render(DateHarness, { kind: 'range-display', value: null });

    expect(container.textContent?.trim()).toBe('');
  });

  it('renders a single date when from and to match', async () => {
    const { container } = render(DateHarness, {
      kind: 'range-display',
      value: { from: jan15, to: jan15, periodType: PeriodType.Day },
    });

    expect(container.textContent).not.toContain(' - ');
  });

  it('renders both ends of a range', async () => {
    const { container } = render(DateHarness, {
      kind: 'range-display',
      value: { from: jan15, to: jan20, periodType: PeriodType.Day },
    });

    expect(container.textContent).toContain(' - ');
  });
});

describe('DateField', () => {
  it('renders the value in the configured format', async () => {
    const { container } = render(DateHarness, { kind: 'date-field', value: jan15 });

    const input = container.querySelector('input.Input') as HTMLInputElement;
    expect(input.value).toBe('01/15/2024');
  });

  it('parses typed input into a date', async () => {
    const onChange = vi.fn();
    const { container } = render(DateHarness, { kind: 'date-field', onChange });

    const input = container.querySelector('input.Input') as HTMLInputElement;
    input.value = '02/20/2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
    const next = onChange.mock.calls.at(-1)![0].value as Date;
    expect(next.getFullYear()).toBe(2024);
    expect(next.getMonth()).toBe(1);
    expect(next.getDate()).toBe(20);
  });

  it('renders a picker button when asked', async () => {
    const withPicker = render(DateHarness, { kind: 'date-field', picker: true });
    const without = render(DateHarness, { kind: 'date-field' });

    expect(withPicker.container.querySelector('.append .Button')).not.toBeNull();
    expect(without.container.querySelector('.append .Button')).toBeNull();
  });
});

describe('DatePickerField', () => {
  it('renders only an icon button in `iconOnly` mode', async () => {
    const { container } = render(DateHarness, { kind: 'picker-field', iconOnly: true });

    expect(container.querySelector('.Button')).not.toBeNull();
    expect(container.querySelector('.Field')).toBeNull();
  });

  it('opens a dialog with a calendar', async () => {
    const { container } = render(DateHarness, { kind: 'picker-field', value: jan15 });

    (container.querySelector('button[type="button"]') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(document.querySelector('.Dialog')).not.toBeNull();
    });
    const days = document.querySelectorAll('.Dialog .DateButton').length;
    expect(days % 7).toBe(0);
    expect(days).toBeGreaterThanOrEqual(28);
  });

  it('commits the selection on OK', async () => {
    const onChange = vi.fn();
    const { container } = render(DateHarness, { kind: 'picker-field', value: jan15, onChange });

    (container.querySelector('button[type="button"]') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(document.querySelector('.Dialog')).not.toBeNull());

    // pick a visible day, then confirm
    const day = [...document.querySelectorAll('.Dialog .DateButton')].find(
      (d) => d.textContent?.trim() === '20' && !d.className.includes('opacity-0')
    )!;
    (day.querySelector('.Button') as HTMLButtonElement).click();

    const ok = [...document.querySelectorAll('.Dialog .actions .Button')][0] as HTMLButtonElement;
    ok.click();

    await vi.waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
    expect((onChange.mock.calls.at(-1)![0] as Date).getDate()).toBe(20);
  });

  it('discards the selection on Cancel', async () => {
    const onChange = vi.fn();
    const { container } = render(DateHarness, { kind: 'picker-field', value: jan15, onChange });

    (container.querySelector('button[type="button"]') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(document.querySelector('.Dialog')).not.toBeNull());

    const day = [...document.querySelectorAll('.Dialog .DateButton')].find(
      (d) => d.textContent?.trim() === '20' && !d.className.includes('opacity-0')
    )!;
    (day.querySelector('.Button') as HTMLButtonElement).click();

    const cancel = [
      ...document.querySelectorAll('.Dialog .actions .Button'),
    ][1] as HTMLButtonElement;
    cancel.click();

    await vi.waitFor(() =>
      expect(testId(container, 'value')!.textContent).toBe(jan15.toISOString())
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
