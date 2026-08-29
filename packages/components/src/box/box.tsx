import type { ElementType } from 'react';
import { splitSpacing, type SpacingProps } from '../spacing';
import { layoutSprinkles } from '../layout.css';
import { childLayout, type LayoutChildProps } from '../layout';
import type { PolymorphicProps } from '../polymorphic';
import { base } from './box.css';

/** The elements a Box is willing to render as. See StackElement. */
export type BoxElement =
  | 'div' | 'span' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

/**
 * Box's own props. All three are the shared child-side set — Box adds nothing
 * of its own, because being a child is the whole of what it does. The
 * element's own attributes are added by PolymorphicProps.
 */
export interface BoxOwnProps extends SpacingProps, LayoutChildProps {}

export type BoxProps<E extends BoxElement = 'div'> = PolymorphicProps<E, BoxOwnProps>;

/**
 * A layout child: an element that positions itself inside a Stack or a Grid.
 *
 * Reach for it when the thing you are placing is not itself a layout
 * container — a bare div, a Typography, a form control that needs to claim a
 * column span. Stack and Grid already accept these props directly, so nesting
 * one inside another needs no Box.
 *
 * `span` applies inside a Grid, `grow` inside a Stack, and `alignSelf` in
 * either. A prop that does not apply to the parent is ignored rather than an
 * error, and all three take responsive values.
 *
 * @example
 * <Grid columns={12} spacing="400">
 *   <Box span={8}><Article /></Box>
 *   <Box span={4}><Sidebar /></Box>
 * </Grid>
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
        layoutSprinkles(childLayout({ span, grow, alignSelf })),
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}
