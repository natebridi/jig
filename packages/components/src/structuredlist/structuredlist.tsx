import {
  Children,
  createContext,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { isDev, warnInDev } from '../dev';
import type { Breakpoint } from '../breakpoints';
import type { Responsive } from '../responsive';
import type { TypeStyles } from '../typography';
import {
  cell as cellRecipe,
  cellLabel,
  columnHeader,
  headerRow,
  layouts,
  list,
  row as rowClass,
  rowgroup,
} from './structuredlist.css';

/** Which way the list lays itself out. */
export type StructuredListLayout = 'columns' | 'stacked';

/** Stacked on a phone, columns from `md` up (0017 D3). */
const DEFAULT_LAYOUT: Responsive<StructuredListLayout> = { xs: 'stacked', md: 'columns' };

/**
 * What the list tells its cells about the shape they sit in.
 *
 * **The first context in Jig**, added by 0018 D3 — and its outcome set the bar
 * for the next one: context is for a component family whose parts are
 * meaningless apart, and never for passing configuration between components a
 * consumer composes freely. List, row and cell qualify; two components a caller
 * merely nests do not.
 *
 * It carries structure, not styling. Type still travels by CSS inheritance,
 * which is why `with` needs nothing from here.
 */
interface StructuredListContextValue {
  // Explicitly `| undefined` rather than optional: the provider always passes
  // both keys, and `exactOptionalPropertyTypes` distinguishes "absent" from
  // "present and undefined".
  headers: ReactNode[] | undefined;
  columnWidths: string[] | undefined;
}

const StructuredListContext = createContext<StructuredListContextValue | null>(null);

/**
 * A cell's position in its row, provided by the row that rendered it.
 *
 * Separate from the list context because it differs per cell — one provider per
 * cell, rather than one value the whole subtree shares.
 */
const CellIndexContext = createContext<number | null>(null);

/**
 * Turns a `columnWidths` entry into a flex value.
 *
 * The array reads like the track list it replaced, so the shorthand it accepts
 * is deliberately track-like rather than raw flex:
 *
 * - `'auto'` takes the space left over — `flex: 1 1 0%`
 * - a bare length (`'4.5rem'`, `'20%'`) is fixed — `flex: 0 0 <length>`
 * - anything with a space in it is a flex shorthand and is used as written
 *
 * `0%` rather than a unitless `0` for the basis. The two are identical in
 * layout, but a unitless zero in the `flex` shorthand is rejected by some CSS
 * parsers — jsdom's among them, which is how this was found.
 */
const toFlex = (width: string): string => {
  if (width === 'auto') return '1 1 0%';
  if (width.trim().includes(' ')) return width;
  return `0 0 ${width}`;
};

export interface StructuredListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'> {
  /** The rows. `StructuredListRow` elements. */
  children?: ReactNode;
  /**
   * The column headings. Optional — without them the list is columns of values
   * with nothing naming them, and cells fall back to their own `label`.
   *
   * These are also what a cell reads to label itself when stacked, so a string
   * heading is what makes `label` unnecessary at the call site.
   */
  headers?: ReactNode[];
  /**
   * A width per column, applied in the column layout only.
   *
   * `'auto'` fills the space left over, a bare length is fixed, and anything
   * with a space in it is used as a flex shorthand. Omitted columns keep the
   * default equal share.
   *
   * Declared here rather than on the cell because flex rows lay out
   * independently: the columns line up only while every row's nth cell resolves
   * to the same width, and one array on the list is what guarantees that
   * (0018 D2).
   *
   * @example
   * columnWidths={['4.5rem', 'auto', '3rem']}
   */
  columnWidths?: string[];
  /** Column layout, stacked, or one per breakpoint. */
  layout?: Responsive<StructuredListLayout>;
  /**
   * A Typography preset for the whole list, inherited by every row and cell and
   * overridable per cell. Column headings take this preset at weight 600.
   */
  with?: TypeStyles;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/** Resolves the responsive `layout` value to one marker class per breakpoint named. */
const layoutClasses = (layout: Responsive<StructuredListLayout>): string[] =>
  typeof layout === 'string'
    ? [layouts.xs[layout]]
    : Object.entries(layout).map(
        ([breakpoint, mode]) => layouts[breakpoint as Breakpoint][mode as StructuredListLayout]
      );

/**
 * Columns of content, laid out as a table on a wide screen and stacked with
 * their labels on a narrow one.
 *
 * Layout only — nothing here is focusable or selectable. It carries ARIA table
 * roles rather than table elements (0017 D1), so the structure a screen reader
 * hears is identical in both layouts.
 *
 * Cells take their stacked label from `headers` by position; pass `label` on a
 * cell only to override it. `columnWidths` gives the columns widths, and `with`
 * sets the type for the list with each cell free to name its own.
 *
 * @example
 * <StructuredList headers={['Plan', 'Requests', 'Price']} columnWidths={['8rem', 'auto', '6rem']}>
 *   <StructuredListRow>
 *     <StructuredListCell>Starter</StructuredListCell>
 *     <StructuredListCell with="caption01">10,000</StructuredListCell>
 *     <StructuredListCell><Token color="green">Free</Token></StructuredListCell>
 *   </StructuredListRow>
 * </StructuredList>
 */
export function StructuredList({
  children,
  headers,
  columnWidths,
  layout = DEFAULT_LAYOUT,
  with: typeStyle = 'body01',
  className,
  style,
  ref,
  ...props
}: StructuredListProps) {
  return (
    <StructuredListContext.Provider value={{ headers, columnWidths }}>
      <div
        {...props}
        ref={ref}
        role="table"
        className={[list({ with: typeStyle }), ...layoutClasses(layout), className]
          .filter(Boolean)
          .join(' ')}
        {...(style ? { style } : {})}
      >
        {headers != null && headers.length > 0 && (
          <div role="rowgroup" className={rowgroup}>
            <div role="row" className={[rowClass, headerRow].join(' ')}>
              {headers.map((heading, i) => (
                <div
                  key={i}
                  role="columnheader"
                  className={columnHeader}
                  {...(columnWidths?.[i] ? { style: { flex: toFlex(columnWidths[i]!) } } : {})}
                >
                  {heading}
                </div>
              ))}
            </div>
          </div>
        )}

        <div role="rowgroup" className={rowgroup}>{children}</div>
      </div>
    </StructuredListContext.Provider>
  );
}

export interface StructuredListRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'> {
  /** The cells. `StructuredListCell` elements. */
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * One row of a `StructuredList`. Carries `role="row"`, and tells each cell which
 * column it is in — which is what lets a cell find its own heading and width.
 */
export function StructuredListRow({ children, className, ref, ...props }: StructuredListRowProps) {
  const context = useContext(StructuredListContext);
  const cells = Children.toArray(children);

  // Precise now that the row knows both numbers, where 0017 had to introspect
  // the list's grandchildren to guess at it.
  if (isDev()) {
    const expected = context?.headers?.length;
    if (expected != null && cells.length > 0 && cells.length !== expected) {
      warnInDev(
        `StructuredListRow: ${cells.length} cells in a list with ${expected} columns. The columns will not line up.`
      );
    }
  }

  return (
    <div {...props} ref={ref} role="row" className={[rowClass, className].filter(Boolean).join(' ')}>
      {Children.map(children, (child, index) => (
        <CellIndexContext.Provider value={index}>{child}</CellIndexContext.Provider>
      ))}
    </div>
  );
}

export interface StructuredListCellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'> {
  /** The cell's content. Anything — a string, a Token, a Link, an Icon. */
  children?: ReactNode;
  /**
   * Overrides the label the cell would take from its column's heading.
   *
   * Only needed when the heading is not a plain string, or when the stacked
   * label should read differently from the column title. Since 0018 D3 the
   * common case is to omit it.
   */
  label?: string;
  /**
   * A Typography preset for this cell, overriding the list's. The type a column
   * wants is usually a property of the column rather than the whole list —
   * a monospaced value beside prose, a quieter note (0018 D1).
   */
  with?: TypeStyles;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * One cell of a `StructuredListRow`. Carries `role="cell"`.
 *
 * Its stacked label comes from the column heading above it; `label` overrides.
 * The label is `aria-hidden` because the `columnheader` already announces the
 * same words — without that, a screen reader hears the heading twice per cell.
 */
export function StructuredListCell({
  children,
  label,
  with: typeStyle,
  className,
  ref,
  ...props
}: StructuredListCellProps) {
  const context = useContext(StructuredListContext);
  const index = useContext(CellIndexContext);

  const heading = index != null ? context?.headers?.[index] : undefined;
  // Only a string heading can become a label; a heading built from elements has
  // no text the cell can safely reuse, so `label` is the route there.
  const inherited = typeof heading === 'string' ? heading : undefined;
  const resolved = label ?? inherited;

  const width = index != null ? context?.columnWidths?.[index] : undefined;

  if (isDev()) {
    if (context == null) {
      warnInDev('StructuredListCell: rendered outside a StructuredList. It will have no label and no width.');
    } else if (index == null) {
      warnInDev('StructuredListCell: rendered outside a StructuredListRow. It will have no label and no width.');
    } else if (label != null && inherited != null && label !== inherited) {
      // The cell-order check 0017's As built recorded as impossible: with the
      // index known, a written label that disagrees with the column it is in is
      // either a typo or a row whose cells are out of order.
      warnInDev(
        `StructuredListCell: labelled "${label}" but sits in the "${inherited}" column. Either the label is wrong or the row's cells are out of order.`
      );
    }
  }

  return (
    <div
      {...props}
      ref={ref}
      role="cell"
      className={[cellRecipe({ with: typeStyle }), className].filter(Boolean).join(' ')}
      {...(width ? { style: { flex: toFlex(width) } } : {})}
    >
      {resolved != null && (
        <span className={cellLabel} aria-hidden="true">
          {resolved}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
