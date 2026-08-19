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
 * A layout child.
 *
 * Stack and Grid describe themselves; nothing described how an individual
 * child sits inside them, so a bare `div` with an inline style was doing it.
 * Box is that `div`, typed — which keeps the child-side layout props off
 * components like Button and Input.
 *
 * One Box serves both containers. `span` applies inside a Grid, `grow` inside
 * a Stack, and `alignSelf` in either; a prop that does not apply to the parent
 * is inert rather than an error. That was chosen deliberately over a second,
 * Grid-specific container.
 *
 * Stack and Grid now carry the same three props, because a container is a
 * child as soon as it is nested in another one and wrapping it in a Box to say
 * so adds an element that carries nothing but a number. Box remains the answer
 * for anything that is *not* itself a layout container — a bare div, a
 * Typography, a form control that needs to claim a span.
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
