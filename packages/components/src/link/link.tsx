import { useRender } from '@base-ui/react/use-render';
import type { AnchorHTMLAttributes, Ref } from 'react';
import { Icon, type IconName } from '../icon';
import { button, buttonIconSize } from '../button/button.css';
import type { ButtonSize, ButtonVariant } from '../button';
import { visuallyHidden } from '../visually-hidden.css';
import { boxLink, externalMarker, textLabel, textLink } from './link.css';
import type { TypeStyles } from '../typography';

/**
 * How loud the link is.
 *
 * `text` is the ordinary underlined link in a sentence; the other five are
 * Button's, and mean exactly what they mean there. One axis rather than two
 * components, decided in apps/docs/decisions/0009-link.html (D1) — a caller
 * who starts with a text link and later wants it to look like a button changes
 * a prop, not a component.
 */
export type LinkVariant = 'text' | ButtonVariant;

/** What Link owns, whichever variant is in play. */
interface LinkOwnProps {
  /**
   * Required. A Link without a target is not a link — it is text, or a Button.
   * There is deliberately no `disabled`: `:disabled` never matches an anchor,
   * and an anchor without `href` is not focusable or activatable, so a
   * "disabled link" can only be announced, never reached (0009, settled list).
   */
  href: string;
  variant?: LinkVariant;
  /**
   * Sizes the five box variants. No effect on `variant="text"`, whose type
   * comes from the parent or from `with` rather than from this ramp (0009 D3).
   */
  size?: ButtonSize;
  /**
   * Names a Typography preset, for a text link with no typographic parent to
   * inherit from. When passed it beats the inherited type — an explicit prop
   * at the call site outranks an ambient value the caller did not set (0009
   * D3's outcome). Ignored by the box variants, which take Button's sizing.
   */
  with?: TypeStyles;
  /**
   * Underlines the text variant. On by default: with an inherited colour the
   * underline is the only thing distinguishing a link from the words around
   * it, so colour alone would be carrying the meaning (WCAG 1.4.1).
   *
   * `false` means never — there is no hover underline behind it. That makes it
   * right for somewhere the link is already obviously a link (a nav row, a
   * breadcrumb) and wrong in running text, which 0009 D5 accepted knowingly.
   */
  underline?: boolean;
  /**
   * Marks a link that leaves the app: the `arrow-square-out` glyph after the
   * label, `target="_blank"`, `rel="noopener noreferrer"`, and a visually
   * hidden "(opens in a new tab)" so the announcement matches what happens.
   *
   * The new tab is the component's opinion here, not the call site's — 0009 D6
   * chose the whole convention over a marker alone, which means a caller who
   * wants the glyph *without* a new tab wants `icon="arrow-square-out"` and
   * `iconPosition="end"` instead.
   */
  external?: boolean;
  /**
   * An icon from the curated set, sized and spaced by the component rather
   * than by the caller. Decorative — the label names the link.
   */
  icon?: IconName;
  /** Which side of the label the icon sits on. */
  iconPosition?: 'start' | 'end';
  /**
   * An element to render instead of the bare anchor — a router's link, so that
   * client-side navigation works without Jig depending on a router.
   *
   * Not an `as` prop wearing a different hat. `as` asks a component to *be*
   * another element and to take that element's prop types; this hands Link's
   * own props and classes to an element the caller already constructed, and
   * merges rather than overwrites, so Jig's `className` and the router's
   * `onClick` both survive. Link is an anchor either way. Decided in 0009 D4.
   */
  render?: useRender.RenderProp;
  ref?: Ref<HTMLAnchorElement>;
}

/** Attributes React declares that Link decides for itself. */
type Reserved = keyof LinkOwnProps | 'color';

/**
 * `iconPosition="end"` is a type error alongside `external`, which owns that
 * slot. A glyph at each end is legitimate, so `icon` at the default `start`
 * still works — it is only the collision that is refused. Carried from 0009
 * D6's outcome.
 */
type ExternalProps = { external: true; iconPosition?: 'start' | undefined };
type LocalProps = { external?: false | undefined; iconPosition?: 'start' | 'end' | undefined };

export type LinkProps = LinkOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, Reserved | 'iconPosition'> &
  (ExternalProps | LocalProps);

/**
 * A link.
 *
 * `href` is required. Defaults to `variant="text"` — an underlined link that
 * takes the colour and size of the text around it, so it fits whatever it is
 * dropped into. Set `with` to name a type preset when there is no surrounding
 * text to inherit from, or `underline={false}` where the link is already
 * obviously one, such as a nav row.
 *
 * The other variants are Button's, for a call to action that navigates. It is
 * still a link: announced as one, activated with Enter, and openable in a new
 * tab.
 *
 * `external` marks a link that leaves the app — it adds a trailing icon, opens
 * a new tab, and tells assistive technology that it will.
 *
 * Pass `render` to hand the markup to a router's own link component so
 * client-side navigation works.
 *
 * @example
 * <Typography as="p">
 *   Released under the <Link href="https://opensource.org/license/mit" external>MIT licence</Link>.
 * </Typography>
 *
 * <Link href="/dashboard" variant="primary" render={<NextLink href="/dashboard" />}>
 *   Open dashboard
 * </Link>
 */
export function Link({
  href,
  variant = 'text',
  size = 'md',
  with: typeStyle,
  underline = true,
  external = false,
  icon,
  iconPosition = 'start',
  render,
  className,
  children,
  ref,
  ...props
}: LinkProps) {
  const isText = variant === 'text';

  // The two code paths 0009 D2's outcome records. Only the box variants reach
  // the Button recipe; the text variant would be broken by its `inline-flex`.
  const classes = [
    isText
      ? textLink({ with: typeStyle })
      : [button({ color: variant, size }), boxLink].join(' '),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // The underline decorates the label, not the anchor — which also contains
  // the external marker and the space in front of it. See link.css.ts.
  const label = isText ? (
    <span className={textLabel[underline ? 'true' : 'false']}>{children}</span>
  ) : (
    children
  );

  // Sized to the label rather than to `buttonIconSize` when it is the external
  // marker, which sits inside the text rather than beside it.
  const glyph = icon ? <Icon icon={icon} size={isText ? '1em' : buttonIconSize} /> : null;

  const element = useRender({
    render,
    ref,
    defaultTagName: 'a',
    props: {
      ...props,
      href,
      className: classes,
      // Set after the spread: these are the whole of what `external` means, so
      // a consumer prop must not be able to leave the DOM contradicting it.
      ...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {}),
      children: (
        <>
          {iconPosition === 'start' && glyph}
          {label}
          {iconPosition === 'end' && glyph}
          {external && (
            <>
              {/* Its own text node, and load-bearing — see link.css.ts. */}
              {' '}
              <Icon icon="arrow-square-out" className={externalMarker} />
              {/*
                The announcement has to match the behaviour: a link that opens
                a tab without saying so is a real failure. English, because a
                component cannot reach a translation layer it knows nothing
                about — the cost 0009 D6 accepted.
              */}
              <span className={visuallyHidden}> (opens in a new tab)</span>
            </>
          )}
        </>
      ),
    },
  });

  return element;
}
