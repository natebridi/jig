import type { ElementType, HTMLAttributes, Ref } from 'react';
import { adorn } from './adorn.css';

/**
 * The inline elements Adorn is willing to render as. Restricted rather than
 * open: `as` changes the semantics of the text, and an arbitrary ElementType
 * would let it render as something that has no business holding a phrase.
 */
export type AdornElement = 'span' | 'strong' | 'em' | 'b' | 'i' | 'code' | 'mark' | 'abbr';

/** Which semantic colour the text takes. Weight and slant come from `as`. */
export type AdornStyle = 'muted' | 'accent' | 'danger' | 'code';

export interface AdornProps extends HTMLAttributes<HTMLElement> {
  as?: AdornElement;
  with?: AdornStyle;
  ref?: Ref<HTMLElement>;
}

export function Adorn({ as = 'span', with: adornStyle, className, children, ...props }: AdornProps) {
  // See Stack: the union is the public contract, widened internally so JSX
  // does not intersect the ref types of every allowed element.
  const Component = as as ElementType;

  return (
    <Component
      className={[adornStyle && adorn({ with: adornStyle }), className].filter(Boolean).join(' ') || undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
