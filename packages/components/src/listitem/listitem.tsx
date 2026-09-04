import type { ElementType, MouseEventHandler, ReactNode, Ref } from 'react';
import { Icon, type IconName } from '../icon';
import type { PolymorphicProps } from '../polymorphic';
import {
  control,
  end as endClass,
  label as labelClass,
  row,
  start as startClass,
  tick,
  tickVisible,
} from './listitem.css';

/**
 * The elements a ListItem is willing to render as.
 *
 * Two, and only two. `li` is the default because a nav list is the case that
 * needs the semantics: a real `li` inside a list gets its position and count
 * computed by the browser, which is what produces "3 of 8". `div` is the
 * escape hatch for a row that is not in a list — a settings row, a card body —
 * and a caller who takes it owns `aria-setsize` and `aria-posinset` from then
 * on.
 *
 * This union is why `ListItem` has an `as` prop at all when the rule is that
 * polymorphism stays on layout and typography components. Decided in
 * apps/docs/decisions/0014-sidebar-navigation.html (D2), which amends that
 * rule to "layout and typography components, plus ListItem".
 */
export type ListItemElement = 'li' | 'div';

export type ListItemSize = 'sm' | 'md' | 'lg';

/** ListItem's own props. The element's own attributes are added by PolymorphicProps. */
export interface ListItemOwnProps {
  /** The row's text. Truncates rather than wrapping. */
  children?: ReactNode;
  /**
   * Content before the label — an icon, an avatar, an image, a swatch.
   *
   * **Non-interactive only.** It renders inside the row's anchor or button, so
   * a checkbox or a button here would be an interactive descendant of one,
   * which HTML forbids and browsers handle by making one of the two
   * unreachable. Put interactive content in `end`, which is a sibling.
   * Decided in 0014 D1.
   */
  start?: ReactNode;
  /**
   * Content after the label, outside the row's control — a count, a Token, an
   * IconButton, an overflow menu. The only slot that may hold something
   * interactive.
   */
  end?: ReactNode;
  /**
   * Makes the row a link. The anchor covers the indicator, `start`, the label
   * and the row's padding — everything except `end`.
   */
  href?: string;
  /** Makes the row a button. Ignored when `href` is set. */
  onClick?: MouseEventHandler<HTMLElement>;
  size?: ListItemSize;
  /**
   * Marks the row as the current one: the ghost active fill, plus
   * `aria-current="page"` on the link when there is one.
   */
  selected?: boolean;
  /**
   * An icon shown only while the row is selected, in a gutter at the leading
   * edge that every row reserves whether selected or not — so the labels form
   * one column instead of shifting as the selection moves.
   *
   * **Set it consistently across a list.** The gutter is reserved per row, so
   * a list where only some rows pass it will not line up. Nothing in the type
   * can enforce that. Decided in 0014 D3.
   */
  selectedIcon?: IconName | false;
  /** Disables a button row. Has no effect on a link — see Link's note (0009). */
  disabled?: boolean;
}

export type ListItemProps<E extends ListItemElement = 'li'> = PolymorphicProps<
  E,
  ListItemOwnProps
>;

/**
 * A row: `start`, a label, and `end`.
 *
 * The whole row is the link when `href` is set — everything except the `end`
 * slot, which sits outside it so it can hold a button. That split is the
 * component's central rule: **`start` takes non-interactive content, `end` is
 * the interactive one.** Nesting a button inside a link is invalid HTML and
 * leaves one of the two unreachable.
 *
 * `selected` marks the current row. Pair it with `selectedIcon` for a tick in
 * a reserved leading gutter, set consistently across the list so the labels
 * line up.
 *
 * Renders an `<li>`, for a list. Pass `as="div"` for a row that is not in one.
 *
 * @example
 * <ListItem href="/docs/tokens" start={<Icon icon="star" />} selected selectedIcon="check">
 *   Tokens
 * </ListItem>
 *
 * <ListItem start={<Icon icon="bell" />} end={<IconButton icon="x" label="Dismiss" />}>
 *   Notifications
 * </ListItem>
 */
export function ListItem<E extends ListItemElement = 'li'>({
  as,
  children,
  start,
  end,
  href,
  onClick,
  size = 'md',
  selected = false,
  selectedIcon = false,
  disabled,
  className,
  ...props
}: ListItemProps<E>) {
  // See Stack: widened for JSX only, the union is the public contract.
  const Component = (as ?? 'li') as ElementType;

  const isLink = href != null;
  const isButton = !isLink && onClick != null;
  const isInteractive = isLink || isButton;

  const inner = (
    <>
      {selectedIcon !== false && (
        <span className={[tick, selected ? tickVisible : undefined].filter(Boolean).join(' ')}>
          {/* Decorative: `selected` is already announced by aria-current, and
              a tick that also spoke would say it twice. */}
          <Icon icon={selectedIcon} size="1em" />
        </span>
      )}
      {start != null && <span className={startClass}>{start}</span>}
      <span className={labelClass}>{children}</span>
    </>
  );

  return (
    <Component
      className={[
        row({ size, selected, interactive: isInteractive && !disabled, disabled: isButton && disabled === true }),
        className,
      ].filter(Boolean).join(' ')}
      // A hook for the hover rule, and the only place the selected state is
      // written to the DOM besides aria-current — one attribute, so the two
      // cannot disagree.
      {...(selected ? { 'data-selected': '' } : {})}
      {...props}
    >
      {isLink ? (
        <a
          href={href}
          className={control}
          // The row is the current page, not merely styled as it. Set here
          // rather than on the row because the link is what is navigated to.
          {...(selected ? { 'aria-current': 'page' as const } : {})}
        >
          {inner}
        </a>
      ) : isButton ? (
        <button
          type="button"
          className={control}
          onClick={onClick}
          disabled={disabled}
          {...(selected ? { 'aria-current': 'true' as const } : {})}
        >
          {inner}
        </button>
      ) : (
        <span className={control}>{inner}</span>
      )}

      {end != null && <span className={endClass}>{end}</span>}
    </Component>
  );
}
