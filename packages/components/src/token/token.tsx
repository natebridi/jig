import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { Icon, type IconName } from '../icon';
import {
  label as labelClass,
  labelLink,
  linkToken,
  remove as removeClass,
  token,
  tokenIconSize,
} from './token.css';

/**
 * The hues a Token can take, in ramp order.
 *
 * A Token's colour says what kind of thing it is, not how loud it is, so this
 * names a hue rather than reusing Button's `primary | secondary | danger |
 * ghost`. Decided in apps/docs/decisions/0006-token.html (D2). Kept in step
 * with `TOKEN_HUES` in packages/tokens/src/utils.ts, which generates the
 * matching `color.token.*` sets.
 */
export type TokenColor =
  | 'warm'
  | 'cool'
  | 'blue'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'fuschia'
  | 'purple'
  | 'gray';

export type TokenSize = 'sm' | 'md' | 'lg';

/** What Token owns, whichever element it ends up rendering. */
interface TokenOwnProps {
  /** The label. Truncates with an ellipsis; it never wraps. */
  children?: ReactNode;
  color?: TokenColor;
  size?: TokenSize;
  /**
   * An icon from the curated set, sized and spaced by the Token rather than by
   * the caller. Decorative — the label names the token.
   */
  icon?: IconName;
  /**
   * Names the remove button for assistive technology. Derived as
   * `Remove {children}` when the label is a string, so this is only needed
   * when it is not — or when the derived name reads badly.
   */
  removeLabel?: string;
}

/** Attributes React declares that Token decides for itself. */
type Reserved = keyof TokenOwnProps | 'color';

/**
 * A link and nothing else: the whole pill is the `<a>`, because there is no
 * second control that would have to nest inside it.
 */
type LinkTokenProps = TokenOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, Reserved> & {
    href: string;
    onRemove?: never;
    ref?: Ref<HTMLAnchorElement>;
  };

/**
 * Removable, with or without a link. A `<button>` may not sit inside an
 * `<a>` — interactive content cannot nest — so the pill becomes a `<span>`
 * container and the anchor, where there is one, shrinks to the label.
 * Decided in 0006 D4.
 */
type RemovableTokenProps = TokenOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, Reserved> & {
    href?: string;
    /** Renders the × button. */
    onRemove: (event: MouseEvent<HTMLButtonElement>) => void;
    ref?: Ref<HTMLSpanElement>;
  };

/** Neither: a plain rendered value. */
type PlainTokenProps = TokenOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, Reserved> & {
    href?: never;
    onRemove?: never;
    ref?: Ref<HTMLSpanElement>;
  };

export type TokenProps = LinkTokenProps | RemovableTokenProps | PlainTokenProps;

/**
 * A small labelled value — a chip. A filter, a tag, a selected entry in a
 * multi-value field.
 *
 * `color` names a hue rather than an emphasis, because a token's colour says
 * what kind of thing it is, not how important it is.
 *
 * Passing `onRemove` adds a remove button, whose accessible name is derived
 * from the label; set `removeLabel` when the label is not a string. Passing
 * `href` makes it a link. With both, the link shrinks to the label so the two
 * controls stay separate.
 *
 * The label truncates with an ellipsis and never wraps — cap the width with
 * `style` where that matters. Its height matches an `Input` of the same `size`,
 * so it nests inside one cleanly.
 *
 * @example
 * <Token color="teal" icon="user" onRemove={() => remove(person)}>{person.name}</Token>
 */
export function Token({
  color = 'warm',
  size = 'md',
  icon,
  href,
  onRemove,
  removeLabel,
  className,
  children,
  ref,
  ...props
}: TokenProps) {
  const classes = [token({ color, size }), className].filter(Boolean).join(' ');
  const glyph = icon ? <Icon icon={icon} size={tokenIconSize} /> : null;

  // Nothing has to sit beside the label, so the anchor can be the whole pill —
  // one tab stop, and the entire pill is the target.
  if (href !== undefined && onRemove === undefined) {
    return (
      <a
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
        // The union is the public contract; which element the ref lands on is
        // decided by this branch, which TypeScript cannot follow from the
        // destructured props.
        ref={ref as Ref<HTMLAnchorElement>}
        className={[classes, linkToken].join(' ')}
      >
        {glyph}
        <span className={labelClass}>{children}</span>
      </a>
    );
  }

  return (
    <span
      {...(props as HTMLAttributes<HTMLSpanElement>)}
      ref={ref as Ref<HTMLSpanElement>}
      className={classes}
    >
      {glyph}
      {href !== undefined ? (
        <a href={href} className={[labelClass, labelLink].join(' ')}>
          {children}
        </a>
      ) : (
        <span className={labelClass}>{children}</span>
      )}
      {onRemove !== undefined && (
        <button
          // A bare <button> submits whatever form it happens to sit in, and a
          // token row inside a field is exactly where that would happen.
          type="button"
          className={removeClass}
          // The token carries a visible label, so unlike IconButton the name
          // can be borrowed from it rather than demanded of the caller.
          aria-label={
            removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove')
          }
          onClick={onRemove}
        >
          <Icon icon="x" size={tokenIconSize} />
        </button>
      )}
    </span>
  );
}
