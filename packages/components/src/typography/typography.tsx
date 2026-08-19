import type { ElementType } from 'react';
import { splitSpacing, type SpacingProps } from '../spacing';
import type { PolymorphicProps } from '../polymorphic';
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

/** The type presets. Exported so consumers building wrappers can name one. */
export type TypeStyles =
  | 'display01' | 'display02' | 'display03' | 'display04' | 'display05' | 'display06'
  | 'heading01' | 'heading02' | 'heading03' | 'heading04' | 'heading05' | 'heading06'
  | 'body01' | 'body02' | 'caption01' | 'caption02';

/** Typography's own props. The element's own attributes are added by PolymorphicProps. */
export interface TypographyOwnProps extends SpacingProps {
  with?: TypeStyles;
  /**
   * Evens out the line lengths rather than filling each line before breaking,
   * so a heading does not end on a single orphaned word. Meant for short text
   * that wraps to a few lines — headings, standfirsts, captions; browsers cap
   * `text-wrap: balance` at a handful of lines, so it does nothing for a
   * paragraph.
   */
  balance?: boolean;
}

export type TypographyProps<E extends TypographyElement = 'div'> =
  PolymorphicProps<E, TypographyOwnProps>;

export function Typography<E extends TypographyElement = 'div'>({
  with: typeStyle = 'body01',
  balance = false,
  as,
  className,
  children,
  ...props
}: TypographyProps<E>) {
  const { spacing, rest } = splitSpacing(props);
  // See Stack: widened for JSX only, the union is the public contract.
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      className={[
        typography({ style: typeStyle, balance }),
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}
