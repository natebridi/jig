import type { ElementType } from 'react';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { layoutSprinkles } from '../layout.css';
import { childLayout, type LayoutChildProps, type LayoutAlign, type LayoutDirection, type LayoutJustify, type LayoutSpacing } from '../layout';
import type { PolymorphicProps } from '../polymorphic';
import { base } from './stack.css';

/**
 * The elements a Stack is willing to render as. Restricted rather than open:
 * an arbitrary ElementType would let a Stack render as something that has no
 * business being a flex container.
 */
export type StackElement =
  | 'div' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

/**
 * Stack's own props: how it arranges its children, plus the shared child-side
 * set describing how it sits in whatever contains it. The element's own
 * attributes are added by PolymorphicProps.
 *
 * Note `align` and `alignSelf` are both here and are not the same prop —
 * `align` is what the Stack does to its children, `alignSelf` is what it does
 * to itself inside its parent. Spanning changes how wide a Stack is, not how
 * its children fill it: `align` still defaults to `start`, so a spanning Stack
 * whose children should fill the column wants `align="stretch"` as well.
 */
export interface StackOwnProps extends SpacingProps, LayoutChildProps {
  direction?: Responsive<LayoutDirection>;
  spacing?: Responsive<LayoutSpacing>;
  align?: Responsive<LayoutAlign>;
  justify?: Responsive<LayoutJustify>;
}

export type StackProps<E extends StackElement = 'div'> = PolymorphicProps<E, StackOwnProps>;

/**
 * A flex container that spaces its children evenly.
 *
 * `direction` defaults to `column`. `spacing` is a step on the shared scale
 * rather than a length, and `direction`, `spacing`, `align` and `justify` all
 * take responsive values keyed by breakpoint.
 *
 * Children take `grow` to absorb leftover space, either through `Box` or
 * directly on a nested Stack or Grid. Stack is a layout child itself, so it
 * also takes `span`, `grow` and `alignSelf` for its own position in a parent.
 *
 * Use `as` to make it a real list or section when that is what the content is.
 *
 * @example
 * <Stack direction={{ xs: 'column', md: 'row' }} spacing="400" align="center">
 *   <Icon icon="user" size="2rem" />
 *   <Stack spacing="100" grow>
 *     <Typography with="heading05">Ada Lovelace</Typography>
 *     <Typography tone="muted">Engineering</Typography>
 *   </Stack>
 *   <Button variant="secondary">Message</Button>
 * </Stack>
 */
export function Stack<E extends StackElement = 'div'>({
  as,
  direction = 'column',
  spacing: spacingProp = '300',
  align = 'start',
  justify,
  span,
  grow,
  alignSelf,
  className,
  children,
  ...props
}: StackProps<E>) {
  const { spacing, rest } = splitSpacing(props);
  // Widened for JSX only. The public contract is the StackElement union; left
  // generic here, JSX tries to satisfy every element in it at once and
  // intersects their ref types down to nothing.
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      className={[
        base,
        layoutSprinkles({
          flexDirection: direction,
          gap: spacingProp,
          alignItems: align,
          ...(justify ? { justifyContent: justify } : {}),
          ...childLayout({ span, grow, alignSelf }),
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
