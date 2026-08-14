import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { splitBoxSize, type BoxSizeProps } from '../box-size';
import { layoutSprinkles } from '../layout.css';
import type { GridColumns, LayoutSpacing } from '../layout';
import { base } from './grid.css';

/** The elements a Grid is willing to render as. See StackElement. */
export type GridElement =
  | 'div' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

export type { GridColumns };

export interface GridProps extends HTMLAttributes<HTMLElement>, SpacingProps, BoxSizeProps {
  as?: GridElement;
  spacing?: Responsive<LayoutSpacing>;
  /**
   * Twelve is the whole grid. Previously this also accepted `number`, which
   * let `columns={13}` through to produce no class at all rather than a type
   * error.
   */
  columns?: Responsive<GridColumns>;
  ref?: Ref<HTMLElement>;
}

/** Sprinkles keys its column values by string; the prop reads better as a number. */
const toColumnKey = (value: Responsive<GridColumns>): Responsive<`${GridColumns}`> =>
  typeof value === 'number'
    ? (`${value}` as `${GridColumns}`)
    : (Object.fromEntries(
        Object.entries(value).map(([bp, v]) => [bp, `${v}`])
      ) as Responsive<`${GridColumns}`>);

export function Grid({
  as = 'div',
  spacing: spacingProp = '300',
  columns = 1,
  className,
  style,
  children,
  ...props
}: GridProps) {
  const { spacing, rest: afterSpacing } = splitSpacing(props);
  const { style: boxStyle, rest } = splitBoxSize(afterSpacing);
  // See Stack: the union is the public contract, widened internally so JSX
  // does not intersect the ref types of every allowed element.
  const Component = as as ElementType;

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
      style={{ ...boxStyle, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}
