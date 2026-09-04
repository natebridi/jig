import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { Collapsible } from '../collapsible';
import { heading, list, section } from './sidenavsection.css';

export interface SideNavSectionProps
  // `className`, `style` and `children` are re-declared below rather than
  // inherited: Collapsible narrows the first two to drop `| undefined`, and
  // under `exactOptionalPropertyTypes` the inherited forms cannot be spread
  // into it.
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'> {
  /**
   * The section's heading. Optional — a section with no label is just a
   * grouped list, which is how ungrouped items get their list semantics.
   */
  label?: ReactNode;
  /** The rows. Normally `ListItem`s. */
  children?: ReactNode;
  /**
   * Lets the section be folded away. Requires `label`, which becomes the
   * disclosure trigger — there is nothing else to press.
   *
   * Uses `Collapsible` rather than a disclosure of its own (0014 D4), so it
   * inherits the measured-height animation, the reduced-motion guard and the
   * `plus`/`minus` indicator 0013 D3 chose.
   */
  collapsible?: boolean;
  /** Open state for a collapsing section. Omit to let it manage its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A labelled group of rows inside a `SideNav`.
 *
 * `label` is optional; without one the section is a bare list, which is how a
 * run of ungrouped items still gets its list semantics. With `collapsible` the
 * label becomes a disclosure trigger and the rows fold away.
 *
 * The rows are wrapped in a `<ul role="list">` — the role as well as the
 * element, because WebKit drops list semantics from a `ul` styled with
 * `list-style: none`.
 *
 * @example
 * <SideNavSection label="Components" collapsible defaultOpen>
 *   <ListItem href="/docs/button">Button</ListItem>
 *   <ListItem href="/docs/combobox">Combobox</ListItem>
 * </SideNavSection>
 */
export function SideNavSection({
  label,
  children,
  collapsible = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
  style,
  ref,
  ...props
}: SideNavSectionProps) {
  const items = (
    <ul role="list" className={list}>
      {children}
    </ul>
  );

  if (collapsible && label != null) {
    return (
      <Collapsible
        // Conditionally, like the optional props below it. Jig declares refs as
        // `ref?: Ref<X>` rather than `ref?: Ref<X> | undefined`, which is fine
        // when the target is an intrinsic element and is not when one Jig
        // component wraps another under `exactOptionalPropertyTypes`.
        {...(ref ? { ref } : {})}
        className={[section, className].filter(Boolean).join(' ')}
        label={label}
        with="caption01"
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange ? { onOpenChange: (next: boolean) => onOpenChange(next) } : {})}
        {...(style ? { style } : {})}
        {...props}
      >
        {items}
      </Collapsible>
    );
  }

  return (
    <div
      ref={ref}
      className={[section, className].filter(Boolean).join(' ')}
      {...(style ? { style } : {})}
      {...props}
    >
      {label != null && <span className={heading}>{label}</span>}
      {items}
    </div>
  );
}
