import type { ElementType, HTMLAttributes, Ref } from 'react';
import { splitSpacing, type SpacingProps } from '../spacing';
import { typography } from './typography.css';

/**
 * The elements Typography is willing to render as. `with` chooses how the text
 * looks; `as` chooses what it means, and the two are deliberately independent —
 * a `heading01` preset on a `<p>` is a legitimate thing to want.
 */
export type TypographyElement =
  | 'p' | 'span' | 'div'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'label' | 'blockquote' | 'figcaption';

type TypeStyles =
  | 'display01' | 'display02' | 'display03' | 'display04' | 'display05' | 'display06'
  | 'heading01' | 'heading02' | 'heading03' | 'heading04' | 'heading05' | 'heading06'
  | 'body01' | 'body02' | 'caption01' | 'caption02';

export interface TypographyProps extends HTMLAttributes<HTMLElement>, SpacingProps {
  as?: TypographyElement;
  with?: TypeStyles;
  ref?: Ref<HTMLElement>;
}

export function Typography({ with: typeStyle = 'body01', as = 'div', className, children, ...props }: TypographyProps) {
  const { spacing, rest } = splitSpacing(props);
  // See Stack: the union is the public contract, widened internally so JSX
  // does not intersect the ref types of every allowed element.
  const Component = as as ElementType;

  return (
    <Component
      className={[
        typography({ style: typeStyle }),
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}
