import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { splitBoxSize, type BoxSizeProps } from '../box-size';
import { layoutSprinkles } from '../layout.css';
import type { LayoutAlign, LayoutDirection, LayoutJustify, LayoutSpacing } from '../layout';
import { base } from './stack.css';

/**
 * The elements a Stack is willing to render as. Restricted rather than open:
 * an arbitrary ElementType would not change the props or the ref type anyway,
 * so it promised a flexibility it never actually had.
 */
export type StackElement =
  | 'div' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

export interface StackProps extends HTMLAttributes<HTMLElement>, SpacingProps, BoxSizeProps {
  as?: StackElement;
  direction?: Responsive<LayoutDirection>;
  spacing?: Responsive<LayoutSpacing>;
  align?: Responsive<LayoutAlign>;
  justify?: Responsive<LayoutJustify>;
  ref?: Ref<HTMLElement>;
}

export function Stack({
  as = 'div',
  direction = 'column',
  spacing: spacingProp = '300',
  align = 'start',
  justify,
  className,
  style,
  children,
  ...props
}: StackProps) {
  const { spacing, rest: afterSpacing } = splitSpacing(props);
  const { style: boxStyle, rest } = splitBoxSize(afterSpacing);
  // The union is the public contract. Internally it has to widen, or JSX tries
  // to satisfy every element in it at once and intersects their ref types down
  // to nothing.
  const Component = as as ElementType;

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
      style={{ ...boxStyle, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}
