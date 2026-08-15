import type { ElementType } from 'react';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { layoutSprinkles } from '../layout.css';
import type { LayoutAlign, LayoutDirection, LayoutJustify, LayoutSpacing } from '../layout';
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

/** Stack's own props. The element's own attributes are added by PolymorphicProps. */
export interface StackOwnProps extends SpacingProps {
  direction?: Responsive<LayoutDirection>;
  spacing?: Responsive<LayoutSpacing>;
  align?: Responsive<LayoutAlign>;
  justify?: Responsive<LayoutJustify>;
}

export type StackProps<E extends StackElement = 'div'> = PolymorphicProps<E, StackOwnProps>;

export function Stack<E extends StackElement = 'div'>({
  as,
  direction = 'column',
  spacing: spacingProp = '300',
  align = 'start',
  justify,
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
