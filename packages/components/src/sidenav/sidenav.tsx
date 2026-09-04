import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { ScrollArea } from '../scrollarea';
import { warnInDev } from '../dev';
import { body, footer as footerClass, header as headerClass, nav, sections } from './sidenav.css';

export interface SideNavProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** The sections and rows. Normally `SideNavSection`s. */
  children?: ReactNode;
  /** Pinned above the scrolling area — a product mark, a search field. */
  header?: ReactNode;
  /** Pinned below it — an account row, a theme switch. */
  footer?: ReactNode;
  /**
   * The accessible name. Required in practice: a page with two navigation
   * landmarks and no names leaves a screen reader user choosing between
   * "navigation" and "navigation". A missing one logs a development warning.
   */
  'aria-label'?: string;
  className?: string;
  ref?: Ref<HTMLElement>;
}

/**
 * A sidebar navigation region.
 *
 * Renders a `<nav>` and takes its accessible name from `aria-label`. `header`
 * and `footer` are pinned; whatever is between them scrolls in a `ScrollArea`
 * when it overflows.
 *
 * It has no width of its own — that belongs to the layout around it, so give
 * it one with `style` or a parent grid column.
 *
 * @example
 * <SideNav aria-label="Docs" header={<Search />} footer={<AccountRow />} style={{ width: '16rem' }}>
 *   <SideNavSection label="Getting started" collapsible defaultOpen>
 *     <ListItem href="/docs/install">Installation</ListItem>
 *   </SideNavSection>
 * </SideNav>
 */
export function SideNav({
  children,
  header,
  footer,
  className,
  ref,
  ...props
}: SideNavProps) {
  const label = props['aria-label'];

  // The type cannot express "required only when the page has a second nav",
  // so the runtime check is what remains — the same answer Dialog reached for
  // its accessible name (0008).
  if (label == null) {
    warnInDev(
      'SideNav: pass `aria-label`. Without one the landmark is announced as just "navigation", which is ambiguous as soon as a page has two.'
    );
  }

  return (
    <nav ref={ref} className={[nav, className].filter(Boolean).join(' ')} {...props}>
      {header != null && <div className={headerClass}>{header}</div>}

      <ScrollArea className={body}>
        <div className={sections}>{children}</div>
      </ScrollArea>

      {footer != null && <div className={footerClass}>{footer}</div>}
    </nav>
  );
}
