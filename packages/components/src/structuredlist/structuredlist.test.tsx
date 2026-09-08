import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StructuredList, StructuredListCell, StructuredListRow } from './structuredlist';

const basic = (props: Partial<React.ComponentProps<typeof StructuredList>> = {}) => (
  <StructuredList headers={['Plan', 'Requests']} {...props}>
    <StructuredListRow>
      <StructuredListCell label="Plan">Starter</StructuredListCell>
      <StructuredListCell label="Requests">10,000</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell label="Plan">Team</StructuredListCell>
      <StructuredListCell label="Requests">1M</StructuredListCell>
    </StructuredListRow>
  </StructuredList>
);

/**
 * 0017 D1 put the whole structure on ARIA roles rather than table elements, so
 * every role is load-bearing and none is enforced by the element it sits on.
 * These assert the tree rather than the text — which is the point.
 */
describe('StructuredList', () => {
  it('exposes a complete table structure', () => {
    render(basic());

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('rowgroup')).toHaveLength(2);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Plan',
      'Requests',
    ]);
    expect(screen.getAllByRole('cell')).toHaveLength(4);
  });

  /**
   * The stacked layout moves the header row off-screen rather than removing it,
   * so the roles must be identical in both. A `display: none` header would take
   * the columnheaders out of the tree with it.
   */
  it('keeps the same roles in both layouts', () => {
    const { rerender } = render(basic({ layout: 'columns' }));
    const wide = {
      rows: screen.getAllByRole('row').length,
      headers: screen.getAllByRole('columnheader').length,
      cells: screen.getAllByRole('cell').length,
    };

    rerender(basic({ layout: 'stacked' }));
    expect({
      rows: screen.getAllByRole('row').length,
      headers: screen.getAllByRole('columnheader').length,
      cells: screen.getAllByRole('cell').length,
    }).toEqual(wide);
  });

  /**
   * The visible per-cell label repeats what the column header announces, so it
   * is hidden from assistive technology — otherwise every cell is read as
   * "Plan Plan Starter".
   */
  it('hides the per-cell label from assistive technology', () => {
    render(basic());
    const cell = screen.getAllByRole('cell')[0]!;
    const label = cell.querySelector('[aria-hidden="true"]');

    expect(label).not.toBeNull();
    expect(label).toHaveTextContent('Plan');
    // Still present for sighted readers in the stacked layout.
    expect(cell).toHaveTextContent('Starter');
  });

  it('renders without headers', () => {
    render(
      <StructuredList>
        <StructuredListRow>
          <StructuredListCell>Alpha</StructuredListCell>
          <StructuredListCell>Beta</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryAllByRole('columnheader')).toHaveLength(0);
    expect(screen.getAllByRole('cell')).toHaveLength(2);
  });

  /** 0018 D3. The label comes from the column; `label` is only an override. */
  it('takes each cell label from its column heading', () => {
    render(
      <StructuredList headers={['Plan', 'Requests']}>
        <StructuredListRow>
          <StructuredListCell>Starter</StructuredListCell>
          <StructuredListCell>10,000</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    const labels = screen.getAllByRole('cell').map((c) => c.querySelector('[aria-hidden="true"]')?.textContent);
    expect(labels).toEqual(['Plan', 'Requests']);
  });

  it('lets an explicit label override the heading', () => {
    render(
      <StructuredList headers={['Plan', 'Requests']}>
        <StructuredListRow>
          <StructuredListCell label="Tier">Starter</StructuredListCell>
          <StructuredListCell>10,000</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    const labels = screen.getAllByRole('cell').map((c) => c.querySelector('[aria-hidden="true"]')?.textContent);
    expect(labels).toEqual(['Tier', 'Requests']);
  });

  it('gives a cell no label when there are no headers and none is passed', () => {
    render(
      <StructuredList>
        <StructuredListRow>
          <StructuredListCell>Starter</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    expect(screen.getByRole('cell').querySelector('[aria-hidden="true"]')).toBeNull();
  });

  /** 0018 D2. Widths are declared once and applied by column position. */
  it('applies columnWidths to the cell at each position', () => {
    render(
      <StructuredList headers={['A', 'B', 'C']} columnWidths={['4rem', 'auto', '2 1 0%']}>
        <StructuredListRow>
          <StructuredListCell>1</StructuredListCell>
          <StructuredListCell>2</StructuredListCell>
          <StructuredListCell>3</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    // A bare length is fixed, `auto` fills, a shorthand is used as written.
    expect(screen.getAllByRole('cell').map((c) => (c as HTMLElement).style.flex)).toEqual([
      '0 0 4rem',
      '1 1 0%',
      '2 1 0%',
    ]);
  });

  it('leaves cells at the default share when no widths are given', () => {
    render(basic());
    expect(screen.getAllByRole('cell').every((c) => (c as HTMLElement).style.flex === '')).toBe(true);
  });

  it('applies the same widths to the column headers', () => {
    render(
      <StructuredList headers={['A', 'B']} columnWidths={['4rem', 'auto']}>
        <StructuredListRow>
          <StructuredListCell>1</StructuredListCell>
          <StructuredListCell>2</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );
    expect(screen.getAllByRole('columnheader').map((h) => (h as HTMLElement).style.flex)).toEqual([
      '0 0 4rem',
      '1 1 0%',
    ]);
  });

  /** 0018 D1. A cell's own preset beats the list's. */
  it('lets a cell name its own type preset', () => {
    const { container } = render(
      <StructuredList headers={['A', 'B']} with="body01">
        <StructuredListRow>
          <StructuredListCell>plain</StructuredListCell>
          <StructuredListCell with="caption01">quiet</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    const [plain, quiet] = screen.getAllByRole('cell');
    expect(quiet!.className).not.toBe(plain!.className);
    expect(container.firstElementChild!.className).toContain('list');
  });

  /** The two checks 0017 D2's outcome asked for. */
  it('warns when a row has the wrong number of cells', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <StructuredList headers={['Plan', 'Requests']}>
        <StructuredListRow>
          <StructuredListCell label="Plan">Starter</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('1 cells in a list with 2 columns'));
    spy.mockRestore();
  });

  /**
   * 0017's As built recorded cell-order validation as impossible. With the
   * index known it is one comparison: a written label that disagrees with the
   * column it sits in is either a typo or a reordered row.
   */
  it('warns when a written label disagrees with its column', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <StructuredList headers={['Plan', 'Requests']}>
        <StructuredListRow>
          <StructuredListCell label="Requests">10,000</StructuredListCell>
          <StructuredListCell label="Plan">Starter</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('labelled "Requests" but sits in the "Plan" column')
    );
    spy.mockRestore();
  });

  it('warns when a cell is rendered outside a row', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <StructuredList headers={['Plan']}>
        <StructuredListCell>Loose</StructuredListCell>
      </StructuredList>
    );

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('outside a StructuredListRow'));
    spy.mockRestore();
  });

  it('warns when a cell is rendered outside a list', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<StructuredListCell>Loose</StructuredListCell>);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('outside a StructuredList'));
    spy.mockRestore();
  });

  it('does not warn about a well-formed list', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(basic());
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('keeps the caller className alongside its own', () => {
    const { container } = render(basic({ className: 'mine' }));
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mine');
    expect(root.className.split(' ').length).toBeGreaterThan(1);
  });

  it('forwards refs on all three parts', () => {
    const list = createRef<HTMLDivElement>();
    const row = createRef<HTMLDivElement>();
    const cell = createRef<HTMLDivElement>();
    render(
      <StructuredList ref={list} headers={['A']}>
        <StructuredListRow ref={row}>
          <StructuredListCell ref={cell} label="A">1</StructuredListCell>
        </StructuredListRow>
      </StructuredList>
    );

    expect(list.current?.getAttribute('role')).toBe('table');
    expect(row.current?.getAttribute('role')).toBe('row');
    expect(cell.current?.getAttribute('role')).toBe('cell');
  });
});
