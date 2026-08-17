import type { ElementType } from 'react';
import type { Breakpoint } from '../breakpoints';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { layoutSprinkles } from '../layout.css';
import type { GridSpan, LayoutAlign } from '../layout';
import type { PolymorphicProps } from '../polymorphic';
import { base } from './box.css';

/** The elements a Box is willing to render as. See StackElement. */
export type BoxElement =
  | 'div' | 'span' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

/** Box's own props. The element's own attributes are added by PolymorphicProps. */
export interface BoxOwnProps extends SpacingProps {
  /**
   * How many of the grid's 24 columns to occupy. Overrides the distribution a
   * parent `Grid` set with `columns`.
   *
   * Only meaningful inside a Grid.
   *
   * @example
   * <Box span={8}>                    // a third
   * <Box span={{ xs: 24, md: 8 }}>    // full width on a phone
   */
  span?: Responsive<GridSpan>;
  /**
   * Take the space left over by siblings. Only meaningful inside a Stack.
   */
  grow?: Responsive<boolean>;
  /**
   * Override the parent's `align` for this child alone. Works in both Stack
   * and Grid.
   *
   * Stack's `align` defaults to `start`, so this is how a single child says it
   * should fill the cross axis without changing the whole row.
   */
  alignSelf?: Responsive<LayoutAlign>;
}

export type BoxProps<E extends BoxElement = 'div'> = PolymorphicProps<E, BoxOwnProps>;

/** Sprinkles keys its values by string; `grow` reads better as a boolean. */
const toGrowKey = (value: Responsive<boolean>): Responsive<'0' | '1'> =>
  typeof value === 'boolean'
    ? value ? '1' : '0'
    : (Object.fromEntries(
        Object.entries(value).map(([breakpoint, v]) => [breakpoint, v ? '1' : '0'])
      ) as Partial<Record<Breakpoint, '0' | '1'>>);

/** Sprinkles keys its span values by string; the prop reads better as a number. */
const toSpanKey = (value: Responsive<GridSpan>): Responsive<`${GridSpan}`> =>
  typeof value === 'number'
    ? (`${value}` as `${GridSpan}`)
    : (Object.fromEntries(
        Object.entries(value).map(([breakpoint, v]) => [breakpoint, `${v}`])
      ) as Partial<Record<Breakpoint, `${GridSpan}`>>);

/**
 * A layout child.
 *
 * Stack and Grid describe themselves; nothing described how an individual
 * child sits inside them, so a bare `div` with an inline style was doing it.
 * Box is that `div`, typed — it is the only place the child-side layout props
 * live, which keeps them off components like Button and Input.
 *
 * One Box serves both containers. `span` applies inside a Grid, `grow` inside
 * a Stack, and `alignSelf` in either; a prop that does not apply to the parent
 * is inert rather than an error. That was chosen deliberately over a second,
 * Grid-specific container.
 *
 * Decided in apps/docs/decisions/0003-layout-children.html.
 */
export function Box<E extends BoxElement = 'div'>({
  as,
  span,
  grow,
  alignSelf,
  className,
  children,
  ...props
}: BoxProps<E>) {
  const { spacing, rest } = splitSpacing(props);
  // See Stack: widened for JSX only, the union is the public contract.
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      className={[
        base,
        layoutSprinkles({
          ...(span !== undefined ? { gridColumn: toSpanKey(span) } : {}),
          ...(grow !== undefined ? { flexGrow: toGrowKey(grow) } : {}),
          ...(alignSelf ? { alignSelf } : {}),
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
