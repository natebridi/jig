import type { ElementType } from 'react';
import type { PolymorphicProps } from '../polymorphic';
import { adorn } from './adorn.css';

/**
 * The inline elements Adorn is willing to render as. Restricted rather than
 * open: `as` changes the semantics of the text, and an arbitrary ElementType
 * would let it render as something that has no business holding a phrase.
 */
export type AdornElement = 'span' | 'strong' | 'em' | 'b' | 'i' | 'code' | 'mark' | 'abbr';

/**
 * Which semantic colour the text takes. Weight and slant come from `as`.
 *
 * `mono` is named for what it does — switch to the monospace family — rather
 * than for `<code>`, which it does not imply. Styling text as code without
 * marking it up as code is a legitimate thing to want (a keyboard shortcut, a
 * column of figures); pair it with `as="code"` when the semantics apply too.
 */
export type AdornStyle = 'muted' | 'accent' | 'danger' | 'mono';

/** Adorn's own props. The element's own attributes are added by PolymorphicProps. */
export interface AdornOwnProps {
  with?: AdornStyle;
}

export type AdornProps<E extends AdornElement = 'span'> = PolymorphicProps<E, AdornOwnProps>;

/**
 * Colours or emphasises a phrase inside a run of text.
 *
 * `with` sets the semantic colour; `as` sets the meaning and brings the
 * matching weight or slant with it, so use `as="strong"` for importance and
 * `as="em"` for stress rather than reaching for a visual-only prop.
 *
 * `with="mono"` switches to the monospace family without implying code — pair
 * it with `as="code"` when the content really is code.
 *
 * @example
 * <Typography as="p">
 *   Deleting this is <Adorn as="strong" with="danger">permanent</Adorn>.
 *   Run <Adorn as="code" with="mono">pnpm build</Adorn> first.
 * </Typography>
 */
export function Adorn<E extends AdornElement = 'span'>({
  as,
  with: adornStyle,
  className,
  children,
  ...props
}: AdornProps<E>) {
  // See Stack: widened for JSX only, the union is the public contract.
  const Component = (as ?? 'span') as ElementType;

  return (
    <Component
      className={[adornStyle && adorn({ with: adornStyle }), className].filter(Boolean).join(' ') || undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
