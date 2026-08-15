import type { ElementType } from 'react';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { layoutSprinkles } from '../layout.css';
import type { GridColumns, LayoutSpacing } from '../layout';
import type { PolymorphicProps } from '../polymorphic';
import { base } from './grid.css';

/** The elements a Grid is willing to render as. See StackElement. */
export type GridElement =
  | 'div' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

export type { GridColumns };

/** Grid's own props. The element's own attributes are added by PolymorphicProps. */
export interface GridOwnProps extends SpacingProps {
  spacing?: Responsive<LayoutSpacing>;
  /**
   * Twelve is the whole grid. Previously this also accepted `number`, which
   * let `columns={13}` through to produce no class at all rather than a type
   * error.
   */
  columns?: Responsive<GridColumns>;
}

export type GridProps<E extends GridElement = 'div'> = PolymorphicProps<E, GridOwnProps>;

/** Sprinkles keys its column values by string; the prop reads better as a number. */
const toColumnKey = (value: Responsive<GridColumns>): Responsive<`${GridColumns}`> =>
  typeof value === 'number'
    ? (`${value}` as `${GridColumns}`)
    : (Object.fromEntries(
        Object.entries(value).map(([bp, v]) => [bp, `${v}`])
      ) as Responsive<`${GridColumns}`>);

export function Grid<E extends GridElement = 'div'>({
  as,
  spacing: spacingProp = '300',
  columns = 1,
  className,
  children,
  ...props
}: GridProps<E>) {
  const { spacing, rest } = splitSpacing(props);
  // See Stack: widened for JSX only, the union is the public contract.
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      className={[
        base,
        layoutSprinkles({
          gridTemplateColumns: toColumnKey(columns),
          gap: spacingProp,
        }),
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}
